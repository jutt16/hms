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

interface PatientReportsCreateProps extends PageProps {
    patients: Patient[];
    selectedPatient: Patient | null;
}

export default function Create({ patients, selectedPatient }: PatientReportsCreateProps) {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patient_id');

    return (
        <AuthenticatedLayout title="Upload Patient Report">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/patient-reports"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Patient Reports
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Patient Report</h2>

                        <Form
                            action="/admin/patient-reports"
                            method="post"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Patient <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="patient_id"
                                            id="patient_id"
                                            required
                                            defaultValue={selectedPatient?.id || patientId || ''}
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
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.title && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="report_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Report Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="report_type"
                                            id="report_type"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Report Type</option>
                                            <option value="Lab Report">Lab Report</option>
                                            <option value="X-Ray">X-Ray</option>
                                            <option value="CT Scan">CT Scan</option>
                                            <option value="MRI">MRI</option>
                                            <option value="Ultrasound">Ultrasound</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.report_type && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.report_type}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="report_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Report Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="report_date"
                                            id="report_date"
                                            required
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.report_date && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.report_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Report File <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            name="file"
                                            id="file"
                                            required
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100
                                                dark:file:bg-blue-900 dark:file:text-blue-300"
                                        />
                                        {errors.file && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.file}</p>
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
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            placeholder="Enter report description or notes..."
                                        />
                                        {errors.description && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/patient-reports"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Uploading...' : 'Upload Report'}
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

