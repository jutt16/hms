import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Staff {
    id: number;
    staff_id: string;
    user: {
        name: string;
    };
}

interface User {
    name: string;
}

interface Leave {
    id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    days: number;
    reason: string;
    status: string;
    staff: Staff;
    approvedBy: {
        user: User;
    } | null;
}

interface LeavesShowProps extends PageProps {
    leave: Leave;
}

export default function Show({ leave }: LeavesShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this leave request?')) {
            router.delete(`/admin/staff/leaves/${leave.id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Leave Request Details">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/staff/leaves"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Leave Requests
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/staff/leaves/${leave.id}/edit`}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Leave Request Details</h2>
                        
                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/staff/staff/${leave.staff.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {leave.staff.user.name} ({leave.staff.staff_id})
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Leave Type</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                                    {leave.leave_type.replace('_', ' ')}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(leave.start_date).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(leave.end_date).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Days</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{leave.days} day(s)</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                <dd className="mt-1">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            leave.status === 'approved'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : leave.status === 'rejected'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}
                                    >
                                        {leave.status}
                                    </span>
                                </dd>
                            </div>
                            {leave.approvedBy && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved By</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{leave.approvedBy.user.name}</dd>
                                </div>
                            )}
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{leave.reason}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

