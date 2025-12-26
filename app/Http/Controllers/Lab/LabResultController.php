<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLabResultRequest;
use App\Models\Appointment;
use App\Models\LabResult;
use App\Models\LabTest;
use App\Models\Patient;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LabResultController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function index(Request $request): Response
    {
        $status = $request->get('status');
        $query = LabResult::with(['patient.user', 'labTest', 'doctor.user']);

        if ($status) {
            $query->where('status', $status);
        }

        $labResults = $query->latest()->paginate(15);

        return Inertia::render('Lab/LabResults/Index', [
            'labResults' => $labResults,
            'filters' => ['status' => $status],
        ]);
    }

    public function create(Request $request): Response
    {
        $appointmentId = $request->get('appointment_id');
        $appointment = $appointmentId ? Appointment::with(['patient.user'])->findOrFail($appointmentId) : null;

        $labTests = LabTest::where('is_active', true)->get();
        $patients = Patient::with('user')->get();

        return Inertia::render('Lab/LabResults/Create', [
            'appointment' => $appointment,
            'labTests' => $labTests,
            'patients' => $patients,
        ]);
    }

    public function store(StoreLabResultRequest $request): RedirectResponse
    {
        $resultNumber = 'LAB-'.strtoupper(Str::random(8));

        $labResult = LabResult::create([
            'result_number' => $resultNumber,
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->doctor_id,
            'lab_test_id' => $request->lab_test_id,
            'appointment_id' => $request->appointment_id,
            'result_value' => $request->result_value,
            'reference_range' => $request->reference_range,
            'status' => $request->status ?? 'completed',
            'notes' => $request->notes,
            'test_date' => $request->test_date,
            'result_date' => $request->result_date ?? now(),
            'performed_by' => $request->user()->id,
        ]);

        $this->notificationService->sendLabResultReady($labResult);

        return redirect()->route('lab.lab-results.index')
            ->with('success', 'Lab result created successfully.');
    }

    public function show(LabResult $labResult): Response
    {
        $labResult->load([
            'patient.user',
            'doctor.user',
            'labTest',
            'appointment',
            'performer',
        ]);

        return Inertia::render('Lab/LabResults/Show', [
            'labResult' => $labResult,
        ]);
    }

    public function edit(LabResult $labResult): Response
    {
        $labResult->load(['patient.user', 'labTest', 'appointment']);
        $labTests = LabTest::where('is_active', true)->get();

        return Inertia::render('Lab/LabResults/Edit', [
            'labResult' => $labResult,
            'labTests' => $labTests,
        ]);
    }

    public function update(Request $request, LabResult $labResult): RedirectResponse
    {
        $validated = $request->validate([
            'result_value' => ['nullable', 'string'],
            'reference_range' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,completed'],
            'notes' => ['nullable', 'string'],
            'test_date' => ['nullable', 'date'],
            'result_date' => ['nullable', 'date'],
        ]);

        $labResult->update($validated);

        if ($labResult->status === 'completed' && ! $labResult->wasChanged('status')) {
            $this->notificationService->sendLabResultReady($labResult);
        }

        return redirect()->route('lab.lab-results.index')
            ->with('success', 'Lab result updated successfully.');
    }
}
