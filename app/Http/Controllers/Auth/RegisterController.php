<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'phone' => $request->phone,
            'is_active' => true,
        ]);

        $user->assignRole('patient');

        $patientId = 'PAT-'.str_pad(Patient::count() + 1, 6, '0', STR_PAD_LEFT);

        Patient::create([
            'user_id' => $user->id,
            'patient_id' => $patientId,
        ]);

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->route('patient.dashboard');
    }
}
