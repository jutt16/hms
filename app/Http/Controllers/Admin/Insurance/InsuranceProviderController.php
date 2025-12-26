<?php

namespace App\Http\Controllers\Admin\Insurance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Insurance\StoreInsuranceProviderRequest;
use App\Http\Requests\Admin\Insurance\UpdateInsuranceProviderRequest;
use App\Models\InsuranceProvider;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InsuranceProviderController extends Controller
{
    public function index(): Response
    {
        $providers = InsuranceProvider::latest()->paginate(15);

        return Inertia::render('Admin/Insurance/Providers/Index', [
            'providers' => $providers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Insurance/Providers/Create');
    }

    public function store(StoreInsuranceProviderRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $validated['is_active'] ?? true;

        InsuranceProvider::create($validated);

        return redirect()->route('admin.insurance.providers.index')
            ->with('success', 'Insurance provider created successfully.');
    }

    public function show(InsuranceProvider $provider): Response
    {
        $provider->loadCount('claims');

        return Inertia::render('Admin/Insurance/Providers/Show', [
            'provider' => $provider,
        ]);
    }

    public function edit(InsuranceProvider $provider): Response
    {
        return Inertia::render('Admin/Insurance/Providers/Edit', [
            'provider' => $provider,
        ]);
    }

    public function update(UpdateInsuranceProviderRequest $request, InsuranceProvider $provider): RedirectResponse
    {
        $provider->update($request->validated());

        return redirect()->route('admin.insurance.providers.show', $provider)
            ->with('success', 'Insurance provider updated successfully.');
    }

    public function destroy(InsuranceProvider $provider): RedirectResponse
    {
        if ($provider->claims()->exists()) {
            return redirect()->back()
                ->with('error', 'Cannot delete insurance provider with existing claims.');
        }

        $provider->delete();

        return redirect()->route('admin.insurance.providers.index')
            ->with('success', 'Insurance provider deleted successfully.');
    }
}
