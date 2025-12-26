<?php

namespace App\Http\Controllers\Admin\Ipd;

use App\Http\Controllers\Controller;
use App\Models\Admission;
use App\Models\Bed;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Ward;
use App\Services\IpdService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdmissionController extends Controller
{
    public function __construct(
        private IpdService $ipdService
    ) {}

    public function index(Request $request): Response
    {
        $query = Admission::with(['patient.user', 'doctor.user', 'bed', 'ward']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $admissions = $query->latest()->paginate(15);

        return Inertia::render('Admin/Ipd/Admissions/Index', [
            'admissions' => $admissions,
            'filters' => $request->only(['status']),
        ]);
    }

    public function create(): Response
    {
        $patients = Patient::with('user')->get();
        $doctors = Doctor::with('user')->get();
        $wards = Ward::where('is_active', true)->get();
        $availableBeds = Bed::where('status', 'available')
            ->where('is_active', true)
            ->with('ward')
            ->get();

        return Inertia::render('Admin/Ipd/Admissions/Create', [
            'patients' => $patients,
            'doctors' => $doctors,
            'wards' => $wards,
            'availableBeds' => $availableBeds,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'ward_id' => ['required', 'exists:wards,id'],
            'bed_id' => ['required', 'exists:beds,id'],
            'admission_date' => ['required', 'date'],
            'admission_reason' => ['required', 'string'],
            'diagnosis' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $this->ipdService->admitPatient($validated, auth()->id());

        return redirect()->route('admin.ipd.admissions.index')
            ->with('success', 'Patient admitted successfully.');
    }

    public function show(Admission $admission): Response
    {
        $admission->load([
            'patient.user',
            'doctor.user',
            'bed.ward',
            'ward',
            'vitalSigns.recordedBy',
            'nursingNotes.createdBy',
            'medicationCharts.medicine',
            'admittedBy',
            'dischargedBy',
        ]);

        return Inertia::render('Admin/Ipd/Admissions/Show', [
            'admission' => $admission,
        ]);
    }

    public function edit(Admission $admission): Response
    {
        $admission->load(['patient.user', 'doctor.user', 'bed', 'ward']);
        $wards = Ward::where('is_active', true)->get();
        $availableBeds = Bed::where('status', 'available')
            ->where('is_active', true)
            ->with('ward')
            ->get();

        return Inertia::render('Admin/Ipd/Admissions/Edit', [
            'admission' => $admission,
            'wards' => $wards,
            'availableBeds' => $availableBeds,
        ]);
    }

    public function update(Request $request, Admission $admission): RedirectResponse
    {
        $validated = $request->validate([
            'ward_id' => ['sometimes', 'required', 'exists:wards,id'],
            'bed_id' => ['sometimes', 'required', 'exists:beds,id'],
            'admission_reason' => ['sometimes', 'required', 'string'],
            'diagnosis' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $admission->update($validated);

        return redirect()->route('admin.ipd.admissions.show', $admission)
            ->with('success', 'Admission updated successfully.');
    }

    public function destroy(Admission $admission): RedirectResponse
    {
        if ($admission->status === 'admitted') {
            return redirect()->back()
                ->with('error', 'Cannot delete an active admission. Please discharge the patient first.');
        }

        $admission->delete();

        return redirect()->route('admin.ipd.admissions.index')
            ->with('success', 'Admission deleted successfully.');
    }

    public function discharge(Request $request, Admission $admission): RedirectResponse
    {
        $validated = $request->validate([
            'discharge_date' => ['required', 'date'],
            'discharge_summary' => ['nullable', 'string'],
        ]);

        $this->ipdService->dischargePatient($admission, $validated, auth()->id());

        return redirect()->route('admin.ipd.admissions.show', $admission)
            ->with('success', 'Patient discharged successfully.');
    }
}
