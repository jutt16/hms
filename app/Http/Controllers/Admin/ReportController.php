<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __construct(
        private ReportService $reportService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Reports/Index');
    }

    public function appointments(Request $request): Response
    {
        $filters = [
            'start_date' => $request->get('start_date') ?? now()->startOfMonth(),
            'end_date' => $request->get('end_date') ?? now()->endOfMonth(),
            'doctor_id' => $request->get('doctor_id'),
            'status' => $request->get('status'),
        ];

        $report = $this->reportService->getAppointmentReport($filters);

        return Inertia::render('Admin/Reports/Appointments', [
            'report' => $report,
            'filters' => $filters,
        ]);
    }

    public function revenue(Request $request): Response
    {
        $filters = [
            'start_date' => $request->get('start_date') ?? now()->startOfMonth(),
            'end_date' => $request->get('end_date') ?? now()->endOfMonth(),
        ];

        $report = $this->reportService->getRevenueReport($filters);

        return Inertia::render('Admin/Reports/Revenue', [
            'report' => $report,
            'filters' => $filters,
        ]);
    }

    public function patients(): Response
    {
        $report = $this->reportService->getPatientStatistics();

        return Inertia::render('Admin/Reports/Patients', [
            'report' => $report,
        ]);
    }

    public function pharmacy(): Response
    {
        $report = $this->reportService->getPharmacyReport();

        return Inertia::render('Admin/Reports/Pharmacy', [
            'report' => $report,
        ]);
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $type = $request->get('type');
        $format = $request->get('format', 'pdf');

        // This will be implemented with PDF/Excel export service
        abort(501, 'Export functionality not yet implemented');
    }
}
