<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $credentials = $this->only('email', 'password');
        $remember = $this->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            throw new AuthenticationException(__('auth.failed'));
        }

        $user = Auth::user();

        if (! $user->is_active) {
            Auth::logout();
            throw new AuthenticationException('Your account has been deactivated. Please contact administrator.');
        }
    }
}
