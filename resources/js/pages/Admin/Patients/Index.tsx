import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Patient {
    id: number;
    patient_id: string;
    user: {
        name: string;
        email: string;
        phone: string;
    };
}

interface PatientsIndexProps extends PageProps {
    patients: {
        data: Patient[];
        current_page: number;
        last_page: number;
    };
}

export default function Index({ patients }: PatientsIndexProps) {
    return (
        <>
            <Head title="Patients" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Patients
                        </h1>
                        <Link
                            href="/admin/patients/create"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            Add Patient
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {patients.data.map((patient) => (
                                <li key={patient.id}>
                                    <Link
                                        href={`/admin/patients/${patient.id}`}
                                        className="block hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <p className="text-sm font-medium text-blue-600 truncate dark:text-blue-400">
                                                        {patient.user.name}
                                                    </p>
                                                    <p className="ml-2 flex-shrink-0 flex">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                            {patient.patient_id}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                        {patient.user.email}
                                                    </p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                                                        {patient.user.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

