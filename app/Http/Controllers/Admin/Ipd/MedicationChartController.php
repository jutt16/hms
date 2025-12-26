<?php

namespace App\Http\Controllers\Admin\Ipd;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Ipd\StoreMedicationChartRequest;
use App\Http\Requests\Admin\Ipd\UpdateMedicationChartRequest;
use App\Models\Admission;
use App\Models\MedicationChart;
use App\Models\Medicine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicationChartController extends Controller
{
    public function index(Request $request): Response
    {
        $query = MedicationChart::with(['patient.user', 'admission', 'medicine', 'prescribedBy']);

        if ($request->has('admission_id')) {
            $query->where('admission_id', $request->admission_id);
        }

        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $medicationCharts = $query->latest()->paginate(20);

        return Inertia::render('Admin/Ipd/MedicationCharts/Index', [
            'medicationCharts' => $medicationCharts,
            'filters' => $request->only(['admission_id', 'patient_id', 'status']),
        ]);
    }

    public function create(Request $request): Response
    {
        $admissions = Admission::where('status', 'admitted')
            ->with(['patient.user'])
            ->get();

        $medicines = Medicine::where('is_active', true)->get();

        $admission = null;
        if ($request->has('admission_id')) {
            $admission = Admission::with(['patient.user'])->findOrFail($request->admission_id);
        }

        return Inertia::render('Admin/Ipd/MedicationCharts/Create', [
            'admissions' => $admissions,
            'medicines' => $medicines,
            'admission' => $admission,
        ]);
    }

    public function store(StoreMedicationChartRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['prescribed_by'] = auth()->id();
        $validated['status'] = $validated['status'] ?? 'active';

        MedicationChart::create($validated);

        return redirect()->route('admin.ipd.medication-charts.index', ['admission_id' => $validated['admission_id']])
            ->with('success', 'Medication chart entry created successfully.');
    }

    public function show(MedicationChart $medicationChart): Response
    {
        $medicationChart->load(['patient.user', 'admission', 'medicine', 'prescribedBy']);

        return Inertia::render('Admin/Ipd/MedicationCharts/Show', [
            'medicationChart' => $medicationChart,
        ]);
    }

    public function edit(MedicationChart $medicationChart): Response
    {
        $medicationChart->load(['admission', 'patient.user']);
        $medicines = Medicine::where('is_active', true)->get();

        return Inertia::render('Admin/Ipd/MedicationCharts/Edit', [
            'medicationChart' => $medicationChart,
            'medicines' => $medicines,
        ]);
    }

    public function update(UpdateMedicationChartRequest $request, MedicationChart $medicationChart): RedirectResponse
    {
        $medicationChart->update($request->validated());

        return redirect()->route('admin.ipd.medication-charts.show', $medicationChart)
            ->with('success', 'Medication chart entry updated successfully.');
    }

    public function destroy(MedicationChart $medicationChart): RedirectResponse
    {
        $admissionId = $medicationChart->admission_id;
        $medicationChart->delete();

        return redirect()->route('admin.ipd.medication-charts.index', ['admission_id' => $admissionId])
            ->with('success', 'Medication chart entry deleted successfully.');
    }
}
