import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface InsuranceProvider {
    id: number;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    is_active: boolean;
}

interface ProvidersEditProps extends PageProps {
    provider: InsuranceProvider;
}

export default function Edit({ provider }: ProvidersEditProps) {
    return (
        <AuthenticatedLayout title="Edit Insurance Provider">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/insurance/providers"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Providers
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Insurance Provider</h2>

                        <Form
                            action={`/admin/insurance/providers/${provider.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            defaultValue={provider.name}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Contact Person
                                        </label>
                                        <input
                                            type="text"
                                            name="contact_person"
                                            id="contact_person"
                                            defaultValue={provider.contact_person || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.contact_person && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.contact_person}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Phone
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                id="phone"
                                                defaultValue={provider.phone || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.phone && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                defaultValue={provider.email || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.email && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Address
                                        </label>
                                        <textarea
                                            name="address"
                                            id="address"
                                            rows={3}
                                            defaultValue={provider.address || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.address && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="is_active"
                                            name="is_active"
                                            type="checkbox"
                                            defaultChecked={provider.is_active}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                            Active
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/insurance/providers"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Provider'}
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

