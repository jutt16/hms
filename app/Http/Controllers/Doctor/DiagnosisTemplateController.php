<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Doctor\StoreDiagnosisTemplateRequest;
use App\Http\Requests\Doctor\UpdateDiagnosisTemplateRequest;
use App\Models\DiagnosisTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DiagnosisTemplateController extends Controller
{
    public function index(Request $request): Response
    {
        $query = DiagnosisTemplate::with('doctor.user')->where('is_active', true);

        // Show public templates and templates created by current doctor
        $query->where(function ($q) {
            $q->where('is_public', true)
                ->orWhere('doctor_id', auth()->user()->doctor->id ?? 0);
        });

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('diagnosis', 'like', '%'.$request->search.'%');
            });
        }

        $templates = $query->latest()->paginate(15);

        return Inertia::render('Doctor/DiagnosisTemplates/Index', [
            'templates' => $templates,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Doctor/DiagnosisTemplates/Create');
    }

    public function store(StoreDiagnosisTemplateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $doctor = auth()->user()->doctor;

        if (! $doctor) {
            return redirect()->back()
                ->with('error', 'Only doctors can create diagnosis templates.');
        }

        $validated['doctor_id'] = $doctor->id;
        $validated['is_active'] = true;
        $validated['is_public'] = $validated['is_public'] ?? false;

        DiagnosisTemplate::create($validated);

        return redirect()->route('doctor.diagnosis-templates.index')
            ->with('success', 'Diagnosis template created successfully.');
    }

    public function show(DiagnosisTemplate $template): Response
    {
        $template->load('doctor.user');

        return Inertia::render('Doctor/DiagnosisTemplates/Show', [
            'template' => $template,
        ]);
    }

    public function edit(DiagnosisTemplate $template): Response
    {
        // Only allow editing own templates unless admin
        if ($template->doctor_id !== auth()->user()->doctor->id && ! auth()->user()->hasRole('admin|super-admin')) {
            return redirect()->route('doctor.diagnosis-templates.index')
                ->with('error', 'You can only edit your own templates.');
        }

        return Inertia::render('Doctor/DiagnosisTemplates/Edit', [
            'template' => $template,
        ]);
    }

    public function update(UpdateDiagnosisTemplateRequest $request, DiagnosisTemplate $template): RedirectResponse
    {
        // Only allow editing own templates unless admin
        if ($template->doctor_id !== auth()->user()->doctor->id && ! auth()->user()->hasRole('admin|super-admin')) {
            return redirect()->back()
                ->with('error', 'You can only edit your own templates.');
        }

        $template->update($request->validated());

        return redirect()->route('doctor.diagnosis-templates.show', $template)
            ->with('success', 'Diagnosis template updated successfully.');
    }

    public function destroy(DiagnosisTemplate $template): RedirectResponse
    {
        // Only allow deleting own templates unless admin
        if ($template->doctor_id !== auth()->user()->doctor->id && ! auth()->user()->hasRole('admin|super-admin')) {
            return redirect()->back()
                ->with('error', 'You can only delete your own templates.');
        }

        $template->delete();

        return redirect()->route('doctor.diagnosis-templates.index')
            ->with('success', 'Diagnosis template deleted successfully.');
    }
}
