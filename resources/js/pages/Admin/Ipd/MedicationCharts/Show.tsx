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

interface Admission {
    id: number;
    admission_number: string;
    patient: Patient;
}

interface Medicine {
    id: number;
    name: string;
}

interface User {
    name: string;
}

interface MedicationChart {
    id: number;
    medicine_name: string;
    dosage: string;
    frequency: string;
    route: string;
    start_date: string;
    end_date: string | null;
    instructions: string | null;
    status: string;
    admission: Admission;
    medicine: Medicine | null;
    prescribedBy: {
        user: User;
    };
}

interface MedicationChartsShowProps extends PageProps {
    medicationChart: MedicationChart;
}

export default function Show({ medicationChart }: MedicationChartsShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this medication chart entry?')) {
            router.delete(`/admin/ipd/medication-charts/${medicationChart.id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Medication Chart Details">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/ipd/medication-charts"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Medication Charts
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/ipd/medication-charts/${medicationChart.id}/edit`}
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Medication Chart Details</h2>
                        
                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/patients/${medicationChart.admission.patient.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {medicationChart.admission.patient.user.name} ({medicationChart.admission.patient.patient_id})
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Admission</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/ipd/admissions/${medicationChart.admission.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {medicationChart.admission.admission_number}
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Medicine</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{medicationChart.medicine_name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Dosage</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{medicationChart.dosage}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Frequency</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{medicationChart.frequency}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Route</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{medicationChart.route}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(medicationChart.start_date).toLocaleDateString()}
                                </dd>
                            </div>
                            {medicationChart.end_date && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {new Date(medicationChart.end_date).toLocaleDateString()}
                                    </dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                <dd className="mt-1">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            medicationChart.status === 'active'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : medicationChart.status === 'completed'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                        }`}
                                    >
                                        {medicationChart.status}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Prescribed By</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{medicationChart.prescribedBy.user.name}</dd>
                            </div>
                            {medicationChart.instructions && (
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Instructions</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{medicationChart.instructions}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

