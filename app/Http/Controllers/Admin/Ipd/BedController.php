<?php

namespace App\Http\Controllers\Admin\Ipd;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Ipd\StoreBedRequest;
use App\Http\Requests\Admin\Ipd\UpdateBedRequest;
use App\Models\Bed;
use App\Models\Ward;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BedController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Bed::with('ward');

        if ($request->has('ward_id')) {
            $query->where('ward_id', $request->ward_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $beds = $query->latest()->paginate(20);
        $wards = Ward::where('is_active', true)->get();

        return Inertia::render('Admin/Ipd/Beds/Index', [
            'beds' => $beds,
            'wards' => $wards,
            'filters' => $request->only(['ward_id', 'status']),
        ]);
    }

    public function create(): Response
    {
        $wards = Ward::where('is_active', true)->get();

        return Inertia::render('Admin/Ipd/Beds/Create', [
            'wards' => $wards,
        ]);
    }

    public function store(StoreBedRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['status'] = 'available';
        $validated['is_active'] = $validated['is_active'] ?? true;

        Bed::create($validated);

        // Update ward bed count
        $ward = Ward::findOrFail($validated['ward_id']);
        $ward->increment('total_beds');
        $ward->increment('available_beds');

        return redirect()->route('admin.ipd.beds.index')
            ->with('success', 'Bed created successfully.');
    }

    public function show(Bed $bed): Response
    {
        $bed->load(['ward', 'admissions.patient.user']);

        return Inertia::render('Admin/Ipd/Beds/Show', [
            'bed' => $bed,
        ]);
    }

    public function edit(Bed $bed): Response
    {
        $bed->load('ward');
        $wards = Ward::where('is_active', true)->get();

        return Inertia::render('Admin/Ipd/Beds/Edit', [
            'bed' => $bed,
            'wards' => $wards,
        ]);
    }

    public function update(UpdateBedRequest $request, Bed $bed): RedirectResponse
    {
        $bed->update($request->validated());

        return redirect()->route('admin.ipd.beds.show', $bed)
            ->with('success', 'Bed updated successfully.');
    }

    public function destroy(Bed $bed): RedirectResponse
    {
        if ($bed->status === 'occupied') {
            return redirect()->back()
                ->with('error', 'Cannot delete an occupied bed.');
        }

        $ward = $bed->ward;
        $bed->delete();

        // Update ward bed count
        $ward->decrement('total_beds');
        if ($bed->status === 'available') {
            $ward->decrement('available_beds');
        }

        return redirect()->route('admin.ipd.beds.index')
            ->with('success', 'Bed deleted successfully.');
    }
}
