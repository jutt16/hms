<?php

namespace App\Services;

use App\Models\Admission;
use App\Models\Bed;
use App\Models\Ward;
use Illuminate\Support\Str;

class IpdService
{
    public function admitPatient(array $data, int $admittedBy): Admission
    {
        $admissionNumber = 'ADM-'.strtoupper(Str::random(8));

        // Update bed status
        $bed = Bed::findOrFail($data['bed_id']);
        $bed->update(['status' => 'occupied']);

        // Update ward available beds count
        $ward = Ward::findOrFail($data['ward_id']);
        $ward->decrement('available_beds');

        $admission = Admission::create([
            'admission_number' => $admissionNumber,
            'patient_id' => $data['patient_id'],
            'doctor_id' => $data['doctor_id'],
            'bed_id' => $data['bed_id'],
            'ward_id' => $data['ward_id'],
            'admission_date' => $data['admission_date'],
            'status' => 'admitted',
            'admission_reason' => $data['admission_reason'],
            'diagnosis' => $data['diagnosis'] ?? null,
            'notes' => $data['notes'] ?? null,
            'admitted_by' => $admittedBy,
        ]);

        return $admission;
    }

    public function dischargePatient(Admission $admission, array $data, int $dischargedBy): Admission
    {
        // Update bed status
        $bed = $admission->bed;
        $bed->update(['status' => 'available']);

        // Update ward available beds count
        $ward = $admission->ward;
        $ward->increment('available_beds');

        $admission->update([
            'discharge_date' => $data['discharge_date'] ?? now(),
            'status' => 'discharged',
            'discharge_summary' => $data['discharge_summary'] ?? null,
            'discharged_by' => $dischargedBy,
        ]);

        return $admission;
    }

    public function getAvailableBeds(?int $wardId = null)
    {
        $query = Bed::where('status', 'available')
            ->where('is_active', true)
            ->with('ward');

        if ($wardId) {
            $query->where('ward_id', $wardId);
        }

        return $query->get();
    }

    public function getWardOccupancy(int $wardId): array
    {
        $ward = Ward::findOrFail($wardId);
        $occupiedBeds = Bed::where('ward_id', $wardId)
            ->where('status', 'occupied')
            ->count();
        $availableBeds = Bed::where('ward_id', $wardId)
            ->where('status', 'available')
            ->count();

        return [
            'total_beds' => $ward->total_beds,
            'occupied_beds' => $occupiedBeds,
            'available_beds' => $availableBeds,
            'occupancy_rate' => $ward->total_beds > 0 ? ($occupiedBeds / $ward->total_beds) * 100 : 0,
        ];
    }
}
