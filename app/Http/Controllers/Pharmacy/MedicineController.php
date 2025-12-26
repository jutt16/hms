<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMedicineRequest;
use App\Models\Medicine;
use App\Services\PharmacyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicineController extends Controller
{
    public function __construct(
        private PharmacyService $pharmacyService
    ) {}

    public function index(Request $request): Response
    {
        $query = Medicine::query();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('medicine_code', 'like', "%{$search}%")
                    ->orWhere('generic_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('low_stock')) {
            $query->whereColumn('stock_quantity', '<=', 'reorder_level');
        }

        $medicines = $query->latest()->paginate(15);

        return Inertia::render('Pharmacy/Medicines/Index', [
            'medicines' => $medicines,
            'filters' => $request->only(['search', 'low_stock']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Pharmacy/Medicines/Create');
    }

    public function store(StoreMedicineRequest $request): RedirectResponse
    {
        $this->pharmacyService->addMedicine($request->validated());

        return redirect()->route('pharmacy.medicines.index')
            ->with('success', 'Medicine added successfully.');
    }

    public function show(Medicine $medicine): Response
    {
        $medicine->load(['stockMovements.supplier', 'prescriptionItems', 'billItems']);

        return Inertia::render('Pharmacy/Medicines/Show', [
            'medicine' => $medicine,
        ]);
    }

    public function edit(Medicine $medicine): Response
    {
        return Inertia::render('Pharmacy/Medicines/Edit', [
            'medicine' => $medicine,
        ]);
    }

    public function update(Request $request, Medicine $medicine): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'generic_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'unit' => ['required', 'string', 'max:50'],
            'purchase_price' => ['required', 'numeric', 'min:0'],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'reorder_level' => ['required', 'integer', 'min:0'],
            'expiry_date' => ['nullable', 'date', 'after:today'],
            'requires_prescription' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        $medicine->update($validated);

        return redirect()->route('pharmacy.medicines.index')
            ->with('success', 'Medicine updated successfully.');
    }

    public function destroy(Medicine $medicine): RedirectResponse
    {
        $medicine->delete();

        return redirect()->route('pharmacy.medicines.index')
            ->with('success', 'Medicine deleted successfully.');
    }
}
