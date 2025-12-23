<?php

namespace App\Services;

use App\Models\Appointment;

class NotificationService
{
    public function sendAppointmentConfirmation(Appointment $appointment): void
    {
        $patient = $appointment->patient->user;
        $doctor = $appointment->doctor->user;

        $patient->notify(new \App\Notifications\AppointmentScheduled($appointment));
        $doctor->notify(new \App\Notifications\NewAppointment($appointment));
    }

    public function sendAppointmentCompleted(Appointment $appointment): void
    {
        $patient = $appointment->patient->user;
        $patient->notify(new \App\Notifications\AppointmentCompleted($appointment));
    }

    public function sendAppointmentCancelled(Appointment $appointment): void
    {
        $patient = $appointment->patient->user;
        $doctor = $appointment->doctor->user;

        $patient->notify(new \App\Notifications\AppointmentCancelled($appointment));
        $doctor->notify(new \App\Notifications\AppointmentCancelled($appointment));
    }

    public function sendPrescriptionReady(\App\Models\Prescription $prescription): void
    {
        $patient = $prescription->patient->user;
        $patient->notify(new \App\Notifications\PrescriptionReady($prescription));
    }

    public function sendLabResultReady(\App\Models\LabResult $labResult): void
    {
        $patient = $labResult->patient->user;
        $patient->notify(new \App\Notifications\LabResultReady($labResult));
    }

    public function sendBillGenerated(\App\Models\Bill $bill): void
    {
        if ($bill->patient) {
            $patient = $bill->patient->user;
            $patient->notify(new \App\Notifications\BillGenerated($bill));
        }
    }
}
