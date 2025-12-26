<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemSettingController extends Controller
{
    public function index(): Response
    {
        $settings = SystemSetting::orderBy('group')
            ->orderBy('key')
            ->get()
            ->groupBy('group');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*.key' => ['required', 'string'],
            'settings.*.value' => ['nullable'],
            'settings.*.type' => ['required', 'in:string,integer,boolean,json'],
            'settings.*.group' => ['nullable', 'string'],
        ]);

        foreach ($validated['settings'] as $setting) {
            SystemSetting::setValue(
                $setting['key'],
                $setting['value'],
                $setting['type'],
                $setting['group'] ?? 'general'
            );
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }

    public function toggleModule(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'module' => ['required', 'in:pharmacy,lab,billing,appointments'],
            'enabled' => ['required', 'boolean'],
        ]);

        SystemSetting::setValue(
            "module_{$validated['module']}_enabled",
            $validated['enabled'],
            'boolean',
            'modules'
        );

        return redirect()->back()->with('success', 'Module status updated successfully.');
    }
}
