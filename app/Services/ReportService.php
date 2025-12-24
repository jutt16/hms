<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Bill;
use App\Models\Medicine;
use App\Models\Patient;
use App\Models\Payment;
use Carbon\Carbon;

class ReportService
{
    public function getAppointmentReport(array $filters = []): array
    {
        $query = Appointment::query();

        if (isset($filters['start_date'])) {
            $query->whereDate('appointment_date', '>=', $filters['start_date']);
        }

        if (isset($filters['end_date'])) {
            $query->whereDate('appointment_date', '<=', $filters['end_date']);
        }

        if (isset($filters['doctor_id'])) {
            $query->where('doctor_id', $filters['doctor_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $appointments = $query->get();

        return [
            'total' => $appointments->count(),
            'by_status' => $appointments->groupBy('status')->map->count(),
            'by_doctor' => $appointments->groupBy('doctor_id')->map->count(),
            'appointments' => $appointments,
        ];
    }

    public function getRevenueReport(array $filters = []): array
    {
        $query = Bill::where('status', 'paid');

        if (isset($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }

        if (isset($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        $bills = $query->get();

        return [
            'total_revenue' => $bills->sum('total'),
            'by_type' => $bills->groupBy('bill_type')->map(fn ($group) => $group->sum('total')),
            'by_payment_method' => Payment::whereIn('bill_id', $bills->pluck('id'))
                ->get()
                ->groupBy('payment_method')
                ->map(fn ($group) => $group->sum('amount')),
            'daily_revenue' => $bills->groupBy(fn ($bill) => $bill->created_at->format('Y-m-d'))
                ->map(fn ($group) => $group->sum('total')),
        ];
    }

    public function getPatientStatistics(): array
    {
        $totalPatients = Patient::count();
        $newPatientsThisMonth = Patient::whereMonth('created_at', Carbon::now()->month)->count();
        $activePatients = Patient::whereHas('appointments', function ($query) {
            $query->where('appointment_date', '>=', Carbon::now()->subMonths(6));
        })->count();

        return [
            'total_patients' => $totalPatients,
            'new_this_month' => $newPatientsThisMonth,
            'active_patients' => $activePatients,
        ];
    }

    public function getPharmacyReport(): array
    {
        $totalMedicines = Medicine::count();
        $lowStock = Medicine::whereColumn('stock_quantity', '<=', 'reorder_level')->count();
        $outOfStock = Medicine::where('stock_quantity', 0)->count();
        $expiringSoon = Medicine::whereBetween('expiry_date', [Carbon::now(), Carbon::now()->addMonths(3)])->count();

        return [
            'total_medicines' => $totalMedicines,
            'low_stock' => $lowStock,
            'out_of_stock' => $outOfStock,
            'expiring_soon' => $expiringSoon,
        ];
    }
}
