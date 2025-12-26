<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePatientReportRequest;
use App\Http\Requests\Admin\UpdatePatientReportRequest;
use App\Models\Patient;
use App\Models\PatientReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PatientReportController extends Controller
{
    public function index(Request $request): Response
    {
        $query = PatientReport::with(['patient.user', 'uploadedBy']);

        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->has('report_type')) {
            $query->where('report_type', $request->report_type);
        }

        $reports = $query->latest('report_date')->paginate(20);
        $patients = Patient::with('user')->get();

        return Inertia::render('Admin/PatientReports/Index', [
            'reports' => $reports,
            'patients' => $patients,
            'filters' => $request->only(['patient_id', 'report_type']),
        ]);
    }

    public function create(Request $request): Response
    {
        $patients = Patient::with('user')->get();

        $selectedPatient = null;
        if ($request->has('patient_id')) {
            $selectedPatient = Patient::with('user')->findOrFail($request->patient_id);
        }

        return Inertia::render('Admin/PatientReports/Create', [
            'patients' => $patients,
            'selectedPatient' => $selectedPatient,
        ]);
    }

    public function store(StorePatientReportRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Store file
        $filePath = $request->file('file')->store('patient-reports', 'public');

        PatientReport::create([
            'patient_id' => $validated['patient_id'],
            'report_type' => $validated['report_type'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'file_path' => $filePath,
            'report_date' => $validated['report_date'],
            'uploaded_by' => auth()->id(),
        ]);

        return redirect()->route('admin.patient-reports.index', ['patient_id' => $validated['patient_id']])
            ->with('success', 'Patient report uploaded successfully.');
    }

    public function show(PatientReport $patientReport): Response
    {
        $patientReport->load(['patient.user', 'uploadedBy']);

        return Inertia::render('Admin/PatientReports/Show', [
            'report' => $patientReport,
        ]);
    }

    public function edit(PatientReport $patientReport): Response
    {
        $patientReport->load(['patient.user']);

        return Inertia::render('Admin/PatientReports/Edit', [
            'report' => $patientReport,
        ]);
    }

    public function update(UpdatePatientReportRequest $request, PatientReport $patientReport): RedirectResponse
    {
        $validated = $request->validated();

        // Handle file update
        if ($request->hasFile('file')) {
            // Delete old file
            if ($patientReport->file_path) {
                Storage::disk('public')->delete($patientReport->file_path);
            }
            $validated['file_path'] = $request->file('file')->store('patient-reports', 'public');
        }

        $patientReport->update($validated);

        return redirect()->route('admin.patient-reports.show', $patientReport)
            ->with('success', 'Patient report updated successfully.');
    }

    public function destroy(PatientReport $patientReport): RedirectResponse
    {
        // Delete file
        if ($patientReport->file_path) {
            Storage::disk('public')->delete($patientReport->file_path);
        }

        $patientId = $patientReport->patient_id;
        $patientReport->delete();

        return redirect()->route('admin.patient-reports.index', ['patient_id' => $patientId])
            ->with('success', 'Patient report deleted successfully.');
    }

    public function download(PatientReport $patientReport)
    {
        if (! Storage::disk('public')->exists($patientReport->file_path)) {
            abort(404, 'File not found');
        }

        return Storage::disk('public')->download($patientReport->file_path);
    }
}
