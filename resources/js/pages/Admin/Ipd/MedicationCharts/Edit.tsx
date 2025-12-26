import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Medicine {
    id: number;
    name: string;
}

interface MedicationChart {
    id: number;
    medicine_id: number | null;
    medicine_name: string;
    dosage: string;
    frequency: string;
    route: string;
    start_date: string;
    end_date: string | null;
    instructions: string | null;
    status: string;
}

interface MedicationChartsEditProps extends PageProps {
    medicationChart: MedicationChart;
    medicines: Medicine[];
}

export default function Edit({ medicationChart, medicines }: MedicationChartsEditProps) {
    return (
        <AuthenticatedLayout title="Edit Medication Chart">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/ipd/medication-charts"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Medication Charts
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Medication Chart</h2>

                        <Form
                            action={`/admin/ipd/medication-charts/${medicationChart.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="medicine_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Medicine
                                        </label>
                                        <select
                                            name="medicine_id"
                                            id="medicine_id"
                                            defaultValue={medicationChart.medicine_id || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Medicine (Optional)</option>
                                            {medicines.map((medicine) => (
                                                <option key={medicine.id} value={medicine.id}>
                                                    {medicine.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.medicine_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.medicine_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="medicine_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Medicine Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="medicine_name"
                                            id="medicine_name"
                                            required
                                            defaultValue={medicationChart.medicine_name}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.medicine_name && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.medicine_name}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Dosage <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="dosage"
                                                id="dosage"
                                                required
                                                defaultValue={medicationChart.dosage}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.dosage && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.dosage}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Frequency <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="frequency"
                                                id="frequency"
                                                required
                                                defaultValue={medicationChart.frequency}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.frequency && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.frequency}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="route" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Route <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="route"
                                            id="route"
                                            required
                                            defaultValue={medicationChart.route}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="Oral">Oral</option>
                                            <option value="IV">IV</option>
                                            <option value="IM">IM</option>
                                            <option value="Subcutaneous">Subcutaneous</option>
                                            <option value="Topical">Topical</option>
                                            <option value="Inhalation">Inhalation</option>
                                        </select>
                                        {errors.route && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.route}</p>
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
                                                defaultValue={new Date(medicationChart.start_date).toISOString().split('T')[0]}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.start_date && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.start_date}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                name="end_date"
                                                id="end_date"
                                                defaultValue={medicationChart.end_date ? new Date(medicationChart.end_date).toISOString().split('T')[0] : ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.end_date && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.end_date}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Instructions
                                        </label>
                                        <textarea
                                            name="instructions"
                                            id="instructions"
                                            rows={3}
                                            defaultValue={medicationChart.instructions || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.instructions && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.instructions}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            id="status"
                                            defaultValue={medicationChart.status}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                            <option value="discontinued">Discontinued</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/ipd/medication-charts"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Medication'}
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

