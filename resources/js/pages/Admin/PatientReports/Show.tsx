import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Patient {
    id: number;
    patient_id: string;
    user: {
        name: string;
    };
}

interface User {
    name: string;
}

interface PatientReport {
    id: number;
    title: string;
    report_type: string;
    report_date: string;
    file_path: string;
    description: string | null;
    patient: Patient;
    uploadedBy: {
        user: User;
    };
}

interface PatientReportsShowProps extends PageProps {
    report: PatientReport;
}

export default function Show({ report }: PatientReportsShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this patient report?')) {
            router.delete(`/admin/patient-reports/${report.id}`);
        }
    };

    const handleDownload = () => {
        window.open(`/storage/${report.file_path}`, '_blank');
    };

    return (
        <AuthenticatedLayout title={`Report: ${report.title}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/patient-reports"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Patient Reports
                    </Link>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Download
                        </button>
                        <Link
                            href={`/admin/patient-reports/${report.id}/edit`}
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Patient Report Details</h2>
                        
                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{report.title}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Report Type</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{report.report_type}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/patients/${report.patient.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {report.patient.user.name} ({report.patient.patient_id})
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Report Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(report.report_date).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Uploaded By</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{report.uploadedBy.user.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">File</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <button
                                        onClick={handleDownload}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                    >
                                        {report.file_path.split('/').pop()}
                                    </button>
                                </dd>
                            </div>
                            {report.description && (
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{report.description}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

