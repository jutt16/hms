import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Payroll {
    id: number;
    pay_period_start: string;
    pay_period_end: string;
    basic_salary: number;
    allowances: number;
    deductions: number;
    notes: string | null;
    status: string;
}

interface PayrollsEditProps extends PageProps {
    payroll: Payroll;
}

export default function Edit({ payroll }: PayrollsEditProps) {
    return (
        <AuthenticatedLayout title="Edit Payroll">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/staff/payrolls"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Payroll
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Payroll</h2>

                        <Form
                            action={`/admin/staff/payrolls/${payroll.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="pay_period_start" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Pay Period Start <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="pay_period_start"
                                                id="pay_period_start"
                                                required
                                                defaultValue={new Date(payroll.pay_period_start).toISOString().split('T')[0]}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.pay_period_start && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.pay_period_start}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="pay_period_end" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Pay Period End <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="pay_period_end"
                                                id="pay_period_end"
                                                required
                                                defaultValue={new Date(payroll.pay_period_end).toISOString().split('T')[0]}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.pay_period_end && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.pay_period_end}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="basic_salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Basic Salary <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="basic_salary"
                                            id="basic_salary"
                                            required
                                            step="0.01"
                                            min="0"
                                            defaultValue={payroll.basic_salary}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.basic_salary && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.basic_salary}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="allowances" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Allowances
                                        </label>
                                        <input
                                            type="number"
                                            name="allowances"
                                            id="allowances"
                                            step="0.01"
                                            min="0"
                                            defaultValue={payroll.allowances}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.allowances && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.allowances}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="deductions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Deductions
                                        </label>
                                        <input
                                            type="number"
                                            name="deductions"
                                            id="deductions"
                                            step="0.01"
                                            min="0"
                                            defaultValue={payroll.deductions}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.deductions && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.deductions}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            id="status"
                                            defaultValue={payroll.status}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processed">Processed</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            id="notes"
                                            rows={3}
                                            defaultValue={payroll.notes || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.notes && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/staff/payrolls"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Payroll'}
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

