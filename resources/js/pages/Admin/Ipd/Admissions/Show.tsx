import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface User {
    name: string;
    email: string;
}

interface Patient {
    id: number;
    patient_id: string;
    user: User;
}

interface Doctor {
    id: number;
    user: User;
}

interface Ward {
    id: number;
    name: string;
}

interface Bed {
    id: number;
    bed_number: string;
    ward: Ward;
}

interface VitalSign {
    id: number;
    recorded_at: string;
    temperature: number | null;
    blood_pressure_systolic: number | null;
    blood_pressure_diastolic: number | null;
    pulse_rate: number | null;
}

interface NursingNote {
    id: number;
    note_date: string;
    note_type: string;
    note: string;
}

interface MedicationChart {
    id: number;
    medicine_name: string;
    dosage: string;
    frequency: string;
    status: string;
}

interface Admission {
    id: number;
    admission_number: string;
    admission_date: string;
    discharge_date: string | null;
    status: string;
    admission_reason: string;
    diagnosis: string | null;
    notes: string | null;
    discharge_summary: string | null;
    patient: Patient;
    doctor: Doctor;
    bed: Bed;
    ward: Ward;
    vitalSigns: VitalSign[];
    nursingNotes: NursingNote[];
    medicationCharts: MedicationChart[];
}

interface AdmissionsShowProps extends PageProps {
    admission: Admission;
}

export default function Show({ admission }: AdmissionsShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this admission?')) {
            router.delete(`/admin/ipd/admissions/${admission.id}`);
        }
    };

    return (
        <AuthenticatedLayout title={`Admission: ${admission.admission_number}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/ipd/admissions"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Admissions
                    </Link>
                    <div className="flex gap-2">
                        {admission.status === 'admitted' && (
                            <Link
                                href={`/admin/ipd/admissions/${admission.id}/discharge`}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Discharge
                            </Link>
                        )}
                        <Link
                            href={`/admin/ipd/admissions/${admission.id}/edit`}
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

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admission Details</h2>
                                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Admission Number</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{admission.admission_number}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                        <dd className="mt-1">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    admission.status === 'admitted'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                }`}
                                            >
                                                {admission.status}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                            <Link
                                                href={`/admin/patients/${admission.patient.id}`}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {admission.patient.user.name} ({admission.patient.patient_id})
                                            </Link>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Doctor</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{admission.doctor.user.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ward / Bed</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {admission.ward.name} / {admission.bed.bed_number}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Admission Date</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {new Date(admission.admission_date).toLocaleDateString()}
                                        </dd>
                                    </div>
                                    {admission.discharge_date && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Discharge Date</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {new Date(admission.discharge_date).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Admission Reason</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{admission.admission_reason}</dd>
                                    </div>
                                    {admission.diagnosis && (
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Diagnosis</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{admission.diagnosis}</dd>
                                        </div>
                                    )}
                                    {admission.notes && (
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{admission.notes}</dd>
                                        </div>
                                    )}
                                    {admission.discharge_summary && (
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Discharge Summary</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{admission.discharge_summary}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vital Signs</h3>
                                    <Link
                                        href={`/admin/ipd/vital-signs/create?admission_id=${admission.id}`}
                                        className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Add Vital Sign
                                    </Link>
                                </div>
                                {admission.vitalSigns.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Temp</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">BP</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pulse</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {admission.vitalSigns.map((vital) => (
                                                    <tr key={vital.id}>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                            {new Date(vital.recorded_at).toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                            {vital.temperature ? `${vital.temperature}°C` : '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                            {vital.blood_pressure_systolic && vital.blood_pressure_diastolic
                                                                ? `${vital.blood_pressure_systolic}/${vital.blood_pressure_diastolic}`
                                                                : '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                            {vital.pulse_rate ? `${vital.pulse_rate} bpm` : '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No vital signs recorded.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nursing Notes</h3>
                                    <Link
                                        href={`/admin/ipd/nursing-notes/create?admission_id=${admission.id}`}
                                        className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Add Note
                                    </Link>
                                </div>
                                {admission.nursingNotes.length > 0 ? (
                                    <div className="space-y-4">
                                        {admission.nursingNotes.map((note) => (
                                            <div key={note.id} className="border-l-4 border-blue-500 pl-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {new Date(note.note_date).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{note.note_type}</p>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{note.note}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No nursing notes recorded.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Medication Chart</h3>
                                    <Link
                                        href={`/admin/ipd/medication-charts/create?admission_id=${admission.id}`}
                                        className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Add Medication
                                    </Link>
                                </div>
                                {admission.medicationCharts.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Medicine</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Dosage</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Frequency</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {admission.medicationCharts.map((med) => (
                                                    <tr key={med.id}>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{med.medicine_name}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{med.dosage}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{med.frequency}</td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span
                                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                    med.status === 'active'
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                                }`}
                                                            >
                                                                {med.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No medications charted.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <Link
                                        href={`/admin/ipd/vital-signs/create?admission_id=${admission.id}`}
                                        className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Record Vital Signs
                                    </Link>
                                    <Link
                                        href={`/admin/ipd/nursing-notes/create?admission_id=${admission.id}`}
                                        className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Add Nursing Note
                                    </Link>
                                    <Link
                                        href={`/admin/ipd/medication-charts/create?admission_id=${admission.id}`}
                                        className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                                    >
                                        Chart Medication
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

