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

interface Admission {
    id: number;
    admission_number: string;
    patient: Patient;
}

interface User {
    name: string;
}

interface VitalSign {
    id: number;
    recorded_at: string;
    temperature: number | null;
    blood_pressure_systolic: number | null;
    blood_pressure_diastolic: number | null;
    pulse_rate: number | null;
    respiratory_rate: number | null;
    oxygen_saturation: number | null;
    weight: number | null;
    height: number | null;
    bmi: number | null;
    notes: string | null;
    admission: Admission;
    recordedBy: {
        user: User;
    };
}

interface VitalSignsShowProps extends PageProps {
    vitalSign: VitalSign;
}

export default function Show({ vitalSign }: VitalSignsShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this vital sign record?')) {
            router.delete(`/admin/ipd/vital-signs/${vitalSign.id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Vital Signs Details">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/ipd/vital-signs"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Vital Signs
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/ipd/vital-signs/${vitalSign.id}/edit`}
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Vital Signs Details</h2>
                        
                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Recorded At</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(vitalSign.recorded_at).toLocaleString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Recorded By</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{vitalSign.recordedBy.user.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/patients/${vitalSign.admission.patient.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {vitalSign.admission.patient.user.name} ({vitalSign.admission.patient.patient_id})
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Admission</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/ipd/admissions/${vitalSign.admission.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {vitalSign.admission.admission_number}
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Temperature</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {vitalSign.temperature ? `${vitalSign.temperature}°C` : 'N/A'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Pressure</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {vitalSign.blood_pressure_systolic && vitalSign.blood_pressure_diastolic
                                        ? `${vitalSign.blood_pressure_systolic}/${vitalSign.blood_pressure_diastolic} mmHg`
                                        : 'N/A'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pulse Rate</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {vitalSign.pulse_rate ? `${vitalSign.pulse_rate} bpm` : 'N/A'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Respiratory Rate</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {vitalSign.respiratory_rate ? `${vitalSign.respiratory_rate} /min` : 'N/A'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Oxygen Saturation</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {vitalSign.oxygen_saturation ? `${vitalSign.oxygen_saturation}%` : 'N/A'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {vitalSign.weight ? `${vitalSign.weight} kg` : 'N/A'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Height</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {vitalSign.height ? `${vitalSign.height} cm` : 'N/A'}
                                </dd>
                            </div>
                            {vitalSign.bmi && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">BMI</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{vitalSign.bmi}</dd>
                                </div>
                            )}
                            {vitalSign.notes && (
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{vitalSign.notes}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

