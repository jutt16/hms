<?php

namespace App\Http\Controllers\Admin\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Staff\StoreAttendanceRequest;
use App\Http\Requests\Admin\Staff\UpdateAttendanceRequest;
use App\Models\Attendance;
use App\Models\Shift;
use App\Models\Staff;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Attendance::with(['staff.user', 'shift']);

        if ($request->has('staff_id')) {
            $query->where('staff_id', $request->staff_id);
        }

        if ($request->has('attendance_date')) {
            $query->whereDate('attendance_date', $request->attendance_date);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $attendances = $query->latest('attendance_date')->paginate(20);
        $staff = Staff::where('is_active', true)->with('user')->get();

        return Inertia::render('Admin/Staff/Attendances/Index', [
            'attendances' => $attendances,
            'staff' => $staff,
            'filters' => $request->only(['staff_id', 'attendance_date', 'status']),
        ]);
    }

    public function create(Request $request): Response
    {
        $staff = Staff::where('is_active', true)->with('user')->get();
        $shifts = Shift::where('is_active', true)->get();

        $selectedStaff = null;
        if ($request->has('staff_id')) {
            $selectedStaff = Staff::with('user')->findOrFail($request->staff_id);
        }

        return Inertia::render('Admin/Staff/Attendances/Create', [
            'staff' => $staff,
            'shifts' => $shifts,
            'selectedStaff' => $selectedStaff,
        ]);
    }

    public function store(StoreAttendanceRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Calculate hours worked if both times are provided
        if ($validated['check_in_time'] && $validated['check_out_time']) {
            $checkIn = \Carbon\Carbon::parse($validated['attendance_date'].' '.$validated['check_in_time']);
            $checkOut = \Carbon\Carbon::parse($validated['attendance_date'].' '.$validated['check_out_time']);
            $validated['hours_worked'] = $checkOut->diffInMinutes($checkIn);
        }

        Attendance::create($validated);

        return redirect()->route('admin.staff.attendances.index')
            ->with('success', 'Attendance recorded successfully.');
    }

    public function show(Attendance $attendance): Response
    {
        $attendance->load(['staff.user', 'shift']);

        return Inertia::render('Admin/Staff/Attendances/Show', [
            'attendance' => $attendance,
        ]);
    }

    public function edit(Attendance $attendance): Response
    {
        $attendance->load(['staff.user']);
        $shifts = Shift::where('is_active', true)->get();

        return Inertia::render('Admin/Staff/Attendances/Edit', [
            'attendance' => $attendance,
            'shifts' => $shifts,
        ]);
    }

    public function update(UpdateAttendanceRequest $request, Attendance $attendance): RedirectResponse
    {
        $validated = $request->validated();

        // Recalculate hours worked if both times are provided
        if (isset($validated['check_in_time']) && isset($validated['check_out_time'])) {
            $checkIn = \Carbon\Carbon::parse($attendance->attendance_date.' '.$validated['check_in_time']);
            $checkOut = \Carbon\Carbon::parse($attendance->attendance_date.' '.$validated['check_out_time']);
            $validated['hours_worked'] = $checkOut->diffInMinutes($checkIn);
        } elseif (isset($validated['check_in_time']) || isset($validated['check_out_time'])) {
            // If only one time is updated, try to recalculate with existing time
            $checkInTime = $validated['check_in_time'] ?? $attendance->check_in_time;
            $checkOutTime = $validated['check_out_time'] ?? $attendance->check_out_time;
            if ($checkInTime && $checkOutTime) {
                $checkIn = \Carbon\Carbon::parse($attendance->attendance_date.' '.$checkInTime);
                $checkOut = \Carbon\Carbon::parse($attendance->attendance_date.' '.$checkOutTime);
                $validated['hours_worked'] = $checkOut->diffInMinutes($checkIn);
            }
        }

        $attendance->update($validated);

        return redirect()->route('admin.staff.attendances.show', $attendance)
            ->with('success', 'Attendance updated successfully.');
    }

    public function destroy(Attendance $attendance): RedirectResponse
    {
        $attendance->delete();

        return redirect()->route('admin.staff.attendances.index')
            ->with('success', 'Attendance deleted successfully.');
    }
}
