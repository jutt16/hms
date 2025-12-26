<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrescriptionController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $patient = $user->patient;

        if (! $patient) {
            abort(403, 'Patient profile not found.');
        }

        $prescriptions = Prescription::where('patient_id', $patient->id)
            ->with(['doctor.user', 'appointment', 'items.medicine'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Patient/Prescriptions/Index', [
            'prescriptions' => $prescriptions,
        ]);
    }

    public function show(Request $request, Prescription $prescription): Response
    {
        $user = $request->user();
        $patient = $user->patient;

        if ($prescription->patient_id !== $patient->id) {
            abort(403);
        }

        $prescription->load([
            'patient.user',
            'doctor.user',
            'appointment',
            'items.medicine',
        ]);

        return Inertia::render('Patient/Prescriptions/Show', [
            'prescription' => $prescription,
        ]);
    }
}
