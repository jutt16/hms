<?php

namespace App\Http\Controllers\Admin\Ipd;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Ipd\StoreVitalSignRequest;
use App\Http\Requests\Admin\Ipd\UpdateVitalSignRequest;
use App\Models\Admission;
use App\Models\VitalSign;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VitalSignController extends Controller
{
    public function index(Request $request): Response
    {
        $query = VitalSign::with(['patient.user', 'admission', 'recordedBy']);

        if ($request->has('admission_id')) {
            $query->where('admission_id', $request->admission_id);
        }

        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        $vitalSigns = $query->latest('recorded_at')->paginate(20);

        return Inertia::render('Admin/Ipd/VitalSigns/Index', [
            'vitalSigns' => $vitalSigns,
            'filters' => $request->only(['admission_id', 'patient_id']),
        ]);
    }

    public function create(Request $request): Response
    {
        $admissions = Admission::where('status', 'admitted')
            ->with(['patient.user'])
            ->get();

        $admission = null;
        if ($request->has('admission_id')) {
            $admission = Admission::with(['patient.user'])->findOrFail($request->admission_id);
        }

        return Inertia::render('Admin/Ipd/VitalSigns/Create', [
            'admissions' => $admissions,
            'admission' => $admission,
        ]);
    }

    public function store(StoreVitalSignRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Calculate BMI if weight and height are provided
        if (isset($validated['weight']) && isset($validated['height']) && $validated['height'] > 0) {
            $heightInMeters = $validated['height'] / 100;
            $validated['bmi'] = round($validated['weight'] / ($heightInMeters * $heightInMeters), 2);
        }

        $validated['recorded_by'] = auth()->id();

        VitalSign::create($validated);

        return redirect()->route('admin.ipd.vital-signs.index', ['admission_id' => $validated['admission_id']])
            ->with('success', 'Vital signs recorded successfully.');
    }

    public function show(VitalSign $vitalSign): Response
    {
        $vitalSign->load(['patient.user', 'admission', 'recordedBy']);

        return Inertia::render('Admin/Ipd/VitalSigns/Show', [
            'vitalSign' => $vitalSign,
        ]);
    }

    public function edit(VitalSign $vitalSign): Response
    {
        $vitalSign->load(['admission', 'patient.user']);

        return Inertia::render('Admin/Ipd/VitalSigns/Edit', [
            'vitalSign' => $vitalSign,
        ]);
    }

    public function update(UpdateVitalSignRequest $request, VitalSign $vitalSign): RedirectResponse
    {
        $validated = $request->validated();

        // Recalculate BMI if weight or height changed
        if ((isset($validated['weight']) || isset($validated['height'])) && ($validated['weight'] ?? $vitalSign->weight) > 0 && ($validated['height'] ?? $vitalSign->height) > 0) {
            $weight = $validated['weight'] ?? $vitalSign->weight;
            $height = ($validated['height'] ?? $vitalSign->height) / 100;
            $validated['bmi'] = round($weight / ($height * $height), 2);
        }

        $vitalSign->update($validated);

        return redirect()->route('admin.ipd.vital-signs.show', $vitalSign)
            ->with('success', 'Vital signs updated successfully.');
    }

    public function destroy(VitalSign $vitalSign): RedirectResponse
    {
        $admissionId = $vitalSign->admission_id;
        $vitalSign->delete();

        return redirect()->route('admin.ipd.vital-signs.index', ['admission_id' => $admissionId])
            ->with('success', 'Vital signs deleted successfully.');
    }
}
