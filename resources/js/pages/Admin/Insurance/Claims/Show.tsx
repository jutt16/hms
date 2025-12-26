import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Patient {
    id: number;
    patient_id: string;
    user: {
        name: string;
    };
}

interface InsuranceProvider {
    id: number;
    name: string;
}

interface User {
    name: string;
}

interface InsuranceClaim {
    id: number;
    claim_number: string;
    claim_date: string;
    claim_amount: number;
    approved_amount: number | null;
    description: string;
    status: string;
    patient: Patient;
    provider: InsuranceProvider;
    processedBy: {
        user: User;
    } | null;
}

interface ClaimsShowProps extends PageProps {
    claim: InsuranceClaim;
}

export default function Show({ claim }: ClaimsShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this insurance claim?')) {
            router.delete(`/admin/insurance/claims/${claim.id}`);
        }
    };

    return (
        <AuthenticatedLayout title={`Claim: ${claim.claim_number}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/insurance/claims"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Claims
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/insurance/claims/${claim.id}/edit`}
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Insurance Claim Details</h2>
                        
                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Claim Number</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{claim.claim_number}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                <dd className="mt-1">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            claim.status === 'approved'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : claim.status === 'rejected'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}
                                    >
                                        {claim.status}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/patients/${claim.patient.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {claim.patient.user.name} ({claim.patient.patient_id})
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Insurance Provider</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/insurance/providers/${claim.provider.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {claim.provider.name}
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Claim Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(claim.claim_date).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Claim Amount</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    ${claim.claim_amount.toLocaleString()}
                                </dd>
                            </div>
                            {claim.approved_amount && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved Amount</dt>
                                    <dd className="mt-1 text-sm text-green-600 dark:text-green-400 font-semibold">
                                        ${claim.approved_amount.toLocaleString()}
                                    </dd>
                                </div>
                            )}
                            {claim.processedBy && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Processed By</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{claim.processedBy.user.name}</dd>
                                </div>
                            )}
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{claim.description}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

