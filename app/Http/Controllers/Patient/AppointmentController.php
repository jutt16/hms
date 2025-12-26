<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Appointment;
use App\Models\Doctor;
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
        $patient = $user->patient;

        if (! $patient) {
            abort(403, 'Patient profile not found.');
        }

        $status = $request->get('status');
        $appointments = $this->appointmentService->getPatientAppointments($patient->id, $status);

        return Inertia::render('Patient/Appointments/Index', [
            'appointments' => $appointments,
            'filters' => ['status' => $status],
        ]);
    }

    public function create(): Response
    {
        $doctors = Doctor::with('user')
            ->where('is_available', true)
            ->get();

        return Inertia::render('Patient/Appointments/Create', [
            'doctors' => $doctors,
        ]);
    }

    public function store(StoreAppointmentRequest $request): RedirectResponse
    {
        $user = $request->user();
        $patient = $user->patient;

        if (! $patient) {
            abort(403, 'Patient profile not found.');
        }

        $this->appointmentService->createAppointment([
            'patient_id' => $patient->id,
            'doctor_id' => $request->doctor_id,
            'appointment_date' => $request->appointment_date,
            'reason' => $request->reason,
            'notes' => $request->notes,
        ], $user->id);

        return redirect()->route('patient.appointments.index')
            ->with('success', 'Appointment booked successfully.');
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

        return Inertia::render('Patient/Appointments/Show', [
            'appointment' => $appointment,
        ]);
    }

    public function cancel(Appointment $appointment): RedirectResponse
    {
        if ($appointment->status === 'completed' || $appointment->status === 'cancelled') {
            return redirect()->back()->with('error', 'Cannot cancel this appointment.');
        }

        $this->appointmentService->updateAppointmentStatus($appointment, 'cancelled');

        return redirect()->back()->with('success', 'Appointment cancelled successfully.');
    }
}
