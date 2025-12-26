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
    patient: Patient;
}

interface NursingNotesCreateProps extends PageProps {
    admissions: Admission[];
    selectedAdmission: Admission | null;
}

export default function Create({ admissions, selectedAdmission }: NursingNotesCreateProps) {
    const urlParams = new URLSearchParams(window.location.search);
    const admissionId = urlParams.get('admission_id');

    return (
        <AuthenticatedLayout title="Add Nursing Note">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/ipd/nursing-notes"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Nursing Notes
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Nursing Note</h2>

                        <Form
                            action="/admin/ipd/nursing-notes"
                            method="post"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="admission_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Admission <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="admission_id"
                                            id="admission_id"
                                            required
                                            defaultValue={selectedAdmission?.id || admissionId || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Admission</option>
                                            {admissions.map((admission) => (
                                                <option key={admission.id} value={admission.id}>
                                                    {admission.admission_number} - {admission.patient.user.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.admission_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.admission_id}</p>
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
                                            defaultValue={selectedAdmission?.patient.id || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Patient</option>
                                            {admissions.map((admission) => (
                                                <option key={admission.patient.id} value={admission.patient.id}>
                                                    {admission.patient.user.name} ({admission.patient.patient_id})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.patient_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.patient_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="note_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Note Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="note_type"
                                            id="note_type"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Type</option>
                                            <option value="general">General</option>
                                            <option value="medication">Medication</option>
                                            <option value="vital">Vital</option>
                                            <option value="incident">Incident</option>
                                            <option value="instruction">Instruction</option>
                                        </select>
                                        {errors.note_type && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.note_type}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="note_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Note Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="note_date"
                                            id="note_date"
                                            required
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.note_date && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.note_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Note <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="note"
                                            id="note"
                                            required
                                            rows={6}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            placeholder="Enter nursing note details..."
                                        />
                                        {errors.note && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.note}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/ipd/nursing-notes"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Saving...' : 'Save Note'}
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

