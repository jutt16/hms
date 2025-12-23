<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Patients
            'view patients', 'create patients', 'edit patients', 'delete patients',
            // Doctors
            'view doctors', 'create doctors', 'edit doctors', 'delete doctors',
            // Appointments
            'view appointments', 'create appointments', 'edit appointments', 'delete appointments',
            // Prescriptions
            'view prescriptions', 'create prescriptions', 'edit prescriptions', 'delete prescriptions',
            // Lab Tests
            'view lab tests', 'create lab tests', 'edit lab tests', 'delete lab tests',
            'view lab results', 'create lab results', 'edit lab results',
            // Pharmacy
            'view medicines', 'create medicines', 'edit medicines', 'delete medicines',
            'view suppliers', 'create suppliers', 'edit suppliers', 'delete suppliers',
            // Billing
            'view bills', 'create bills', 'edit bills', 'delete bills',
            'view payments', 'create payments', 'edit payments',
            // Reports
            'view reports',
            // System
            'manage system settings', 'manage users', 'view activity logs',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles
        $superAdmin = Role::create(['name' => 'super-admin']);
        $admin = Role::create(['name' => 'admin']);
        $doctor = Role::create(['name' => 'doctor']);
        $patient = Role::create(['name' => 'patient']);
        $nurse = Role::create(['name' => 'nurse']);
        $pharmacist = Role::create(['name' => 'pharmacist']);

        // Assign permissions to roles
        $superAdmin->givePermissionTo(Permission::all());

        $admin->givePermissionTo([
            'view patients', 'create patients', 'edit patients', 'delete patients',
            'view doctors', 'create doctors', 'edit doctors', 'delete doctors',
            'view appointments', 'create appointments', 'edit appointments', 'delete appointments',
            'view prescriptions', 'view lab tests', 'view lab results',
            'view medicines', 'create medicines', 'edit medicines', 'delete medicines',
            'view suppliers', 'create suppliers', 'edit suppliers', 'delete suppliers',
            'view bills', 'create bills', 'edit bills', 'delete bills',
            'view payments', 'create payments', 'edit payments',
            'view reports', 'manage system settings', 'manage users', 'view activity logs',
        ]);

        $doctor->givePermissionTo([
            'view patients', 'view appointments', 'create appointments', 'edit appointments',
            'view prescriptions', 'create prescriptions', 'edit prescriptions',
            'view lab tests', 'view lab results', 'create lab results', 'edit lab results',
            'view bills',
        ]);

        $patient->givePermissionTo([
            'view appointments', 'create appointments',
            'view prescriptions',
            'view lab results',
            'view bills',
        ]);

        $nurse->givePermissionTo([
            'view patients', 'view appointments', 'create appointments', 'edit appointments',
            'view lab results', 'create lab results',
        ]);

        $pharmacist->givePermissionTo([
            'view medicines', 'create medicines', 'edit medicines',
            'view suppliers', 'create suppliers', 'edit suppliers',
            'view prescriptions',
            'view bills', 'create bills',
        ]);
    }
}
