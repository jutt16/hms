<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ActivityLog::with(['user']);

        if ($request->has('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }

        if ($request->has('action')) {
            $query->where('action', $request->get('action'));
        }

        if ($request->has('model_type')) {
            $query->where('model_type', $request->get('model_type'));
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->get('date_from'));
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->get('date_to'));
        }

        $activityLogs = $query->latest()->paginate(50);

        return Inertia::render('Admin/ActivityLogs/Index', [
            'activityLogs' => $activityLogs,
            'filters' => $request->only(['user_id', 'action', 'model_type', 'date_from', 'date_to']),
        ]);
    }

    public function show(ActivityLog $activityLog): Response
    {
        $activityLog->load(['user', 'model']);

        return Inertia::render('Admin/ActivityLogs/Show', [
            'activityLog' => $activityLog,
        ]);
    }
}
