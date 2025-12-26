<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Bill;
use App\Models\Prescription;
use App\Services\AppointmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private AppointmentService $appointmentService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $patient = $user->patient;

        if (! $patient) {
            return Inertia::render('Patient/Dashboard', [
                'error' => 'Patient profile not found. Please contact administrator to set up your patient profile.',
                'stats' => [
                    'upcoming_appointments' => 0,
                    'total_appointments' => 0,
                    'pending_bills' => 0,
                    'total_prescriptions' => 0,
                ],
                'upcomingAppointments' => [],
                'recentPrescriptions' => [],
                'pendingBills' => [],
            ]);
        }

        $upcomingAppointments = Appointment::where('patient_id', $patient->id)
            ->where('status', 'scheduled')
            ->where('appointment_date', '>', now())
            ->with(['doctor.user'])
            ->orderBy('appointment_date')
            ->limit(5)
            ->get();

        $recentPrescriptions = Prescription::where('patient_id', $patient->id)
            ->with(['doctor.user'])
            ->latest()
            ->limit(5)
            ->get();

        $pendingBills = Bill::where('patient_id', $patient->id)
            ->where('status', '!=', 'paid')
            ->latest()
            ->limit(5)
            ->get();

        $stats = [
            'upcoming_appointments' => Appointment::where('patient_id', $patient->id)
                ->where('status', 'scheduled')
                ->where('appointment_date', '>', now())
                ->count(),
            'total_appointments' => Appointment::where('patient_id', $patient->id)->count(),
            'pending_bills' => Bill::where('patient_id', $patient->id)
                ->where('status', '!=', 'paid')
                ->count(),
            'total_prescriptions' => Prescription::where('patient_id', $patient->id)->count(),
        ];

        return Inertia::render('Patient/Dashboard', [
            'stats' => $stats,
            'upcomingAppointments' => $upcomingAppointments,
            'recentPrescriptions' => $recentPrescriptions,
            'pendingBills' => $pendingBills,
        ]);
    }
}
