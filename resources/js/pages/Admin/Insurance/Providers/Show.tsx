import { Head, Link, router } from '@inertiajs/react';
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
    claims_count: number;
}

interface ProvidersShowProps extends PageProps {
    provider: InsuranceProvider;
}

export default function Show({ provider }: ProvidersShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this insurance provider?')) {
            router.delete(`/admin/insurance/providers/${provider.id}`);
        }
    };

    return (
        <AuthenticatedLayout title={`Provider: ${provider.name}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/insurance/providers"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Providers
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/insurance/providers/${provider.id}/edit`}
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Insurance Provider Details</h2>
                        
                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{provider.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                <dd className="mt-1">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            provider.is_active
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}
                                    >
                                        {provider.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </dd>
                            </div>
                            {provider.contact_person && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Person</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{provider.contact_person}</dd>
                                </div>
                            )}
                            {provider.phone && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{provider.phone}</dd>
                                </div>
                            )}
                            {provider.email && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{provider.email}</dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Claims</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{provider.claims_count}</dd>
                            </div>
                            {provider.address && (
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{provider.address}</dd>
                                </div>
                            )}
                        </dl>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href={`/admin/insurance/claims?provider_id=${provider.id}`}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                View Claims
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

