<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\LabTest;
use App\Models\Medicine;
use App\Models\Supplier;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lab Tests
        $labTests = [
            [
                'test_code' => 'CBC-001',
                'name' => 'Complete Blood Count',
                'description' => 'A complete blood count test to measure various components of blood',
                'price' => 500.00,
                'category' => 'Hematology',
                'normal_range' => 'Varies by component',
                'is_active' => true,
            ],
            [
                'test_code' => 'UR-001',
                'name' => 'Urine Analysis',
                'description' => 'Urine analysis test for detecting various conditions',
                'price' => 300.00,
                'category' => 'Urine',
                'normal_range' => 'Normal',
                'is_active' => true,
            ],
            [
                'test_code' => 'LIP-001',
                'name' => 'Lipid Profile',
                'description' => 'Complete lipid profile test',
                'price' => 800.00,
                'category' => 'Biochemistry',
                'normal_range' => 'Cholesterol < 200 mg/dL',
                'is_active' => true,
            ],
            [
                'test_code' => 'GLU-001',
                'name' => 'Blood Glucose',
                'description' => 'Fasting blood glucose test',
                'price' => 200.00,
                'category' => 'Biochemistry',
                'normal_range' => '70-100 mg/dL',
                'is_active' => true,
            ],
        ];

        foreach ($labTests as $test) {
            LabTest::create($test);
        }

        // Medicines
        $medicines = [
            [
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
            ],
            [
                'medicine_code' => 'MED-002',
                'name' => 'Amoxicillin 500mg',
                'generic_name' => 'Amoxicillin',
                'description' => 'Antibiotic for bacterial infections',
                'manufacturer' => 'Pharma Corp',
                'category' => 'Antibiotic',
                'unit' => 'capsule',
                'purchase_price' => 15.00,
                'selling_price' => 30.00,
                'stock_quantity' => 500,
                'reorder_level' => 50,
                'requires_prescription' => true,
                'is_active' => true,
            ],
            [
                'medicine_code' => 'MED-003',
                'name' => 'Ibuprofen 400mg',
                'generic_name' => 'Ibuprofen',
                'description' => 'Anti-inflammatory and pain reliever',
                'manufacturer' => 'MediPharm',
                'category' => 'NSAID',
                'unit' => 'tablet',
                'purchase_price' => 8.00,
                'selling_price' => 15.00,
                'stock_quantity' => 750,
                'reorder_level' => 75,
                'requires_prescription' => false,
                'is_active' => true,
            ],
            [
                'medicine_code' => 'MED-004',
                'name' => 'Omeprazole 20mg',
                'generic_name' => 'Omeprazole',
                'description' => 'Proton pump inhibitor for acid reflux',
                'manufacturer' => 'MediPharm',
                'category' => 'Gastrointestinal',
                'unit' => 'capsule',
                'purchase_price' => 12.00,
                'selling_price' => 25.00,
                'stock_quantity' => 600,
                'reorder_level' => 60,
                'requires_prescription' => true,
                'is_active' => true,
            ],
        ];

        foreach ($medicines as $medicine) {
            Medicine::create($medicine);
        }

        // Suppliers
        $suppliers = [
            [
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
            ],
            [
                'supplier_code' => 'SUP-002',
                'name' => 'Pharma Distributors Ltd',
                'contact_person' => 'Jane Doe',
                'email' => 'info@pharmadist.com',
                'phone' => '9876543211',
                'address' => '456 Pharma Avenue',
                'city' => 'City',
                'state' => 'State',
                'country' => 'Country',
                'is_active' => true,
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }

        // Create additional sample doctors
        $doctorUsers = User::whereHas('roles', fn ($q) => $q->where('name', 'doctor'))->get();
        if ($doctorUsers->isEmpty()) {
            $doctorUser = User::where('email', 'doctor@hms.com')->first();
            if ($doctorUser) {
                $doctorUsers = collect([$doctorUser]);
            }
        }

        // Create additional sample patients
        $patientUsers = User::whereHas('roles', fn ($q) => $q->where('name', 'patient'))->get();
        if ($patientUsers->isEmpty()) {
            $patientUser = User::where('email', 'patient@hms.com')->first();
            if ($patientUser) {
                $patientUsers = collect([$patientUser]);
            }
        }

        // Create sample appointments if we have doctors and patients
        if ($doctorUsers->isNotEmpty() && $patientUsers->isNotEmpty()) {
            $doctor = $doctorUsers->first()->doctor;
            $patient = $patientUsers->first()->patient;

            if ($doctor && $patient) {
                // Create some past appointments
                for ($i = 1; $i <= 5; $i++) {
                    Appointment::create([
                        'appointment_number' => 'APT-'.strtoupper(Str::random(8)),
                        'patient_id' => $patient->id,
                        'doctor_id' => $doctor->id,
                        'appointment_date' => now()->subDays($i * 7),
                        'status' => 'completed',
                        'reason' => 'Regular checkup',
                        'created_by' => $doctor->user_id,
                    ]);
                }

                // Create some upcoming appointments
                for ($i = 1; $i <= 3; $i++) {
                    Appointment::create([
                        'appointment_number' => 'APT-'.strtoupper(Str::random(8)),
                        'patient_id' => $patient->id,
                        'doctor_id' => $doctor->id,
                        'appointment_date' => now()->addDays($i * 7),
                        'status' => 'scheduled',
                        'reason' => 'Follow-up appointment',
                        'created_by' => $patient->user_id,
                    ]);
                }
            }
        }

        // System Settings
        $settings = [
            [
                'key' => 'module_pharmacy_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'Enable/Disable Pharmacy Module',
                'group' => 'modules',
            ],
            [
                'key' => 'module_lab_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'Enable/Disable Lab Module',
                'group' => 'modules',
            ],
            [
                'key' => 'module_billing_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'Enable/Disable Billing Module',
                'group' => 'modules',
            ],
            [
                'key' => 'module_appointments_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'Enable/Disable Appointments Module',
                'group' => 'modules',
            ],
            [
                'key' => 'hospital_name',
                'value' => 'General Hospital',
                'type' => 'string',
                'description' => 'Hospital Name',
                'group' => 'general',
            ],
            [
                'key' => 'hospital_address',
                'value' => '123 Hospital Street, City, State',
                'type' => 'string',
                'description' => 'Hospital Address',
                'group' => 'general',
            ],
            [
                'key' => 'hospital_phone',
                'value' => '+1-234-567-8900',
                'type' => 'string',
                'description' => 'Hospital Phone',
                'group' => 'general',
            ],
            [
                'key' => 'hospital_email',
                'value' => 'info@hospital.com',
                'type' => 'string',
                'description' => 'Hospital Email',
                'group' => 'general',
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::firstOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
