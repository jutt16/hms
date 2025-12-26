<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\MedicalRecord;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicalRecordController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $doctor = $user->doctor;

        if (! $doctor) {
            abort(403, 'Doctor profile not found.');
        }

        $medicalRecords = MedicalRecord::where('doctor_id', $doctor->id)
            ->with(['patient.user', 'appointment'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Doctor/MedicalRecords/Index', [
            'medicalRecords' => $medicalRecords,
        ]);
    }

    public function create(Request $request): Response
    {
        $appointmentId = $request->get('appointment_id');
        $appointment = $appointmentId ? Appointment::with(['patient.user'])->findOrFail($appointmentId) : null;

        $patients = Patient::with('user')->get();

        return Inertia::render('Doctor/MedicalRecords/Create', [
            'appointment' => $appointment,
            'patients' => $patients,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $doctor = $user->doctor;

        if (! $doctor) {
            abort(403, 'Doctor profile not found.');
        }

        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'chief_complaint' => ['nullable', 'string'],
            'history_of_present_illness' => ['nullable', 'string'],
            'physical_examination' => ['nullable', 'string'],
            'diagnosis' => ['nullable', 'string'],
            'treatment_plan' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['doctor_id'] = $doctor->id;
        $validated['created_by'] = $user->id;

        MedicalRecord::create($validated);

        return redirect()->route('doctor.medical-records.index')
            ->with('success', 'Medical record created successfully.');
    }

    public function show(MedicalRecord $medicalRecord): Response
    {
        $medicalRecord->load([
            'patient.user',
            'doctor.user',
            'appointment',
            'creator',
        ]);

        return Inertia::render('Doctor/MedicalRecords/Show', [
            'medicalRecord' => $medicalRecord,
        ]);
    }

    public function edit(MedicalRecord $medicalRecord): Response
    {
        $medicalRecord->load(['patient.user', 'appointment']);

        return Inertia::render('Doctor/MedicalRecords/Edit', [
            'medicalRecord' => $medicalRecord,
        ]);
    }

    public function update(Request $request, MedicalRecord $medicalRecord): RedirectResponse
    {
        $validated = $request->validate([
            'chief_complaint' => ['nullable', 'string'],
            'history_of_present_illness' => ['nullable', 'string'],
            'physical_examination' => ['nullable', 'string'],
            'diagnosis' => ['nullable', 'string'],
            'treatment_plan' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $medicalRecord->update($validated);

        return redirect()->route('doctor.medical-records.index')
            ->with('success', 'Medical record updated successfully.');
    }
}
