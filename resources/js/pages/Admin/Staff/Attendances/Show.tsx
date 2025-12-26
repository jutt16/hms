import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Staff {
    id: number;
    staff_id: string;
    user: {
        name: string;
        email: string;
    };
}

interface Shift {
    id: number;
    name: string;
}

interface Attendance {
    id: number;
    attendance_date: string;
    check_in_time: string | null;
    check_out_time: string | null;
    status: string;
    notes: string | null;
    staff: Staff;
    shift: Shift | null;
}

interface AttendancesShowProps extends PageProps {
    attendance: Attendance;
}

export default function Show({ attendance }: AttendancesShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this attendance record?')) {
            router.delete(`/admin/staff/attendances/${attendance.id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Attendance Details">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/staff/attendances"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Attendance
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/staff/attendances/${attendance.id}/edit`}
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Attendance Details</h2>
                        
                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(attendance.attendance_date).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/staff/staff/${attendance.staff.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {attendance.staff.user.name} ({attendance.staff.staff_id})
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Shift</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {attendance.shift?.name || 'N/A'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                <dd className="mt-1">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            attendance.status === 'present'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : attendance.status === 'absent'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                : attendance.status === 'late'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        }`}
                                    >
                                        {attendance.status.replace('_', ' ')}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Check In Time</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {attendance.check_in_time
                                        ? new Date(attendance.check_in_time).toLocaleString()
                                        : 'N/A'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Check Out Time</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {attendance.check_out_time
                                        ? new Date(attendance.check_out_time).toLocaleString()
                                        : 'N/A'}
                                </dd>
                            </div>
                            {attendance.notes && (
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{attendance.notes}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

