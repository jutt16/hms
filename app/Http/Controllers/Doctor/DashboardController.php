<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
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
        $doctor = $user->doctor;

        if (! $doctor) {
            abort(403, 'Doctor profile not found.');
        }

        $todayAppointments = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('appointment_date', today())
            ->with(['patient.user'])
            ->orderBy('appointment_date')
            ->get();

        $upcomingAppointments = Appointment::where('doctor_id', $doctor->id)
            ->where('status', 'scheduled')
            ->where('appointment_date', '>', now())
            ->with(['patient.user'])
            ->orderBy('appointment_date')
            ->limit(10)
            ->get();

        $stats = [
            'today_appointments' => $todayAppointments->count(),
            'upcoming_appointments' => Appointment::where('doctor_id', $doctor->id)
                ->where('status', 'scheduled')
                ->where('appointment_date', '>', now())
                ->count(),
            'completed_today' => Appointment::where('doctor_id', $doctor->id)
                ->where('status', 'completed')
                ->whereDate('appointment_date', today())
                ->count(),
            'pending_appointments' => Appointment::where('doctor_id', $doctor->id)
                ->where('status', 'scheduled')
                ->count(),
        ];

        return Inertia::render('Doctor/Dashboard', [
            'stats' => $stats,
            'todayAppointments' => $todayAppointments,
            'upcomingAppointments' => $upcomingAppointments,
        ]);
    }
}
