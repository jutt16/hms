<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function index(): Response
    {
        $patients = Patient::with('user')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Patients/Index', [
            'patients' => $patients,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Patients/Create');
    }

    public function store(StorePatientRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'phone' => $request->phone,
            'address' => $request->address,
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
        ]);

        $user->assignRole('patient');

        $patientId = 'PAT-'.str_pad(Patient::count() + 1, 6, '0', STR_PAD_LEFT);

        Patient::create([
            'user_id' => $user->id,
            'patient_id' => $patientId,
            'blood_group' => $request->blood_group,
            'allergies' => $request->allergies,
            'medical_history' => $request->medical_history,
            'emergency_contact_name' => $request->emergency_contact_name,
            'emergency_contact_phone' => $request->emergency_contact_phone,
            'emergency_contact_relation' => $request->emergency_contact_relation,
            'insurance_provider' => $request->insurance_provider,
            'insurance_policy_number' => $request->insurance_policy_number,
        ]);

        return redirect()->route('admin.patients.index')
            ->with('success', 'Patient created successfully.');
    }

    public function show(Patient $patient): Response
    {
        $patient->load(['user', 'appointments.doctor.user', 'prescriptions', 'labResults', 'bills']);

        return Inertia::render('Admin/Patients/Show', [
            'patient' => $patient,
        ]);
    }

    public function edit(Patient $patient): Response
    {
        $patient->load('user');

        return Inertia::render('Admin/Patients/Edit', [
            'patient' => $patient,
        ]);
    }

    public function update(UpdatePatientRequest $request, Patient $patient): RedirectResponse
    {
        $patient->user->update($request->only(['name', 'email', 'phone', 'address', 'date_of_birth', 'gender']));

        if ($request->filled('password')) {
            $patient->user->update(['password' => $request->password]);
        }

        $patient->update($request->only([
            'blood_group',
            'allergies',
            'medical_history',
            'emergency_contact_name',
            'emergency_contact_phone',
            'emergency_contact_relation',
            'insurance_provider',
            'insurance_policy_number',
        ]));

        return redirect()->route('admin.patients.index')
            ->with('success', 'Patient updated successfully.');
    }

    public function destroy(Patient $patient): RedirectResponse
    {
        $patient->user->delete();
        $patient->delete();

        return redirect()->route('admin.patients.index')
            ->with('success', 'Patient deleted successfully.');
    }
}
