import { Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface InsuranceProvider {
    id: number;
    name: string;
}

interface InsuranceClaim {
    id: number;
    claim_date: string;
    claim_amount: number;
    approved_amount: number | null;
    policy_number: string;
    status: string;
    insurance_provider_id: number;
}

interface ClaimsEditProps extends PageProps {
    claim: InsuranceClaim;
    providers: InsuranceProvider[];
}

export default function Edit({ claim, providers }: ClaimsEditProps) {
    return (
        <AuthenticatedLayout title="Edit Insurance Claim">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/insurance/claims"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Claims
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Insurance Claim</h2>

                        <Form
                            action={`/admin/insurance/claims/${claim.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="insurance_provider_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Insurance Provider <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="insurance_provider_id"
                                            id="insurance_provider_id"
                                            required
                                            defaultValue={claim.insurance_provider_id}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            {providers.map((provider) => (
                                                <option key={provider.id} value={provider.id}>
                                                    {provider.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.insurance_provider_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.insurance_provider_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="policy_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Policy Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="policy_number"
                                            id="policy_number"
                                            required
                                            defaultValue={claim.policy_number}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.policy_number && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.policy_number}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            id="status"
                                            defaultValue={claim.status}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                        )}
                                    </div>


                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/insurance/claims"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Claim'}
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

