<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private ReportService $reportService
    ) {}

    public function index(): Response
    {
        $stats = [
            'patients' => $this->reportService->getPatientStatistics(),
            'pharmacy' => $this->reportService->getPharmacyReport(),
            'revenue' => $this->reportService->getRevenueReport([
                'start_date' => now()->startOfMonth(),
                'end_date' => now()->endOfMonth(),
            ]),
            'appointments' => $this->reportService->getAppointmentReport([
                'start_date' => now()->startOfMonth(),
                'end_date' => now()->endOfMonth(),
            ]),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
