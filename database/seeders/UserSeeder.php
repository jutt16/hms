<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Super Admin
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@hms.com',
            'password' => bcrypt('password'),
            'phone' => '1234567890',
            'is_active' => true,
        ]);
        $superAdmin->assignRole('super-admin');

        // Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@hms.com',
            'password' => bcrypt('password'),
            'phone' => '1234567891',
            'is_active' => true,
        ]);
        $admin->assignRole('admin');

        // Doctor
        $doctorUser = User::create([
            'name' => 'Dr. John Doe',
            'email' => 'doctor@hms.com',
            'password' => bcrypt('password'),
            'phone' => '1234567892',
            'gender' => 'male',
            'is_active' => true,
        ]);
        $doctorUser->assignRole('doctor');

        Doctor::create([
            'user_id' => $doctorUser->id,
            'doctor_id' => 'DOC-000001',
            'specialization' => 'Cardiology',
            'license_number' => 'LIC-001',
            'qualifications' => 'MBBS, MD',
            'experience_years' => 10,
            'consultation_fee' => '500',
            'available_days' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            'start_time' => '09:00',
            'end_time' => '17:00',
            'is_available' => true,
        ]);

        // Patient
        $patientUser = User::create([
            'name' => 'Patient User',
            'email' => 'patient@hms.com',
            'password' => bcrypt('password'),
            'phone' => '1234567893',
            'gender' => 'male',
            'date_of_birth' => '1990-01-01',
            'is_active' => true,
        ]);
        $patientUser->assignRole('patient');

        Patient::create([
            'user_id' => $patientUser->id,
            'patient_id' => 'PAT-000001',
            'blood_group' => 'O+',
            'allergies' => 'None',
        ]);
    }
}
