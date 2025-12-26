<?php

namespace App\Http\Controllers\Admin\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Staff\StoreStaffRequest;
use App\Http\Requests\Admin\Staff\UpdateStaffRequest;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Staff::with('user');

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active === '1');
        }

        $staff = $query->latest()->paginate(15);

        return Inertia::render('Admin/Staff/Index', [
            'staff' => $staff,
            'filters' => $request->only(['department', 'is_active']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Staff/Create');
    }

    public function store(StoreStaffRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'gender' => $validated['gender'] ?? null,
        ]);

        // Assign appropriate role based on position
        $role = match (strtolower($validated['position'])) {
            'doctor' => 'doctor',
            'nurse' => 'nurse',
            'pharmacist' => 'pharmacist',
            default => 'staff',
        };
        $user->assignRole($role);

        $staffId = 'STAFF-'.str_pad(Staff::count() + 1, 6, '0', STR_PAD_LEFT);

        Staff::create([
            'user_id' => $user->id,
            'staff_id' => $staffId,
            'department' => $validated['department'],
            'position' => $validated['position'],
            'employee_type' => $validated['employee_type'],
            'joining_date' => $validated['joining_date'],
            'salary' => $validated['salary'] ?? null,
            'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
            'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
            'qualifications' => $validated['qualifications'] ?? null,
            'experience' => $validated['experience'] ?? null,
            'is_active' => true,
        ]);

        return redirect()->route('admin.staff.staff.index')
            ->with('success', 'Staff member created successfully.');
    }

    public function show(Staff $staff): Response
    {
        $staff->load(['user', 'attendances.shift', 'payrolls', 'leaves']);

        return Inertia::render('Admin/Staff/Show', [
            'staff' => $staff,
        ]);
    }

    public function edit(Staff $staff): Response
    {
        $staff->load('user');

        return Inertia::render('Admin/Staff/Edit', [
            'staff' => $staff,
        ]);
    }

    public function update(UpdateStaffRequest $request, Staff $staff): RedirectResponse
    {
        $validated = $request->validated();

        $staff->user->update($request->only(['name', 'email', 'phone', 'address', 'date_of_birth', 'gender']));

        if ($request->filled('password')) {
            $staff->user->update(['password' => $request->password]);
        }

        $staff->update($request->only([
            'department',
            'position',
            'employee_type',
            'joining_date',
            'termination_date',
            'salary',
            'emergency_contact_name',
            'emergency_contact_phone',
            'qualifications',
            'experience',
            'is_active',
        ]));

        return redirect()->route('admin.staff.staff.show', $staff)
            ->with('success', 'Staff member updated successfully.');
    }

    public function destroy(Staff $staff): RedirectResponse
    {
        $staff->user->delete();
        $staff->delete();

        return redirect()->route('admin.staff.staff.index')
            ->with('success', 'Staff member deleted successfully.');
    }
}
