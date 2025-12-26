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

interface NursingNote {
    id: number;
    note_date: string;
    note_type: string;
    note: string;
    admission: Admission;
    createdBy: {
        user: User;
    };
}

interface NursingNotesShowProps extends PageProps {
    nursingNote: NursingNote;
}

export default function Show({ nursingNote }: NursingNotesShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this nursing note?')) {
            router.delete(`/admin/ipd/nursing-notes/${nursingNote.id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Nursing Note Details">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/admin/ipd/nursing-notes"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Nursing Notes
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/ipd/nursing-notes/${nursingNote.id}/edit`}
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nursing Note Details</h2>
                        
                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Note Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(nursingNote.note_date).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Note Type</dt>
                                <dd className="mt-1">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                                        {nursingNote.note_type}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/patients/${nursingNote.admission.patient.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {nursingNote.admission.patient.user.name} ({nursingNote.admission.patient.patient_id})
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Admission</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <Link
                                        href={`/admin/ipd/admissions/${nursingNote.admission.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {nursingNote.admission.admission_number}
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{nursingNote.createdBy.user.name}</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Note</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{nursingNote.note}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

