<?php

namespace App\Http\Controllers\Admin\Ipd;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Ipd\StoreNursingNoteRequest;
use App\Http\Requests\Admin\Ipd\UpdateNursingNoteRequest;
use App\Models\Admission;
use App\Models\NursingNote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NursingNoteController extends Controller
{
    public function index(Request $request): Response
    {
        $query = NursingNote::with(['patient.user', 'admission', 'createdBy']);

        if ($request->has('admission_id')) {
            $query->where('admission_id', $request->admission_id);
        }

        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->has('note_type')) {
            $query->where('note_type', $request->note_type);
        }

        $nursingNotes = $query->latest('note_date')->paginate(20);

        return Inertia::render('Admin/Ipd/NursingNotes/Index', [
            'nursingNotes' => $nursingNotes,
            'filters' => $request->only(['admission_id', 'patient_id', 'note_type']),
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

        return Inertia::render('Admin/Ipd/NursingNotes/Create', [
            'admissions' => $admissions,
            'admission' => $admission,
        ]);
    }

    public function store(StoreNursingNoteRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['created_by'] = auth()->id();

        NursingNote::create($validated);

        return redirect()->route('admin.ipd.nursing-notes.index', ['admission_id' => $validated['admission_id']])
            ->with('success', 'Nursing note created successfully.');
    }

    public function show(NursingNote $nursingNote): Response
    {
        $nursingNote->load(['patient.user', 'admission', 'createdBy']);

        return Inertia::render('Admin/Ipd/NursingNotes/Show', [
            'nursingNote' => $nursingNote,
        ]);
    }

    public function edit(NursingNote $nursingNote): Response
    {
        $nursingNote->load(['admission', 'patient.user']);

        return Inertia::render('Admin/Ipd/NursingNotes/Edit', [
            'nursingNote' => $nursingNote,
        ]);
    }

    public function update(UpdateNursingNoteRequest $request, NursingNote $nursingNote): RedirectResponse
    {
        $nursingNote->update($request->validated());

        return redirect()->route('admin.ipd.nursing-notes.show', $nursingNote)
            ->with('success', 'Nursing note updated successfully.');
    }

    public function destroy(NursingNote $nursingNote): RedirectResponse
    {
        $admissionId = $nursingNote->admission_id;
        $nursingNote->delete();

        return redirect()->route('admin.ipd.nursing-notes.index', ['admission_id' => $admissionId])
            ->with('success', 'Nursing note deleted successfully.');
    }
}
