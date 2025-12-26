<?php

namespace App\Http\Controllers\Admin\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Staff\StoreShiftRequest;
use App\Http\Requests\Admin\Staff\UpdateShiftRequest;
use App\Models\Shift;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ShiftController extends Controller
{
    public function index(): Response
    {
        $shifts = Shift::latest()->paginate(15);

        return Inertia::render('Admin/Staff/Shifts/Index', [
            'shifts' => $shifts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Staff/Shifts/Create');
    }

    public function store(StoreShiftRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $validated['is_active'] ?? true;

        Shift::create($validated);

        return redirect()->route('admin.staff.shifts.index')
            ->with('success', 'Shift created successfully.');
    }

    public function show(Shift $shift): Response
    {
        $shift->loadCount('attendances');

        return Inertia::render('Admin/Staff/Shifts/Show', [
            'shift' => $shift,
        ]);
    }

    public function edit(Shift $shift): Response
    {
        return Inertia::render('Admin/Staff/Shifts/Edit', [
            'shift' => $shift,
        ]);
    }

    public function update(UpdateShiftRequest $request, Shift $shift): RedirectResponse
    {
        $shift->update($request->validated());

        return redirect()->route('admin.staff.shifts.show', $shift)
            ->with('success', 'Shift updated successfully.');
    }

    public function destroy(Shift $shift): RedirectResponse
    {
        if ($shift->attendances()->exists()) {
            return redirect()->back()
                ->with('error', 'Cannot delete shift with attendance records.');
        }

        $shift->delete();

        return redirect()->route('admin.staff.shifts.index')
            ->with('success', 'Shift deleted successfully.');
    }
}
