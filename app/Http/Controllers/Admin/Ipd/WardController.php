<?php

namespace App\Http\Controllers\Admin\Ipd;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Ipd\StoreWardRequest;
use App\Http\Requests\Admin\Ipd\UpdateWardRequest;
use App\Models\Ward;
use App\Services\IpdService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WardController extends Controller
{
    public function __construct(
        private IpdService $ipdService
    ) {}

    public function index(): Response
    {
        $wards = Ward::withCount('beds')->latest()->paginate(15);

        return Inertia::render('Admin/Ipd/Wards/Index', [
            'wards' => $wards,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Ipd/Wards/Create');
    }

    public function store(StoreWardRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['available_beds'] = $validated['total_beds'];
        $validated['is_active'] = $validated['is_active'] ?? true;

        Ward::create($validated);

        return redirect()->route('admin.ipd.wards.index')
            ->with('success', 'Ward created successfully.');
    }

    public function show(Ward $ward): Response
    {
        $ward->load(['beds', 'admissions.patient.user']);
        $occupancy = $this->ipdService->getWardOccupancy($ward->id);

        return Inertia::render('Admin/Ipd/Wards/Show', [
            'ward' => $ward,
            'occupancy' => $occupancy,
        ]);
    }

    public function edit(Ward $ward): Response
    {
        return Inertia::render('Admin/Ipd/Wards/Edit', [
            'ward' => $ward,
        ]);
    }

    public function update(UpdateWardRequest $request, Ward $ward): RedirectResponse
    {
        $validated = $request->validated();

        // Calculate available beds if total_beds changed
        if (isset($validated['total_beds']) && $validated['total_beds'] != $ward->total_beds) {
            $occupiedBeds = $ward->beds()->where('status', 'occupied')->count();
            $validated['available_beds'] = max(0, $validated['total_beds'] - $occupiedBeds);
        }

        $ward->update($validated);

        return redirect()->route('admin.ipd.wards.show', $ward)
            ->with('success', 'Ward updated successfully.');
    }

    public function destroy(Ward $ward): RedirectResponse
    {
        if ($ward->beds()->where('status', 'occupied')->exists()) {
            return redirect()->back()
                ->with('error', 'Cannot delete ward with occupied beds.');
        }

        $ward->beds()->delete();
        $ward->delete();

        return redirect()->route('admin.ipd.wards.index')
            ->with('success', 'Ward deleted successfully.');
    }
}
