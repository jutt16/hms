import { Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

interface DashboardProps extends PageProps {
    stats: {
        upcoming_appointments: number;
        total_appointments: number;
        pending_bills: number;
        total_prescriptions: number;
    };
    upcomingAppointments: any[];
    recentPrescriptions: any[];
    pendingBills: any[];
    error?: string;
}

export default function Dashboard({ stats, upcomingAppointments, recentPrescriptions, pendingBills, error }: DashboardProps) {
    return (
        <AuthenticatedLayout title="Patient Dashboard">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Patient Dashboard
                </h1>

                {error && (
                    <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Upcoming Appointments
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {stats.upcoming_appointments}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Total Appointments
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {stats.total_appointments}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Pending Bills
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {stats.pending_bills}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Prescriptions
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {stats.total_prescriptions}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {upcomingAppointments.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Upcoming Appointments
                                    </h3>
                                    <Link
                                        href="/patient/appointments"
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        View all
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {upcomingAppointments.map((appointment) => (
                                        <div key={appointment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        Dr. {appointment.doctor?.user?.name || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(appointment.appointment_date).toLocaleString()}
                                                    </p>
                                                    {appointment.reason && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                            {appointment.reason}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {appointment.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {recentPrescriptions.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Recent Prescriptions
                                    </h3>
                                    <Link
                                        href="/patient/prescriptions"
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        View all
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentPrescriptions.map((prescription) => (
                                        <div key={prescription.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {prescription.prescription_number}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Dr. {prescription.doctor?.user?.name || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(prescription.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    prescription.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                }`}>
                                                    {prescription.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {pendingBills.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mt-6">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Pending Bills
                                </h3>
                                <Link
                                    href="/billing/bills"
                                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {pendingBills.map((bill) => (
                                    <div key={bill.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {bill.bill_number}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {bill.bill_type}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(bill.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    ${bill.total?.toLocaleString()}
                                                </p>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    bill.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                    bill.status === 'partial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}>
                                                    {bill.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

