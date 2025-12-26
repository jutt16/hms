import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Staff {
    id: number;
    staff_id: string;
    user: {
        name: string;
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

interface AttendancesIndexProps extends PageProps {
    attendances: {
        data: Attendance[];
        current_page: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    staff: Staff[];
    filters: {
        staff_id?: number;
        status?: string;
        date?: string;
    };
}

export default function Index({ attendances, staff, filters }: AttendancesIndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this attendance record?')) {
            router.delete(`/admin/staff/attendances/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Attendance">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
                    <Link
                        href="/admin/staff/attendances/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        Record Attendance
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                    <div className="px-4 py-5 sm:p-6">
                        <form method="get" action="/admin/staff/attendances" className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div>
                                <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Staff
                                </label>
                                <select
                                    name="staff_id"
                                    id="staff_id"
                                    defaultValue={filters.staff_id || ''}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                >
                                    <option value="">All Staff</option>
                                    {staff.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.user.name} ({s.staff_id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    id="status"
                                    defaultValue={filters.status || ''}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="late">Late</option>
                                    <option value="half_day">Half Day</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    defaultValue={filters.date || ''}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Filter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Staff
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Shift
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Check In
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Check Out
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {attendances.data.map((attendance) => (
                                        <tr key={attendance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {new Date(attendance.attendance_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {attendance.staff.user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {attendance.shift?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {attendance.check_in_time ? new Date(attendance.check_in_time).toLocaleTimeString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {attendance.check_out_time ? new Date(attendance.check_out_time).toLocaleTimeString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
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
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/staff/attendances/${attendance.id}`}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/admin/staff/attendances/${attendance.id}/edit`}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(attendance.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {attendances.data.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">No attendance records found.</p>
                            </div>
                        )}

                        {attendances.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {attendances.links[0].url && (
                                        <Link
                                            href={attendances.links[0].url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {attendances.links[attendances.links.length - 1].url && (
                                        <Link
                                            href={attendances.links[attendances.links.length - 1].url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Showing page <span className="font-medium">{attendances.current_page}</span> of{' '}
                                            <span className="font-medium">{attendances.last_page}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {attendances.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                                                    } ${index === 0 ? 'rounded-l-md' : ''} ${index === attendances.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

