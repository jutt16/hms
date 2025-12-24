<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DoctorController as AdminDoctorController;
use App\Http\Controllers\Admin\PatientController as AdminPatientController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Billing\BillController as BillingBillController;
use App\Http\Controllers\Billing\PaymentController as BillingPaymentController;
use App\Http\Controllers\Doctor\AppointmentController as DoctorAppointmentController;
use App\Http\Controllers\Patient\AppointmentController as PatientAppointmentController;
use App\Http\Controllers\Pharmacy\MedicineController as PharmacyMedicineController;
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

// Admin Routes
Route::middleware(['auth', 'role:admin|super-admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('patients', AdminPatientController::class);
    Route::resource('doctors', AdminDoctorController::class);
});

// Doctor Routes
Route::middleware(['auth', 'role:doctor'])->prefix('doctor')->name('doctor.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Doctor/Dashboard');
    })->name('dashboard');
    Route::resource('appointments', DoctorAppointmentController::class);
});

// Patient Routes
Route::middleware(['auth', 'role:patient'])->prefix('patient')->name('patient.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Patient/Dashboard');
    })->name('dashboard');
    Route::resource('appointments', PatientAppointmentController::class);
});

// Pharmacy Routes
Route::middleware(['auth', 'role:admin|super-admin|pharmacist'])->prefix('pharmacy')->name('pharmacy.')->group(function () {
    Route::resource('medicines', PharmacyMedicineController::class);
});

// Billing Routes
Route::middleware(['auth'])->prefix('billing')->name('billing.')->group(function () {
    Route::resource('bills', BillingBillController::class);
    Route::resource('payments', BillingPaymentController::class);
});
