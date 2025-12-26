<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Bill;
use App\Models\Payment;
use App\Services\BillingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(
        private BillingService $billingService
    ) {}

    public function index(Request $request): Response
    {
        $query = Payment::with(['bill.patient.user', 'receiver']);

        if ($request->has('bill_id')) {
            $query->where('bill_id', $request->get('bill_id'));
        }

        $payments = $query->latest()->paginate(15);

        return Inertia::render('Billing/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['bill_id']),
        ]);
    }

    public function create(Request $request): Response
    {
        $billId = $request->get('bill_id');
        $bill = $billId ? Bill::with(['patient.user'])->findOrFail($billId) : null;

        return Inertia::render('Billing/Payments/Create', [
            'bill' => $bill,
        ]);
    }

    public function store(StorePaymentRequest $request): RedirectResponse
    {
        $bill = Bill::findOrFail($request->bill_id);

        $this->billingService->processPayment(
            $bill,
            $request->validated(),
            $request->user()->id
        );

        return redirect()->route('billing.bills.show', $bill)
            ->with('success', 'Payment processed successfully.');
    }

    public function show(Payment $payment): Response
    {
        $payment->load(['bill.patient.user', 'receiver']);

        return Inertia::render('Billing/Payments/Show', [
            'payment' => $payment,
        ]);
    }
}
