<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePrescriptionRequest;
use App\Models\Appointment;
use App\Models\Prescription;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PrescriptionController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $doctor = $user->doctor;

        if (! $doctor) {
            abort(403, 'Doctor profile not found.');
        }

        $prescriptions = Prescription::where('doctor_id', $doctor->id)
            ->with(['patient.user', 'appointment'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Doctor/Prescriptions/Index', [
            'prescriptions' => $prescriptions,
        ]);
    }

    public function create(Request $request): Response
    {
        $appointmentId = $request->get('appointment_id');
        $appointment = $appointmentId ? Appointment::with(['patient.user'])->findOrFail($appointmentId) : null;

        return Inertia::render('Doctor/Prescriptions/Create', [
            'appointment' => $appointment,
        ]);
    }

    public function store(StorePrescriptionRequest $request): RedirectResponse
    {
        $user = $request->user();
        $doctor = $user->doctor;

        if (! $doctor) {
            abort(403, 'Doctor profile not found.');
        }

        $prescriptionNumber = 'PRES-'.strtoupper(Str::random(8));

        $prescription = Prescription::create([
            'prescription_number' => $prescriptionNumber,
            'patient_id' => $request->patient_id,
            'doctor_id' => $doctor->id,
            'appointment_id' => $request->appointment_id,
            'notes' => $request->notes,
            'valid_until' => $request->valid_until,
            'status' => 'active',
        ]);

        foreach ($request->items as $item) {
            $prescription->items()->create([
                'medicine_id' => $item['medicine_id'],
                'dosage' => $item['dosage'],
                'frequency' => $item['frequency'],
                'quantity' => $item['quantity'],
                'instructions' => $item['instructions'] ?? null,
            ]);
        }

        $this->notificationService->sendPrescriptionReady($prescription);

        return redirect()->route('doctor.prescriptions.index')
            ->with('success', 'Prescription created successfully.');
    }

    public function show(Prescription $prescription): Response
    {
        $prescription->load([
            'patient.user',
            'doctor.user',
            'appointment',
            'items.medicine',
        ]);

        return Inertia::render('Doctor/Prescriptions/Show', [
            'prescription' => $prescription,
        ]);
    }
}
