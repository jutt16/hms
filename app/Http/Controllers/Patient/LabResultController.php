<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\LabResult;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LabResultController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $patient = $user->patient;

        if (! $patient) {
            abort(403, 'Patient profile not found.');
        }

        $labResults = LabResult::where('patient_id', $patient->id)
            ->with(['labTest', 'doctor.user', 'appointment'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Patient/LabResults/Index', [
            'labResults' => $labResults,
        ]);
    }

    public function show(Request $request, LabResult $labResult): Response
    {
        $user = $request->user();
        $patient = $user->patient;

        if ($labResult->patient_id !== $patient->id) {
            abort(403);
        }

        $labResult->load([
            'patient.user',
            'doctor.user',
            'labTest',
            'appointment',
            'performer',
        ]);

        return Inertia::render('Patient/LabResults/Show', [
            'labResult' => $labResult,
        ]);
    }
}
