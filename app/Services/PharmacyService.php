<?php

namespace App\Services;

use App\Models\Medicine;
use App\Models\StockMovement;
use App\Models\Supplier;
use Illuminate\Support\Str;

class PharmacyService
{
    public function addMedicine(array $data): Medicine
    {
        return Medicine::create([
            'medicine_code' => $data['medicine_code'] ?? 'MED-'.strtoupper(Str::random(8)),
            'name' => $data['name'],
            'generic_name' => $data['generic_name'] ?? null,
            'description' => $data['description'] ?? null,
            'manufacturer' => $data['manufacturer'] ?? null,
            'category' => $data['category'] ?? null,
            'unit' => $data['unit'] ?? 'piece',
            'purchase_price' => $data['purchase_price'],
            'selling_price' => $data['selling_price'],
            'stock_quantity' => $data['stock_quantity'] ?? 0,
            'reorder_level' => $data['reorder_level'] ?? 10,
            'expiry_date' => $data['expiry_date'] ?? null,
            'batch_number' => $data['batch_number'] ?? null,
            'requires_prescription' => $data['requires_prescription'] ?? false,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    public function updateStock(Medicine $medicine, int $quantity, string $type, ?int $supplierId = null, ?int $createdBy = null): StockMovement
    {
        $stockMovement = StockMovement::create([
            'medicine_id' => $medicine->id,
            'type' => $type,
            'quantity' => $quantity,
            'unit_price' => $medicine->purchase_price,
            'supplier_id' => $supplierId,
            'created_by' => $createdBy ?? auth()->id(),
        ]);

        $newQuantity = match ($type) {
            'purchase', 'return' => $medicine->stock_quantity + $quantity,
            'sale', 'adjustment', 'expired' => $medicine->stock_quantity - abs($quantity),
            default => $medicine->stock_quantity,
        };

        $medicine->update(['stock_quantity' => max(0, $newQuantity)]);

        return $stockMovement;
    }

    public function getLowStockMedicines(): \Illuminate\Database\Eloquent\Collection
    {
        return Medicine::whereColumn('stock_quantity', '<=', 'reorder_level')
            ->where('is_active', true)
            ->get();
    }

    public function addSupplier(array $data): Supplier
    {
        return Supplier::create([
            'supplier_code' => $data['supplier_code'] ?? 'SUP-'.strtoupper(Str::random(8)),
            'name' => $data['name'],
            'contact_person' => $data['contact_person'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'],
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'state' => $data['state'] ?? null,
            'country' => $data['country'] ?? null,
            'postal_code' => $data['postal_code'] ?? null,
            'notes' => $data['notes'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }
}
