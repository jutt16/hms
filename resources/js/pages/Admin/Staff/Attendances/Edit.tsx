import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

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
    shift_id: number | null;
}

interface AttendancesEditProps extends PageProps {
    attendance: Attendance;
    shifts: Shift[];
}

export default function Edit({ attendance, shifts }: AttendancesEditProps) {
    const formatDateTime = (dateTime: string | null) => {
        if (!dateTime) return '';
        const d = new Date(dateTime);
        return d.toISOString().slice(0, 16);
    };

    return (
        <AuthenticatedLayout title="Edit Attendance">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/staff/attendances"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Attendance
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Attendance</h2>

                        <Form
                            action={`/admin/staff/attendances/${attendance.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="attendance_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Attendance Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="attendance_date"
                                            id="attendance_date"
                                            required
                                            defaultValue={new Date(attendance.attendance_date).toISOString().split('T')[0]}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.attendance_date && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.attendance_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="shift_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Shift
                                        </label>
                                        <select
                                            name="shift_id"
                                            id="shift_id"
                                            defaultValue={attendance.shift_id || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Shift (Optional)</option>
                                            {shifts.map((shift) => (
                                                <option key={shift.id} value={shift.id}>
                                                    {shift.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.shift_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.shift_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Status <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="status"
                                            id="status"
                                            required
                                            defaultValue={attendance.status}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="present">Present</option>
                                            <option value="absent">Absent</option>
                                            <option value="late">Late</option>
                                            <option value="half_day">Half Day</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="check_in_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Check In Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="check_in_time"
                                                id="check_in_time"
                                                defaultValue={formatDateTime(attendance.check_in_time)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.check_in_time && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.check_in_time}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="check_out_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Check Out Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="check_out_time"
                                                id="check_out_time"
                                                defaultValue={formatDateTime(attendance.check_out_time)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.check_out_time && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.check_out_time}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            id="notes"
                                            rows={3}
                                            defaultValue={attendance.notes || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.notes && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/staff/attendances"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Attendance'}
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

