<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
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

        $status = $request->get('status');
        $appointments = $this->appointmentService->getDoctorAppointments($doctor->id, $status);

        return Inertia::render('Doctor/Appointments/Index', [
            'appointments' => $appointments,
            'filters' => ['status' => $status],
        ]);
    }

    public function show(Appointment $appointment): Response
    {
        $appointment->load([
            'patient.user',
            'doctor.user',
            'medicalRecord',
            'prescription.items.medicine',
            'labResults.labTest',
        ]);

        return Inertia::render('Doctor/Appointments/Show', [
            'appointment' => $appointment,
        ]);
    }

    public function updateStatus(Request $request, Appointment $appointment): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:scheduled,confirmed,completed,cancelled'],
            'diagnosis' => ['nullable', 'string'],
        ]);

        $this->appointmentService->updateAppointmentStatus($appointment, $request->status);

        if ($request->filled('diagnosis')) {
            $appointment->update(['diagnosis' => $request->diagnosis]);
        }

        return redirect()->back()->with('success', 'Appointment status updated successfully.');
    }
}
