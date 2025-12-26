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

interface User {
    name: string;
}

interface Payroll {
    id: number;
    payroll_number: string;
    pay_period_start: string;
    pay_period_end: string;
    basic_salary: number;
    allowances: number;
    deductions: number;
    gross_salary: number;
    net_salary: number;
    status: string;
    notes: string | null;
    staff: Staff;
    processedBy: {
        user: User;
    } | null;
}

interface PayrollsShowProps extends PageProps {
    payroll: Payroll;
}

export default function Show({ payroll }: PayrollsShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this payroll record?')) {
            router.delete(`/admin/staff/payrolls/${payroll.id}`);
        }
    };

    return (
        <AuthenticatedLayout title={`Payroll: ${payroll.payroll_number}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/staff/payrolls"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Payroll
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/staff/payrolls/${payroll.id}/edit`}
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payroll Details</h2>
                        
                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Payroll Number</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{payroll.payroll_number}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                <dd className="mt-1">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            payroll.status === 'paid'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : payroll.status === 'processed'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}
                                    >
                                        {payroll.status}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/staff/staff/${payroll.staff.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {payroll.staff.user.name} ({payroll.staff.staff_id})
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pay Period</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(payroll.pay_period_start).toLocaleDateString()} - {new Date(payroll.pay_period_end).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Basic Salary</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    ${payroll.basic_salary.toLocaleString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Allowances</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    ${payroll.allowances.toLocaleString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Deductions</dt>
                                <dd className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    ${payroll.deductions.toLocaleString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Gross Salary</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    ${payroll.gross_salary.toLocaleString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Salary</dt>
                                <dd className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                                    ${payroll.net_salary.toLocaleString()}
                                </dd>
                            </div>
                            {payroll.processedBy && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Processed By</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{payroll.processedBy.user.name}</dd>
                                </div>
                            )}
                            {payroll.notes && (
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{payroll.notes}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

