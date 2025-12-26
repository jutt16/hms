<?php

namespace App\Services;

use App\Models\Appointment;
use Illuminate\Support\Str;

class AppointmentService
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function createAppointment(array $data, int $createdBy): Appointment
    {
        $appointmentNumber = 'APT-'.strtoupper(Str::random(8));

        // Generate token number based on doctor and date
        $tokenNumber = $this->generateTokenNumber($data['doctor_id'], $data['appointment_date']);

        $appointment = Appointment::create([
            'appointment_number' => $appointmentNumber,
            'token_number' => $tokenNumber,
            'patient_id' => $data['patient_id'],
            'doctor_id' => $data['doctor_id'],
            'appointment_date' => $data['appointment_date'],
            'status' => 'scheduled',
            'reason' => $data['reason'] ?? null,
            'notes' => $data['notes'] ?? null,
            'created_by' => $createdBy,
        ]);

        $this->notificationService->sendAppointmentConfirmation($appointment);

        return $appointment;
    }

    protected function generateTokenNumber(int $doctorId, string $appointmentDate): string
    {
        $date = \Carbon\Carbon::parse($appointmentDate)->format('Y-m-d');

        $count = Appointment::where('doctor_id', $doctorId)
            ->whereDate('appointment_date', $date)
            ->count();

        return str_pad((string) ($count + 1), 3, '0', STR_PAD_LEFT);
    }

    public function updateAppointmentStatus(Appointment $appointment, string $status): Appointment
    {
        $appointment->update(['status' => $status]);

        if ($status === 'completed') {
            $this->notificationService->sendAppointmentCompleted($appointment);
        } elseif ($status === 'cancelled') {
            $this->notificationService->sendAppointmentCancelled($appointment);
        }

        return $appointment;
    }

    public function getDoctorAppointments(int $doctorId, ?string $status = null)
    {
        $query = Appointment::where('doctor_id', $doctorId)
            ->with(['patient.user', 'doctor.user']);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('appointment_date', 'asc')->get();
    }

    public function getPatientAppointments(int $patientId, ?string $status = null)
    {
        $query = Appointment::where('patient_id', $patientId)
            ->with(['doctor.user']);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('appointment_date', 'desc')->get();
    }
}
