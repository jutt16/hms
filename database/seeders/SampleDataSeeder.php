<?php

namespace Database\Seeders;

use App\Models\LabTest;
use App\Models\Medicine;
use App\Models\Supplier;
use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lab Tests
        LabTest::create([
            'test_code' => 'CBC-001',
            'name' => 'Complete Blood Count',
            'description' => 'A complete blood count test',
            'price' => 500.00,
            'category' => 'Hematology',
            'normal_range' => 'Varies by component',
            'is_active' => true,
        ]);

        LabTest::create([
            'test_code' => 'UR-001',
            'name' => 'Urine Analysis',
            'description' => 'Urine analysis test',
            'price' => 300.00,
            'category' => 'Urine',
            'normal_range' => 'Normal',
            'is_active' => true,
        ]);

        // Medicines
        Medicine::create([
            'medicine_code' => 'MED-001',
            'name' => 'Paracetamol 500mg',
            'generic_name' => 'Acetaminophen',
            'description' => 'Pain reliever and fever reducer',
            'manufacturer' => 'Pharma Corp',
            'category' => 'Analgesic',
            'unit' => 'tablet',
            'purchase_price' => 5.00,
            'selling_price' => 10.00,
            'stock_quantity' => 1000,
            'reorder_level' => 100,
            'requires_prescription' => false,
            'is_active' => true,
        ]);

        Medicine::create([
            'medicine_code' => 'MED-002',
            'name' => 'Amoxicillin 500mg',
            'generic_name' => 'Amoxicillin',
            'description' => 'Antibiotic',
            'manufacturer' => 'Pharma Corp',
            'category' => 'Antibiotic',
            'unit' => 'capsule',
            'purchase_price' => 15.00,
            'selling_price' => 30.00,
            'stock_quantity' => 500,
            'reorder_level' => 50,
            'requires_prescription' => true,
            'is_active' => true,
        ]);

        // Suppliers
        Supplier::create([
            'supplier_code' => 'SUP-001',
            'name' => 'Medical Supplies Inc',
            'contact_person' => 'John Smith',
            'email' => 'contact@medsupplies.com',
            'phone' => '9876543210',
            'address' => '123 Medical Street',
            'city' => 'City',
            'state' => 'State',
            'country' => 'Country',
            'is_active' => true,
        ]);

        // System Settings
        SystemSetting::create([
            'key' => 'pharmacy_enabled',
            'value' => 'true',
            'type' => 'boolean',
            'description' => 'Enable/Disable Pharmacy Module',
            'group' => 'modules',
        ]);

        SystemSetting::create([
            'key' => 'lab_enabled',
            'value' => 'true',
            'type' => 'boolean',
            'description' => 'Enable/Disable Lab Module',
            'group' => 'modules',
        ]);

        SystemSetting::create([
            'key' => 'billing_enabled',
            'value' => 'true',
            'type' => 'boolean',
            'description' => 'Enable/Disable Billing Module',
            'group' => 'modules',
        ]);

        SystemSetting::create([
            'key' => 'appointments_enabled',
            'value' => 'true',
            'type' => 'boolean',
            'description' => 'Enable/Disable Appointments Module',
            'group' => 'modules',
        ]);
    }
}
