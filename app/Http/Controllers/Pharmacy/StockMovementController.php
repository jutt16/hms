<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use App\Models\StockMovement;
use App\Services\PharmacyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    public function __construct(
        private PharmacyService $pharmacyService
    ) {}

    public function index(Request $request): Response
    {
        $query = StockMovement::with(['medicine', 'supplier', 'creator']);

        if ($request->has('medicine_id')) {
            $query->where('medicine_id', $request->get('medicine_id'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->get('type'));
        }

        $stockMovements = $query->latest()->paginate(15);

        return Inertia::render('Pharmacy/StockMovements/Index', [
            'stockMovements' => $stockMovements,
            'filters' => $request->only(['medicine_id', 'type']),
        ]);
    }

    public function create(Request $request): Response
    {
        $medicineId = $request->get('medicine_id');
        $medicine = $medicineId ? Medicine::findOrFail($medicineId) : null;

        $medicines = Medicine::where('is_active', true)->get();
        $suppliers = \App\Models\Supplier::where('is_active', true)->get();

        return Inertia::render('Pharmacy/StockMovements/Create', [
            'medicine' => $medicine,
            'medicines' => $medicines,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'medicine_id' => ['required', 'exists:medicines,id'],
            'type' => ['required', 'in:purchase,sale,return,adjustment,expired'],
            'quantity' => ['required', 'integer', 'min:1'],
            'supplier_id' => ['nullable', 'required_if:type,purchase', 'exists:suppliers,id'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $medicine = Medicine::findOrFail($validated['medicine_id']);

        $this->pharmacyService->updateStock(
            $medicine,
            $validated['quantity'],
            $validated['type'],
            $validated['supplier_id'] ?? null,
            $request->user()->id
        );

        return redirect()->route('pharmacy.stock-movements.index')
            ->with('success', 'Stock movement recorded successfully.');
    }
}
