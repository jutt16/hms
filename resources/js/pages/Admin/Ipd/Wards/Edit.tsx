import { Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Ward {
    id: number;
    ward_number: string;
    name: string;
    type: string;
    total_beds: number;
    charge_per_day: number | null;
    description: string | null;
    is_active: boolean;
}

interface WardsEditProps extends PageProps {
    ward: Ward;
}

export default function Edit({ ward }: WardsEditProps) {
    return (
        <AuthenticatedLayout title="Edit Ward">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/ipd/wards"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Wards
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Ward</h2>

                        <Form
                            action={`/admin/ipd/wards/${ward.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="ward_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Ward Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="ward_number"
                                            id="ward_number"
                                            defaultValue={ward.ward_number}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.ward_number && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.ward_number}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            defaultValue={ward.name}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="type"
                                            id="type"
                                            defaultValue={ward.type}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="General">General</option>
                                            <option value="ICU">ICU</option>
                                            <option value="Emergency">Emergency</option>
                                            <option value="Maternity">Maternity</option>
                                            <option value="Pediatric">Pediatric</option>
                                            <option value="Surgical">Surgical</option>
                                            <option value="Orthopedic">Orthopedic</option>
                                        </select>
                                        {errors.type && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.type}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="total_beds" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Total Beds <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="total_beds"
                                            id="total_beds"
                                            defaultValue={ward.total_beds}
                                            required
                                            min="1"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.total_beds && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.total_beds}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="charge_per_day" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Charge Per Day
                                        </label>
                                        <input
                                            type="number"
                                            name="charge_per_day"
                                            id="charge_per_day"
                                            defaultValue={ward.charge_per_day || ''}
                                            step="0.01"
                                            min="0"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.charge_per_day && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.charge_per_day}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            rows={4}
                                            defaultValue={ward.description || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.description && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="is_active"
                                            name="is_active"
                                            type="checkbox"
                                            defaultChecked={ward.is_active}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                            Active
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/ipd/wards"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Ward'}
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

