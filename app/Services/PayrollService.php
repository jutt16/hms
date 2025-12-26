<?php

namespace App\Services;

use App\Models\Payroll;
use App\Models\Staff;
use Illuminate\Support\Str;

class PayrollService
{
    public function calculatePayroll(Staff $staff, string $startDate, string $endDate): array
    {
        $basicSalary = $staff->salary ?? 0;

        // Calculate allowances (example: 10% of basic)
        $allowances = $basicSalary * 0.10;

        // Calculate overtime (example calculation - should be based on actual overtime hours)
        $overtime = 0;

        // Calculate deductions (example: 5% of basic)
        $deductions = $basicSalary * 0.05;

        // Calculate tax (example: 10% of gross)
        $gross = $basicSalary + $allowances + $overtime;
        $tax = $gross * 0.10;

        $netSalary = $gross - $deductions - $tax;

        return [
            'basic_salary' => $basicSalary,
            'allowances' => $allowances,
            'deductions' => $deductions,
            'overtime' => $overtime,
            'tax' => $tax,
            'net_salary' => $netSalary,
        ];
    }

    public function createPayroll(Staff $staff, array $data, int $processedBy): Payroll
    {
        $payrollNumber = 'PAY-'.strtoupper(Str::random(8));

        $calculated = $this->calculatePayroll($staff, $data['pay_period_start'], $data['pay_period_end']);

        $payroll = Payroll::create([
            'staff_id' => $staff->id,
            'payroll_number' => $payrollNumber,
            'pay_period_start' => $data['pay_period_start'],
            'pay_period_end' => $data['pay_period_end'],
            'basic_salary' => $calculated['basic_salary'],
            'allowances' => $calculated['allowances'],
            'deductions' => $calculated['deductions'],
            'overtime' => $calculated['overtime'],
            'tax' => $calculated['tax'],
            'net_salary' => $calculated['net_salary'],
            'status' => 'pending',
            'processed_by' => $processedBy,
        ]);

        return $payroll;
    }

    public function processPayroll(Payroll $payroll, array $paymentData): Payroll
    {
        $payroll->update([
            'status' => 'processed',
            'payment_date' => $paymentData['payment_date'] ?? now(),
            'payment_method' => $paymentData['payment_method'] ?? 'bank_transfer',
            'payment_reference' => $paymentData['payment_reference'] ?? null,
        ]);

        return $payroll;
    }
}
