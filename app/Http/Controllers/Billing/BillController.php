<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBillRequest;
use App\Models\Bill;
use App\Models\LabTest;
use App\Models\Medicine;
use App\Models\Patient;
use App\Services\BillingService;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillController extends Controller
{
    public function __construct(
        private BillingService $billingService,
        private NotificationService $notificationService
    ) {}

    public function index(Request $request): Response
    {
        $query = Bill::with(['patient.user', 'creator']);

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->get('patient_id'));
        }

        $bills = $query->latest()->paginate(15);

        return Inertia::render('Billing/Bills/Index', [
            'bills' => $bills,
            'filters' => $request->only(['status', 'patient_id']),
        ]);
    }

    public function create(Request $request): Response
    {
        $patientId = $request->get('patient_id');
        $patient = $patientId ? Patient::with('user')->findOrFail($patientId) : null;

        $patients = Patient::with('user')->get();
        $medicines = Medicine::where('is_active', true)->get();
        $labTests = LabTest::where('is_active', true)->get();

        return Inertia::render('Billing/Bills/Create', [
            'patient' => $patient,
            'patients' => $patients,
            'medicines' => $medicines,
            'labTests' => $labTests,
        ]);
    }

    public function store(StoreBillRequest $request): RedirectResponse
    {
        $bill = $this->billingService->createBill($request->validated(), $request->user()->id);

        if ($bill->patient) {
            $this->notificationService->sendBillGenerated($bill);
        }

        return redirect()->route('billing.bills.show', $bill)
            ->with('success', 'Bill created successfully.');
    }

    public function show(Bill $bill): Response
    {
        $bill->load([
            'patient.user',
            'items',
            'payments',
            'creator',
        ]);

        return Inertia::render('Billing/Bills/Show', [
            'bill' => $bill,
        ]);
    }

    public function destroy(Bill $bill): RedirectResponse
    {
        $bill->delete();

        return redirect()->route('billing.bills.index')
            ->with('success', 'Bill deleted successfully.');
    }
}
