<?php

namespace App\Http\Controllers\Admin\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Staff\StoreLeaveRequest;
use App\Http\Requests\Admin\Staff\UpdateLeaveRequest;
use App\Models\Leave;
use App\Models\Staff;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Leave::with(['staff.user', 'approvedBy']);

        if ($request->has('staff_id')) {
            $query->where('staff_id', $request->staff_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('leave_type')) {
            $query->where('leave_type', $request->leave_type);
        }

        $leaves = $query->latest()->paginate(15);
        $staff = Staff::where('is_active', true)->with('user')->get();

        return Inertia::render('Admin/Staff/Leaves/Index', [
            'leaves' => $leaves,
            'staff' => $staff,
            'filters' => $request->only(['staff_id', 'status', 'leave_type']),
        ]);
    }

    public function create(Request $request): Response
    {
        $staff = Staff::where('is_active', true)->with('user')->get();

        $selectedStaff = null;
        if ($request->has('staff_id')) {
            $selectedStaff = Staff::with('user')->findOrFail($request->staff_id);
        }

        return Inertia::render('Admin/Staff/Leaves/Create', [
            'staff' => $staff,
            'selectedStaff' => $selectedStaff,
        ]);
    }

    public function store(StoreLeaveRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Calculate days
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $validated['days'] = $startDate->diffInDays($endDate) + 1;

        $validated['status'] = 'pending';

        Leave::create($validated);

        return redirect()->route('admin.staff.leaves.index')
            ->with('success', 'Leave request created successfully.');
    }

    public function show(Leave $leave): Response
    {
        $leave->load(['staff.user', 'approvedBy']);

        return Inertia::render('Admin/Staff/Leaves/Show', [
            'leave' => $leave,
        ]);
    }

    public function edit(Leave $leave): Response
    {
        $leave->load(['staff.user']);

        if ($leave->status !== 'pending') {
            return redirect()->route('admin.staff.leaves.show', $leave)
                ->with('error', 'Only pending leave requests can be edited.');
        }

        return Inertia::render('Admin/Staff/Leaves/Edit', [
            'leave' => $leave,
        ]);
    }

    public function update(UpdateLeaveRequest $request, Leave $leave): RedirectResponse
    {
        if ($leave->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Only pending leave requests can be edited.');
        }

        $validated = $request->validated();

        // Recalculate days if dates changed
        if (isset($validated['start_date']) || isset($validated['end_date'])) {
            $startDate = \Carbon\Carbon::parse($validated['start_date'] ?? $leave->start_date);
            $endDate = \Carbon\Carbon::parse($validated['end_date'] ?? $leave->end_date);
            $validated['days'] = $startDate->diffInDays($endDate) + 1;
        }

        $leave->update($validated);

        return redirect()->route('admin.staff.leaves.show', $leave)
            ->with('success', 'Leave request updated successfully.');
    }

    public function destroy(Leave $leave): RedirectResponse
    {
        if ($leave->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Only pending leave requests can be deleted.');
        }

        $leave->delete();

        return redirect()->route('admin.staff.leaves.index')
            ->with('success', 'Leave request deleted successfully.');
    }

    public function approve(Request $request, Leave $leave): RedirectResponse
    {
        if ($leave->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Only pending leave requests can be approved.');
        }

        $leave->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return redirect()->route('admin.staff.leaves.show', $leave)
            ->with('success', 'Leave request approved successfully.');
    }

    public function reject(Request $request, Leave $leave): RedirectResponse
    {
        $validated = $request->validate([
            'rejection_reason' => ['required', 'string'],
        ]);

        if ($leave->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Only pending leave requests can be rejected.');
        }

        $leave->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return redirect()->route('admin.staff.leaves.show', $leave)
            ->with('success', 'Leave request rejected.');
    }
}
