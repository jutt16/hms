import { Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
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

interface Bill {
    id: number;
    bill_number: string;
    total_amount: number;
    balance: number;
    status: string;
    patient: Patient;
}

interface ClaimsCreateProps extends PageProps {
    patients: Patient[];
    providers: InsuranceProvider[];
    bills: Bill[];
    selectedBill: Bill | null;
}

export default function Create({ patients, providers, bills, selectedBill }: ClaimsCreateProps) {
    return (
        <AuthenticatedLayout title="Create Insurance Claim">
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Insurance Claim</h2>

                        <Form
                            action="/admin/insurance/claims"
                            method="post"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="bill_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Bill <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="bill_id"
                                            id="bill_id"
                                            required
                                            defaultValue={selectedBill?.id || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Bill</option>
                                            {bills.map((bill) => (
                                                <option key={bill.id} value={bill.id}>
                                                    {bill.bill_number} - {bill.patient.user.name} (${bill.balance.toLocaleString()})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.bill_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.bill_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Patient <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="patient_id"
                                            id="patient_id"
                                            required
                                            defaultValue={selectedBill?.patient.id || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Patient</option>
                                            {patients.map((patient) => (
                                                <option key={patient.id} value={patient.id}>
                                                    {patient.user.name} ({patient.patient_id})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.patient_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.patient_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="insurance_provider_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Insurance Provider <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="insurance_provider_id"
                                            id="insurance_provider_id"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Provider</option>
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
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            placeholder="Enter insurance policy number"
                                        />
                                        {errors.policy_number && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.policy_number}</p>
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
                                            {processing ? 'Creating...' : 'Create Claim'}
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

