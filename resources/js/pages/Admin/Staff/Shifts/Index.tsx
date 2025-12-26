import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Shift {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

interface ShiftsIndexProps extends PageProps {
    shifts: {
        data: Shift[];
        current_page: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function Index({ shifts }: ShiftsIndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this shift?')) {
            router.delete(`/admin/staff/shifts/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Shifts">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shifts</h1>
                    <Link
                        href="/admin/staff/shifts/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        Add Shift
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Start Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            End Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {shifts.data.map((shift) => (
                                        <tr key={shift.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {shift.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(`2000-01-01T${shift.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(`2000-01-01T${shift.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        shift.is_active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}
                                                >
                                                    {shift.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/staff/shifts/${shift.id}`}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/admin/staff/shifts/${shift.id}/edit`}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(shift.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {shifts.data.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">No shifts found.</p>
                            </div>
                        )}

                        {shifts.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {shifts.links[0].url && (
                                        <Link
                                            href={shifts.links[0].url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {shifts.links[shifts.links.length - 1].url && (
                                        <Link
                                            href={shifts.links[shifts.links.length - 1].url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Showing page <span className="font-medium">{shifts.current_page}</span> of{' '}
                                            <span className="font-medium">{shifts.last_page}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {shifts.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                                                    } ${index === 0 ? 'rounded-l-md' : ''} ${index === shifts.links.length - 1 ? 'rounded-r-md' : ''}`}
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

