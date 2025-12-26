import { Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface PatientReport {
    id: number;
    title: string;
    report_type: string;
    report_date: string;
    description: string | null;
    file_path: string;
}

interface PatientReportsEditProps extends PageProps {
    report: PatientReport;
}

export default function Edit({ report }: PatientReportsEditProps) {
    return (
        <AuthenticatedLayout title="Edit Patient Report">
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Patient Report</h2>

                        <Form
                            action={`/admin/patient-reports/${report.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            required
                                            defaultValue={report.title}
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
                                            defaultValue={report.report_type}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
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
                                            defaultValue={new Date(report.report_date).toISOString().split('T')[0]}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.report_date && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.report_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Report File (Leave empty to keep current file)
                                        </label>
                                        <input
                                            type="file"
                                            name="file"
                                            id="file"
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
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Current file: {report.file_path.split('/').pop()}
                                        </p>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            rows={4}
                                            defaultValue={report.description || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
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
                                            {processing ? 'Updating...' : 'Update Report'}
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

