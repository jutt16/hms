<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\LabTest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LabTestController extends Controller
{
    public function index(): Response
    {
        $labTests = LabTest::where('is_active', true)
            ->latest()
            ->paginate(15);

        return Inertia::render('Lab/LabTests/Index', [
            'labTests' => $labTests,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Lab/LabTests/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'test_code' => ['required', 'string', 'max:50', 'unique:lab_tests,test_code'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'category' => ['nullable', 'string', 'max:100'],
            'normal_range' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        LabTest::create($validated);

        return redirect()->route('lab.lab-tests.index')
            ->with('success', 'Lab test created successfully.');
    }

    public function show(LabTest $labTest): Response
    {
        $labTest->load('labResults.patient.user');

        return Inertia::render('Lab/LabTests/Show', [
            'labTest' => $labTest,
        ]);
    }

    public function edit(LabTest $labTest): Response
    {
        return Inertia::render('Lab/LabTests/Edit', [
            'labTest' => $labTest,
        ]);
    }

    public function update(Request $request, LabTest $labTest): RedirectResponse
    {
        $validated = $request->validate([
            'test_code' => ['required', 'string', 'max:50', 'unique:lab_tests,test_code,'.$labTest->id],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'category' => ['nullable', 'string', 'max:100'],
            'normal_range' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $labTest->update($validated);

        return redirect()->route('lab.lab-tests.index')
            ->with('success', 'Lab test updated successfully.');
    }

    public function destroy(LabTest $labTest): RedirectResponse
    {
        $labTest->delete();

        return redirect()->route('lab.lab-tests.index')
            ->with('success', 'Lab test deleted successfully.');
    }
}
