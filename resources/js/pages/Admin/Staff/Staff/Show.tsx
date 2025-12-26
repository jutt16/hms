import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface User {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    date_of_birth: string | null;
    gender: string | null;
}

interface Attendance {
    id: number;
    attendance_date: string;
    status: string;
}

interface Payroll {
    id: number;
    payroll_number: string;
    pay_period_start: string;
    net_salary: number;
}

interface Leave {
    id: number;
    leave_type: string;
    start_date: string;
    status: string;
}

interface Staff {
    id: number;
    staff_id: string;
    department: string;
    position: string;
    employee_type: string;
    joining_date: string;
    termination_date: string | null;
    salary: number | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    qualifications: string | null;
    experience: string | null;
    is_active: boolean;
    user: User;
    attendances: Attendance[];
    payrolls: Payroll[];
    leaves: Leave[];
}

interface StaffShowProps extends PageProps {
    staff: Staff;
}

export default function Show({ staff }: StaffShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this staff member?')) {
            router.delete(`/admin/staff/staff/${staff.id}`);
        }
    };

    return (
        <AuthenticatedLayout title={`Staff: ${staff.user.name}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/staff/staff"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Staff
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/staff/staff/${staff.id}/edit`}
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

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Staff Details</h2>
                                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff ID</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{staff.staff_id}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{staff.user.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{staff.user.email}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{staff.user.phone || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{staff.department}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Position</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{staff.position}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee Type</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                                            {staff.employee_type.replace('_', ' ')}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                        <dd className="mt-1">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    staff.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}
                                            >
                                                {staff.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Joining Date</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {new Date(staff.joining_date).toLocaleDateString()}
                                        </dd>
                                    </div>
                                    {staff.termination_date && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Termination Date</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {new Date(staff.termination_date).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    )}
                                    {staff.salary && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Salary</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                ${staff.salary.toLocaleString()}
                                            </dd>
                                        </div>
                                    )}
                                    {staff.user.date_of_birth && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {new Date(staff.user.date_of_birth).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    )}
                                    {staff.user.gender && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{staff.user.gender}</dd>
                                        </div>
                                    )}
                                    {staff.user.address && (
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{staff.user.address}</dd>
                                        </div>
                                    )}
                                    {staff.emergency_contact_name && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Emergency Contact</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {staff.emergency_contact_name}
                                                {staff.emergency_contact_phone && ` - ${staff.emergency_contact_phone}`}
                                            </dd>
                                        </div>
                                    )}
                                    {staff.qualifications && (
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Qualifications</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{staff.qualifications}</dd>
                                        </div>
                                    )}
                                    {staff.experience && (
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{staff.experience}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Attendance</h3>
                                    <Link
                                        href={`/admin/staff/attendances?staff_id=${staff.id}`}
                                        className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        View All
                                    </Link>
                                </div>
                                {staff.attendances.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {staff.attendances.slice(0, 5).map((attendance) => (
                                                    <tr key={attendance.id}>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                            {new Date(attendance.attendance_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                                                                {attendance.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No attendance records.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Payrolls</h3>
                                    <Link
                                        href={`/admin/staff/payrolls?staff_id=${staff.id}`}
                                        className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        View All
                                    </Link>
                                </div>
                                {staff.payrolls.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Payroll #</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Period</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Net Salary</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {staff.payrolls.slice(0, 5).map((payroll) => (
                                                    <tr key={payroll.id}>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{payroll.payroll_number}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                            {new Date(payroll.pay_period_start).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                            ${payroll.net_salary.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No payroll records.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Leaves</h3>
                                    <Link
                                        href={`/admin/staff/leaves?staff_id=${staff.id}`}
                                        className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        View All
                                    </Link>
                                </div>
                                {staff.leaves.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Start Date</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {staff.leaves.slice(0, 5).map((leave) => (
                                                    <tr key={leave.id}>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white capitalize">
                                                            {leave.leave_type.replace('_', ' ')}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                            {new Date(leave.start_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
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
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No leave records.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <Link
                                        href={`/admin/staff/attendances/create?staff_id=${staff.id}`}
                                        className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Record Attendance
                                    </Link>
                                    <Link
                                        href={`/admin/staff/payrolls/create?staff_id=${staff.id}`}
                                        className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                    >
                                        Generate Payroll
                                    </Link>
                                    <Link
                                        href={`/admin/staff/leaves/create?staff_id=${staff.id}`}
                                        className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                                    >
                                        Apply Leave
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

