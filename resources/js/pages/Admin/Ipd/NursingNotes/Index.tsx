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

interface NursingNote {
    id: number;
    note_date: string;
    note_type: string;
    note: string;
    admission: Admission;
}

interface NursingNotesIndexProps extends PageProps {
    nursingNotes: {
        data: NursingNote[];
        current_page: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    admissions: Admission[];
    filters: {
        admission_id?: number;
    };
}

export default function Index({ nursingNotes, admissions, filters }: NursingNotesIndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this nursing note?')) {
            router.delete(`/admin/ipd/nursing-notes/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Nursing Notes">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nursing Notes</h1>
                    <Link
                        href="/admin/ipd/nursing-notes/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        Add Note
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                    <div className="px-4 py-5 sm:p-6">
                        <form method="get" action="/admin/ipd/nursing-notes" className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="admission_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Admission
                                </label>
                                <select
                                    name="admission_id"
                                    id="admission_id"
                                    defaultValue={filters.admission_id || ''}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                >
                                    <option value="">All Admissions</option>
                                    {admissions.map((admission) => (
                                        <option key={admission.id} value={admission.id}>
                                            {admission.admission_number} - {admission.patient.user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Filter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="space-y-4">
                            {nursingNotes.data.map((note) => (
                                <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {new Date(note.note_date).toLocaleDateString()}
                                                </span>
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                                                    {note.note_type}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {note.admission.patient.user.name} ({note.admission.admission_number})
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{note.note}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Link
                                                href={`/admin/ipd/nursing-notes/${note.id}`}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin/ipd/nursing-notes/${note.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {nursingNotes.data.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">No nursing notes found.</p>
                            </div>
                        )}

                        {nursingNotes.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {nursingNotes.links[0].url && (
                                        <Link
                                            href={nursingNotes.links[0].url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {nursingNotes.links[nursingNotes.links.length - 1].url && (
                                        <Link
                                            href={nursingNotes.links[nursingNotes.links.length - 1].url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Showing page <span className="font-medium">{nursingNotes.current_page}</span> of{' '}
                                            <span className="font-medium">{nursingNotes.last_page}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {nursingNotes.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                                                    } ${index === 0 ? 'rounded-l-md' : ''} ${index === nursingNotes.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

