<?php

use App\Http\Controllers\Admin\ActivityLogController as AdminActivityLogController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DoctorController as AdminDoctorController;
use App\Http\Controllers\Admin\PatientController as AdminPatientController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\SystemSettingController as AdminSystemSettingController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Billing\BillController as BillingBillController;
use App\Http\Controllers\Billing\PaymentController as BillingPaymentController;
use App\Http\Controllers\Doctor\AppointmentController as DoctorAppointmentController;
use App\Http\Controllers\Doctor\DashboardController as DoctorDashboardController;
use App\Http\Controllers\Doctor\MedicalRecordController as DoctorMedicalRecordController;
use App\Http\Controllers\Doctor\PrescriptionController as DoctorPrescriptionController;
use App\Http\Controllers\Lab\LabResultController as LabLabResultController;
use App\Http\Controllers\Lab\LabTestController as LabLabTestController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Patient\AppointmentController as PatientAppointmentController;
use App\Http\Controllers\Patient\DashboardController as PatientDashboardController;
use App\Http\Controllers\Patient\LabResultController as PatientLabResultController;
use App\Http\Controllers\Patient\PrescriptionController as PatientPrescriptionController;
use App\Http\Controllers\Pharmacy\MedicineController as PharmacyMedicineController;
use App\Http\Controllers\Pharmacy\StockMovementController as PharmacyStockMovementController;
use App\Http\Controllers\Pharmacy\SupplierController as PharmacySupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

Route::post('/logout', [LoginController::class, 'destroy'])->middleware('auth')->name('logout');

// Notifications (available to all authenticated users)
Route::middleware('auth')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});

// Admin Routes
Route::middleware(['auth', 'role:admin|super-admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Users Management
    Route::resource('users', AdminUserController::class);

    // Patients Management
    Route::resource('patients', AdminPatientController::class);

    // Doctors Management
    Route::resource('doctors', AdminDoctorController::class);

    // System Settings
    Route::get('/settings', [AdminSystemSettingController::class, 'index'])->name('settings.index');
    Route::put('/settings', [AdminSystemSettingController::class, 'update'])->name('settings.update');
    Route::post('/settings/toggle-module', [AdminSystemSettingController::class, 'toggleModule'])->name('settings.toggle-module');

    // Activity Logs
    Route::get('/activity-logs', [AdminActivityLogController::class, 'index'])->name('activity-logs.index');
    Route::get('/activity-logs/{activityLog}', [AdminActivityLogController::class, 'show'])->name('activity-logs.show');

    // Reports
    Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/appointments', [AdminReportController::class, 'appointments'])->name('reports.appointments');
    Route::get('/reports/revenue', [AdminReportController::class, 'revenue'])->name('reports.revenue');
    Route::get('/reports/patients', [AdminReportController::class, 'patients'])->name('reports.patients');
    Route::get('/reports/pharmacy', [AdminReportController::class, 'pharmacy'])->name('reports.pharmacy');
    Route::get('/reports/export', [AdminReportController::class, 'export'])->name('reports.export');
});

// Doctor Routes
Route::middleware(['auth', 'role:doctor'])->prefix('doctor')->name('doctor.')->group(function () {
    Route::get('/dashboard', [DoctorDashboardController::class, 'index'])->name('dashboard');

    // Appointments
    Route::get('/appointments', [DoctorAppointmentController::class, 'index'])->name('appointments.index');
    Route::get('/appointments/{appointment}', [DoctorAppointmentController::class, 'show'])->name('appointments.show');
    Route::put('/appointments/{appointment}/status', [DoctorAppointmentController::class, 'updateStatus'])->name('appointments.update-status');

    // Prescriptions
    Route::get('/prescriptions', [DoctorPrescriptionController::class, 'index'])->name('prescriptions.index');
    Route::get('/prescriptions/create', [DoctorPrescriptionController::class, 'create'])->name('prescriptions.create');
    Route::post('/prescriptions', [DoctorPrescriptionController::class, 'store'])->name('prescriptions.store');
    Route::get('/prescriptions/{prescription}', [DoctorPrescriptionController::class, 'show'])->name('prescriptions.show');

    // Medical Records
    Route::get('/medical-records', [DoctorMedicalRecordController::class, 'index'])->name('medical-records.index');
    Route::get('/medical-records/create', [DoctorMedicalRecordController::class, 'create'])->name('medical-records.create');
    Route::post('/medical-records', [DoctorMedicalRecordController::class, 'store'])->name('medical-records.store');
    Route::get('/medical-records/{medicalRecord}', [DoctorMedicalRecordController::class, 'show'])->name('medical-records.show');
    Route::get('/medical-records/{medicalRecord}/edit', [DoctorMedicalRecordController::class, 'edit'])->name('medical-records.edit');
    Route::put('/medical-records/{medicalRecord}', [DoctorMedicalRecordController::class, 'update'])->name('medical-records.update');
});

// Patient Routes
Route::middleware(['auth', 'role:patient'])->prefix('patient')->name('patient.')->group(function () {
    Route::get('/dashboard', [PatientDashboardController::class, 'index'])->name('dashboard');

    // Appointments
    Route::get('/appointments', [PatientAppointmentController::class, 'index'])->name('appointments.index');
    Route::get('/appointments/create', [PatientAppointmentController::class, 'create'])->name('appointments.create');
    Route::post('/appointments', [PatientAppointmentController::class, 'store'])->name('appointments.store');
    Route::get('/appointments/{appointment}', [PatientAppointmentController::class, 'show'])->name('appointments.show');
    Route::post('/appointments/{appointment}/cancel', [PatientAppointmentController::class, 'cancel'])->name('appointments.cancel');

    // Prescriptions
    Route::get('/prescriptions', [PatientPrescriptionController::class, 'index'])->name('prescriptions.index');
    Route::get('/prescriptions/{prescription}', [PatientPrescriptionController::class, 'show'])->name('prescriptions.show');

    // Lab Results
    Route::get('/lab-results', [PatientLabResultController::class, 'index'])->name('lab-results.index');
    Route::get('/lab-results/{labResult}', [PatientLabResultController::class, 'show'])->name('lab-results.show');
});

// Pharmacy Routes
Route::middleware(['auth', 'role:admin|super-admin|pharmacist'])->prefix('pharmacy')->name('pharmacy.')->group(function () {
    // Medicines
    Route::resource('medicines', PharmacyMedicineController::class);

    // Suppliers
    Route::resource('suppliers', PharmacySupplierController::class);

    // Stock Movements
    Route::get('/stock-movements', [PharmacyStockMovementController::class, 'index'])->name('stock-movements.index');
    Route::get('/stock-movements/create', [PharmacyStockMovementController::class, 'create'])->name('stock-movements.create');
    Route::post('/stock-movements', [PharmacyStockMovementController::class, 'store'])->name('stock-movements.store');
});

// Lab Routes
Route::middleware(['auth', 'role:admin|super-admin|doctor|nurse'])->prefix('lab')->name('lab.')->group(function () {
    // Lab Tests
    Route::resource('lab-tests', LabLabTestController::class);

    // Lab Results
    Route::get('/lab-results', [LabLabResultController::class, 'index'])->name('lab-results.index');
    Route::get('/lab-results/create', [LabLabResultController::class, 'create'])->name('lab-results.create');
    Route::post('/lab-results', [LabLabResultController::class, 'store'])->name('lab-results.store');
    Route::get('/lab-results/{labResult}', [LabLabResultController::class, 'show'])->name('lab-results.show');
    Route::get('/lab-results/{labResult}/edit', [LabLabResultController::class, 'edit'])->name('lab-results.edit');
    Route::put('/lab-results/{labResult}', [LabLabResultController::class, 'update'])->name('lab-results.update');
});

// Billing Routes
Route::middleware(['auth'])->prefix('billing')->name('billing.')->group(function () {
    // Bills
    Route::get('/bills', [BillingBillController::class, 'index'])->name('bills.index');
    Route::get('/bills/create', [BillingBillController::class, 'create'])->name('bills.create');
    Route::post('/bills', [BillingBillController::class, 'store'])->name('bills.store');
    Route::get('/bills/{bill}', [BillingBillController::class, 'show'])->name('bills.show');
    Route::delete('/bills/{bill}', [BillingBillController::class, 'destroy'])->name('bills.destroy');

    // Payments
    Route::get('/payments', [BillingPaymentController::class, 'index'])->name('payments.index');
    Route::get('/payments/create', [BillingPaymentController::class, 'create'])->name('payments.create');
    Route::post('/payments', [BillingPaymentController::class, 'store'])->name('payments.store');
    Route::get('/payments/{payment}', [BillingPaymentController::class, 'show'])->name('payments.show');
});
