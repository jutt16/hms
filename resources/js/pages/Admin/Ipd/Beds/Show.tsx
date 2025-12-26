import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Patient {
    id: number;
    patient_id: string;
    user: {
        name: string;
        email: string;
    };
}

interface Doctor {
    id: number;
    user: {
        name: string;
    };
}

interface Admission {
    id: number;
    admission_number: string;
    admission_date: string;
    status: string;
    patient: Patient;
    doctor: Doctor;
}

interface Ward {
    id: number;
    name: string;
}

interface Bed {
    id: number;
    bed_number: string;
    status: string;
    notes: string | null;
    is_active: boolean;
    ward: Ward;
    admission: Admission | null;
}

interface BedsShowProps extends PageProps {
    bed: Bed;
}

export default function Show({ bed }: BedsShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this bed?')) {
            router.delete(`/admin/ipd/beds/${bed.id}`);
        }
    };

    return (
        <AuthenticatedLayout title={`Bed: ${bed.bed_number}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/ipd/beds"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Beds
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/ipd/beds/${bed.id}/edit`}
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

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bed Details</h2>
                        
                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Bed Number</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{bed.bed_number}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ward</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{bed.ward.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                <dd className="mt-1">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            bed.status === 'available'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : bed.status === 'occupied'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                : bed.status === 'maintenance'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        }`}
                                    >
                                        {bed.status}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</dt>
                                <dd className="mt-1">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            bed.is_active
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}
                                    >
                                        {bed.is_active ? 'Yes' : 'No'}
                                    </span>
                                </dd>
                            </div>
                            {bed.notes && (
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{bed.notes}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>

                {bed.admission && (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Admission</h3>
                            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Admission Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{bed.admission.admission_number}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Admission Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {new Date(bed.admission.admission_date).toLocaleDateString()}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        <Link
                                            href={`/admin/patients/${bed.admission.patient.id}`}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {bed.admission.patient.user.name} ({bed.admission.patient.patient_id})
                                        </Link>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Doctor</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{bed.admission.doctor.user.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                    <dd className="mt-1">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                bed.admission.status === 'admitted'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                            }`}
                                        >
                                            {bed.admission.status}
                                        </span>
                                    </dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <Link
                                        href={`/admin/ipd/admissions/${bed.admission.id}`}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        View Admission Details
                                    </Link>
                                </div>
                            </dl>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

