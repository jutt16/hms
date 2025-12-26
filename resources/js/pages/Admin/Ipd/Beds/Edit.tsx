import { Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Ward {
    id: number;
    name: string;
}

interface Bed {
    id: number;
    bed_number: string;
    status: string;
    notes: string | null;
    is_active: boolean;
    ward_id: number;
}

interface BedsEditProps extends PageProps {
    bed: Bed;
    wards: Ward[];
}

export default function Edit({ bed, wards }: BedsEditProps) {
    return (
        <AuthenticatedLayout title="Edit Bed">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/ipd/beds"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Beds
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Bed</h2>

                        <Form
                            action={`/admin/ipd/beds/${bed.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="ward_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Ward <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="ward_id"
                                            id="ward_id"
                                            required
                                            defaultValue={bed.ward_id}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            {wards.map((ward) => (
                                                <option key={ward.id} value={ward.id}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.ward_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.ward_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="bed_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Bed Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="bed_number"
                                            id="bed_number"
                                            defaultValue={bed.bed_number}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.bed_number && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.bed_number}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Status <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="status"
                                            id="status"
                                            defaultValue={bed.status}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="available">Available</option>
                                            <option value="occupied">Occupied</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="reserved">Reserved</option>
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
                                            rows={4}
                                            defaultValue={bed.notes || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.notes && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="is_active"
                                            name="is_active"
                                            type="checkbox"
                                            defaultChecked={bed.is_active}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                            Active
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/ipd/beds"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Bed'}
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

