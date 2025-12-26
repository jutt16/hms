<?php

use App\Http\Controllers\Admin\ActivityLogController as AdminActivityLogController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DoctorController as AdminDoctorController;
use App\Http\Controllers\Admin\Insurance\InsuranceClaimController as AdminInsuranceClaimController;
use App\Http\Controllers\Admin\Insurance\InsuranceProviderController as AdminInsuranceProviderController;
use App\Http\Controllers\Admin\Ipd\AdmissionController as AdminIpdAdmissionController;
use App\Http\Controllers\Admin\Ipd\BedController as AdminIpdBedController;
use App\Http\Controllers\Admin\Ipd\MedicationChartController as AdminIpdMedicationChartController;
use App\Http\Controllers\Admin\Ipd\NursingNoteController as AdminIpdNursingNoteController;
use App\Http\Controllers\Admin\Ipd\VitalSignController as AdminIpdVitalSignController;
use App\Http\Controllers\Admin\Ipd\WardController as AdminIpdWardController;
use App\Http\Controllers\Admin\PatientController as AdminPatientController;
use App\Http\Controllers\Admin\PatientReportController as AdminPatientReportController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\Staff\AttendanceController as AdminStaffAttendanceController;
use App\Http\Controllers\Admin\Staff\LeaveController as AdminStaffLeaveController;
use App\Http\Controllers\Admin\Staff\PayrollController as AdminStaffPayrollController;
use App\Http\Controllers\Admin\Staff\ShiftController as AdminStaffShiftController;
use App\Http\Controllers\Admin\Staff\StaffController as AdminStaffStaffController;
use App\Http\Controllers\Admin\SystemSettingController as AdminSystemSettingController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Billing\BillController as BillingBillController;
use App\Http\Controllers\Billing\PaymentController as BillingPaymentController;
use App\Http\Controllers\Doctor\AppointmentController as DoctorAppointmentController;
use App\Http\Controllers\Doctor\DashboardController as DoctorDashboardController;
use App\Http\Controllers\Doctor\DiagnosisTemplateController as DoctorDiagnosisTemplateController;
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

    // IPD/Ward Management
    Route::prefix('ipd')->name('ipd.')->group(function () {
        Route::resource('admissions', AdminIpdAdmissionController::class);
        Route::post('/admissions/{admission}/discharge', [AdminIpdAdmissionController::class, 'discharge'])->name('admissions.discharge');
        Route::resource('wards', AdminIpdWardController::class);
        Route::resource('beds', AdminIpdBedController::class);
        Route::resource('vital-signs', AdminIpdVitalSignController::class);
        Route::resource('nursing-notes', AdminIpdNursingNoteController::class);
        Route::resource('medication-charts', AdminIpdMedicationChartController::class);
    });

    // Staff & HR Management
    Route::prefix('staff')->name('staff.')->group(function () {
        Route::resource('staff', AdminStaffStaffController::class);
        Route::resource('attendances', AdminStaffAttendanceController::class);
        Route::resource('payrolls', AdminStaffPayrollController::class);
        Route::post('/payrolls/{payroll}/process', [AdminStaffPayrollController::class, 'process'])->name('payrolls.process');
        Route::resource('leaves', AdminStaffLeaveController::class);
        Route::post('/leaves/{leave}/approve', [AdminStaffLeaveController::class, 'approve'])->name('leaves.approve');
        Route::post('/leaves/{leave}/reject', [AdminStaffLeaveController::class, 'reject'])->name('leaves.reject');
        Route::resource('shifts', AdminStaffShiftController::class);
    });

    // Insurance Management
    Route::prefix('insurance')->name('insurance.')->group(function () {
        Route::resource('providers', AdminInsuranceProviderController::class);
        Route::resource('claims', AdminInsuranceClaimController::class);
        Route::post('/claims/{claim}/approve', [AdminInsuranceClaimController::class, 'approve'])->name('claims.approve');
        Route::post('/claims/{claim}/reject', [AdminInsuranceClaimController::class, 'reject'])->name('claims.reject');
    });

    // Patient Reports
    Route::resource('patient-reports', AdminPatientReportController::class);
    Route::get('/patient-reports/{patientReport}/download', [AdminPatientReportController::class, 'download'])->name('patient-reports.download');
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

    // Diagnosis Templates
    Route::resource('diagnosis-templates', DoctorDiagnosisTemplateController::class);
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

// Patient QR Code Route
Route::get('/patient/{id}/qr', function (string $id) {
    $patient = \App\Models\Patient::where('patient_id', $id)->firstOrFail();

    return Inertia::render('Patient/QrCode', ['patient' => $patient]);
})->name('patient.qr');
