<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\BillItem;
use App\Models\Payment;
use App\Models\StockMovement;
use Illuminate\Support\Str;

class BillingService
{
    public function createBill(array $data, int $createdBy): Bill
    {
        $billNumber = 'BILL-'.strtoupper(Str::random(8));

        $subtotal = 0;
        $items = [];

        foreach ($data['items'] as $itemData) {
            $totalPrice = $itemData['quantity'] * $itemData['unit_price'];
            $subtotal += $totalPrice;

            $items[] = [
                'item_type' => $itemData['item_type'],
                'medicine_id' => $itemData['medicine_id'] ?? null,
                'lab_test_id' => $itemData['lab_test_id'] ?? null,
                'item_name' => $itemData['item_name'],
                'quantity' => $itemData['quantity'],
                'unit_price' => $itemData['unit_price'],
                'total_price' => $totalPrice,
                'description' => $itemData['description'] ?? null,
            ];
        }

        $tax = $data['tax'] ?? 0;
        $discount = $data['discount'] ?? 0;
        $total = $subtotal + $tax - $discount;

        $bill = Bill::create([
            'bill_number' => $billNumber,
            'patient_id' => $data['patient_id'] ?? null,
            'bill_type' => $data['bill_type'],
            'subtotal' => $subtotal,
            'tax' => $tax,
            'discount' => $discount,
            'total' => $total,
            'paid_amount' => 0,
            'balance' => $total,
            'status' => 'pending',
            'notes' => $data['notes'] ?? null,
            'created_by' => $createdBy,
        ]);

        foreach ($items as $item) {
            $item['bill_id'] = $bill->id;
            BillItem::create($item);

            // Update stock if it's a medicine
            if ($item['item_type'] === 'medicine' && $item['medicine_id']) {
                StockMovement::create([
                    'medicine_id' => $item['medicine_id'],
                    'type' => 'sale',
                    'quantity' => -$item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'bill_id' => $bill->id,
                    'created_by' => $createdBy,
                ]);
            }
        }

        return $bill->load('items');
    }

    public function processPayment(Bill $bill, array $data, int $receivedBy): Payment
    {
        $paymentNumber = 'PAY-'.strtoupper(Str::random(8));

        $payment = Payment::create([
            'payment_number' => $paymentNumber,
            'bill_id' => $bill->id,
            'amount' => $data['amount'],
            'payment_method' => $data['payment_method'],
            'transaction_id' => $data['transaction_id'] ?? null,
            'notes' => $data['notes'] ?? null,
            'payment_date' => $data['payment_date'],
            'received_by' => $receivedBy,
        ]);

        $newPaidAmount = $bill->paid_amount + $data['amount'];
        $balance = $bill->total - $newPaidAmount;

        $status = match (true) {
            $balance <= 0 => 'paid',
            $newPaidAmount > 0 => 'partial',
            default => 'pending',
        };

        $bill->update([
            'paid_amount' => $newPaidAmount,
            'balance' => max(0, $balance),
            'status' => $status,
        ]);

        return $payment;
    }

    public function getBillingReport(array $filters = []): array
    {
        $query = Bill::query();

        if (isset($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }

        if (isset($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $bills = $query->get();

        return [
            'total_bills' => $bills->count(),
            'total_revenue' => $bills->sum('total'),
            'total_paid' => $bills->sum('paid_amount'),
            'total_pending' => $bills->sum('balance'),
            'bills' => $bills,
        ];
    }
}
