<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // Refresh user roles to ensure they're loaded
        $user->load('roles');

        if ($user->hasRole('super-admin') || $user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->hasRole('doctor')) {
            return redirect()->route('doctor.dashboard');
        }

        if ($user->hasRole('patient')) {
            return redirect()->route('patient.dashboard');
        }

        return redirect()->route('home');
    }

    public function destroy(): RedirectResponse
    {
        Auth::logout();

        request()->session()->invalidate();

        request()->session()->regenerateToken();

        return redirect()->route('home');
    }
}
