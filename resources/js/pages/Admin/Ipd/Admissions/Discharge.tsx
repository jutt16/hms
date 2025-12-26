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

interface Admission {
    id: number;
    admission_number: string;
    admission_date: string;
    patient: Patient;
}

interface AdmissionsDischargeProps extends PageProps {
    admission: Admission;
}

export default function Discharge({ admission }: AdmissionsDischargeProps) {
    return (
        <AuthenticatedLayout title="Discharge Patient">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href={`/admin/ipd/admissions/${admission.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Admission
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Discharge Patient</h2>

                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Admission:</strong> {admission.admission_number}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Patient:</strong> {admission.patient.user.name} ({admission.patient.patient_id})
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Admission Date:</strong> {new Date(admission.admission_date).toLocaleDateString()}
                            </p>
                        </div>

                        <Form
                            action={`/admin/ipd/admissions/${admission.id}/discharge`}
                            method="post"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="discharge_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Discharge Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="discharge_date"
                                            id="discharge_date"
                                            required
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.discharge_date && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.discharge_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="discharge_summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Discharge Summary
                                        </label>
                                        <textarea
                                            name="discharge_summary"
                                            id="discharge_summary"
                                            rows={6}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            placeholder="Enter discharge summary, condition at discharge, follow-up instructions, etc."
                                        />
                                        {errors.discharge_summary && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.discharge_summary}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href={`/admin/ipd/admissions/${admission.id}`}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Discharging...' : 'Discharge Patient'}
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

