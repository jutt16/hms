<?php

namespace App\Http\Controllers\Admin\Insurance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Insurance\StoreInsuranceClaimRequest;
use App\Http\Requests\Admin\Insurance\UpdateInsuranceClaimRequest;
use App\Models\Bill;
use App\Models\InsuranceClaim;
use App\Models\InsuranceProvider;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InsuranceClaimController extends Controller
{
    public function index(Request $request): Response
    {
        $query = InsuranceClaim::with(['patient.user', 'bill', 'insuranceProvider', 'processedBy']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('insurance_provider_id')) {
            $query->where('insurance_provider_id', $request->insurance_provider_id);
        }

        $claims = $query->latest()->paginate(15);
        $providers = InsuranceProvider::where('is_active', true)->get();

        return Inertia::render('Admin/Insurance/Claims/Index', [
            'claims' => $claims,
            'providers' => $providers,
            'filters' => $request->only(['status', 'insurance_provider_id']),
        ]);
    }

    public function create(Request $request): Response
    {
        $patients = Patient::with('user')->get();
        $providers = InsuranceProvider::where('is_active', true)->get();
        $bills = Bill::where('status', 'pending')
            ->orWhere('status', 'partial')
            ->with('patient.user')
            ->get();

        $selectedBill = null;
        if ($request->has('bill_id')) {
            $selectedBill = Bill::with(['patient.user'])->findOrFail($request->bill_id);
        }

        return Inertia::render('Admin/Insurance/Claims/Create', [
            'patients' => $patients,
            'providers' => $providers,
            'bills' => $bills,
            'selectedBill' => $selectedBill,
        ]);
    }

    public function store(StoreInsuranceClaimRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $bill = Bill::findOrFail($validated['bill_id']);
        $provider = InsuranceProvider::findOrFail($validated['insurance_provider_id']);

        // Calculate claim amount based on coverage percentage
        $claimAmount = $bill->balance * ($provider->coverage_percentage / 100);
        if ($provider->max_coverage_amount && $claimAmount > $provider->max_coverage_amount) {
            $claimAmount = $provider->max_coverage_amount;
        }

        $claimNumber = 'CLM-'.strtoupper(Str::random(8));

        InsuranceClaim::create([
            'claim_number' => $claimNumber,
            'patient_id' => $validated['patient_id'],
            'bill_id' => $validated['bill_id'],
            'insurance_provider_id' => $validated['insurance_provider_id'],
            'policy_number' => $validated['policy_number'],
            'bill_amount' => $bill->balance,
            'claim_amount' => $claimAmount,
            'status' => 'pending',
        ]);

        return redirect()->route('admin.insurance.claims.index')
            ->with('success', 'Insurance claim created successfully.');
    }

    public function show(InsuranceClaim $claim): Response
    {
        $claim->load(['patient.user', 'bill.items', 'insuranceProvider', 'processedBy']);

        return Inertia::render('Admin/Insurance/Claims/Show', [
            'claim' => $claim,
        ]);
    }

    public function edit(InsuranceClaim $claim): Response
    {
        if ($claim->status !== 'pending') {
            return redirect()->route('admin.insurance.claims.show', $claim)
                ->with('error', 'Only pending claims can be edited.');
        }

        $claim->load(['patient.user', 'bill']);
        $providers = InsuranceProvider::where('is_active', true)->get();

        return Inertia::render('Admin/Insurance/Claims/Edit', [
            'claim' => $claim,
            'providers' => $providers,
        ]);
    }

    public function update(UpdateInsuranceClaimRequest $request, InsuranceClaim $claim): RedirectResponse
    {
        if ($claim->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Only pending claims can be edited.');
        }

        $claim->update($request->validated());

        return redirect()->route('admin.insurance.claims.show', $claim)
            ->with('success', 'Insurance claim updated successfully.');
    }

    public function destroy(InsuranceClaim $claim): RedirectResponse
    {
        if ($claim->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Only pending claims can be deleted.');
        }

        $claim->delete();

        return redirect()->route('admin.insurance.claims.index')
            ->with('success', 'Insurance claim deleted successfully.');
    }

    public function approve(Request $request, InsuranceClaim $claim): RedirectResponse
    {
        $validated = $request->validate([
            'approved_amount' => ['required', 'numeric', 'min:0', 'max:'.$claim->claim_amount],
        ]);

        if ($claim->status === 'paid') {
            return redirect()->back()
                ->with('error', 'Claim is already paid.');
        }

        $claim->update([
            'status' => 'approved',
            'approved_amount' => $validated['approved_amount'],
            'rejected_amount' => $claim->claim_amount - $validated['approved_amount'],
            'approved_date' => now(),
            'processed_by' => auth()->id(),
        ]);

        return redirect()->route('admin.insurance.claims.show', $claim)
            ->with('success', 'Insurance claim approved.');
    }

    public function reject(Request $request, InsuranceClaim $claim): RedirectResponse
    {
        $validated = $request->validate([
            'rejection_reason' => ['required', 'string'],
        ]);

        if ($claim->status === 'paid') {
            return redirect()->back()
                ->with('error', 'Claim is already paid.');
        }

        $claim->update([
            'status' => 'rejected',
            'rejected_amount' => $claim->claim_amount,
            'rejection_reason' => $validated['rejection_reason'],
            'rejected_date' => now(),
            'processed_by' => auth()->id(),
        ]);

        return redirect()->route('admin.insurance.claims.show', $claim)
            ->with('success', 'Insurance claim rejected.');
    }
}
