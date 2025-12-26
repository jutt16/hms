import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Leave {
    id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
}

interface LeavesEditProps extends PageProps {
    leave: Leave;
}

export default function Edit({ leave }: LeavesEditProps) {
    return (
        <AuthenticatedLayout title="Edit Leave Request">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/staff/leaves"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Leave Requests
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Leave Request</h2>

                        <Form
                            action={`/admin/staff/leaves/${leave.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="leave_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Leave Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="leave_type"
                                            id="leave_type"
                                            required
                                            defaultValue={leave.leave_type}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="annual">Annual Leave</option>
                                            <option value="sick">Sick Leave</option>
                                            <option value="casual">Casual Leave</option>
                                            <option value="emergency">Emergency Leave</option>
                                            <option value="maternity">Maternity Leave</option>
                                            <option value="paternity">Paternity Leave</option>
                                            <option value="unpaid">Unpaid Leave</option>
                                        </select>
                                        {errors.leave_type && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.leave_type}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Start Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="start_date"
                                                id="start_date"
                                                required
                                                defaultValue={new Date(leave.start_date).toISOString().split('T')[0]}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.start_date && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.start_date}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                End Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="end_date"
                                                id="end_date"
                                                required
                                                defaultValue={new Date(leave.end_date).toISOString().split('T')[0]}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.end_date && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.end_date}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            id="status"
                                            defaultValue={leave.status}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Reason <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="reason"
                                            id="reason"
                                            required
                                            rows={4}
                                            defaultValue={leave.reason}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.reason && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.reason}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/staff/leaves"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Leave'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

