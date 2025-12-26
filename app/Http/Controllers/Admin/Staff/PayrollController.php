<?php

namespace App\Http\Controllers\Admin\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Staff\StorePayrollRequest;
use App\Http\Requests\Admin\Staff\UpdatePayrollRequest;
use App\Models\Payroll;
use App\Models\Staff;
use App\Services\PayrollService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayrollController extends Controller
{
    public function __construct(
        private PayrollService $payrollService
    ) {}

    public function index(Request $request): Response
    {
        $query = Payroll::with(['staff.user', 'processedBy']);

        if ($request->has('staff_id')) {
            $query->where('staff_id', $request->staff_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('pay_period_start')) {
            $query->where('pay_period_start', '>=', $request->pay_period_start);
        }

        if ($request->has('pay_period_end')) {
            $query->where('pay_period_end', '<=', $request->pay_period_end);
        }

        $payrolls = $query->latest()->paginate(15);
        $staff = Staff::where('is_active', true)->with('user')->get();

        return Inertia::render('Admin/Staff/Payrolls/Index', [
            'payrolls' => $payrolls,
            'staff' => $staff,
            'filters' => $request->only(['staff_id', 'status', 'pay_period_start', 'pay_period_end']),
        ]);
    }

    public function create(Request $request): Response
    {
        $staff = Staff::where('is_active', true)->with('user')->get();

        $selectedStaff = null;
        if ($request->has('staff_id')) {
            $selectedStaff = Staff::with('user')->findOrFail($request->staff_id);
        }

        return Inertia::render('Admin/Staff/Payrolls/Create', [
            'staff' => $staff,
            'selectedStaff' => $selectedStaff,
        ]);
    }

    public function store(StorePayrollRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $staff = Staff::findOrFail($validated['staff_id']);

        $this->payrollService->createPayroll($staff, $validated, auth()->id());

        return redirect()->route('admin.staff.payrolls.index')
            ->with('success', 'Payroll created successfully.');
    }

    public function show(Payroll $payroll): Response
    {
        $payroll->load(['staff.user', 'processedBy']);

        return Inertia::render('Admin/Staff/Payrolls/Show', [
            'payroll' => $payroll,
        ]);
    }

    public function edit(Payroll $payroll): Response
    {
        $payroll->load(['staff.user']);

        return Inertia::render('Admin/Staff/Payrolls/Edit', [
            'payroll' => $payroll,
        ]);
    }

    public function update(UpdatePayrollRequest $request, Payroll $payroll): RedirectResponse
    {
        $validated = $request->validated();

        // Recalculate net salary
        $netSalary = $payroll->basic_salary + ($validated['allowances'] ?? $payroll->allowances)
            + ($validated['overtime'] ?? $payroll->overtime) + ($validated['bonus'] ?? $payroll->bonus)
            - ($validated['deductions'] ?? $payroll->deductions) - ($validated['tax'] ?? $payroll->tax);

        $validated['net_salary'] = $netSalary;

        $payroll->update($validated);

        return redirect()->route('admin.staff.payrolls.show', $payroll)
            ->with('success', 'Payroll updated successfully.');
    }

    public function destroy(Payroll $payroll): RedirectResponse
    {
        if ($payroll->status === 'paid') {
            return redirect()->back()
                ->with('error', 'Cannot delete a paid payroll.');
        }

        $payroll->delete();

        return redirect()->route('admin.staff.payrolls.index')
            ->with('success', 'Payroll deleted successfully.');
    }

    public function process(Request $request, Payroll $payroll): RedirectResponse
    {
        $validated = $request->validate([
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'in:cash,bank_transfer,cheque'],
            'payment_reference' => ['nullable', 'string', 'max:255'],
        ]);

        $this->payrollService->processPayroll($payroll, $validated);

        $payroll->update(['status' => 'paid']);

        return redirect()->route('admin.staff.payrolls.show', $payroll)
            ->with('success', 'Payroll processed and marked as paid.');
    }
}
