<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrCodeService
{
    public function generateForPatient(string $patientId): string
    {
        // Generate QR code with patient ID data
        $qrData = json_encode([
            'type' => 'patient',
            'patient_id' => $patientId,
            'timestamp' => now()->toIso8601String(),
        ]);
        $qrCodePath = 'qrcodes/patient-'.$patientId.'.svg';

        $qrCode = QrCode::size(300)
            ->format('svg')
            ->generate($qrData);

        Storage::disk('public')->put($qrCodePath, $qrCode);

        return $qrCodePath;
    }

    public function generateQrCode(string $data, string $filename): string
    {
        $qrCodePath = 'qrcodes/'.$filename.'.svg';

        $qrCode = QrCode::size(300)
            ->format('svg')
            ->generate($data);

        Storage::disk('public')->put($qrCodePath, $qrCode);

        return $qrCodePath;
    }

    public function getQrCodeUrl(string $path): string
    {
        return Storage::disk('public')->url($path);
    }
}
