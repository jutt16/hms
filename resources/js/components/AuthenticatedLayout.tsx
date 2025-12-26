import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Form } from '@inertiajs/react';
import AdminNavigation from './AdminNavigation';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
    title?: string;
    header?: React.ReactNode;
}

export default function AuthenticatedLayout({ children, title, header }: AuthenticatedLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const getDashboardRoute = () => {
        if (!user) return '/';
        
        // Check user roles (now sent as array of strings from middleware)
        const roles = (user as { roles?: string[] }).roles || [];
        
        if (roles.includes('super-admin') || roles.includes('admin')) {
            return '/admin/dashboard';
        }
        if (roles.includes('doctor')) {
            return '/doctor/dashboard';
        }
        if (roles.includes('patient')) {
            return '/patient/dashboard';
        }
        return '/';
    };

    const isAdmin = () => {
        if (!user) return false;
        const roles = (user as { roles?: string[] }).roles || [];
        return roles.includes('super-admin') || roles.includes('admin');
    };

    return (
        <>
            {title && <Head title={title} />}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Navigation */}
                <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <Link href={getDashboardRoute()} className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">HMS</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {user && (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <Form method="post" action="/logout" as="button" type="button">
                                            {({ processing }) => (
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    {processing ? 'Logging out...' : 'Logout'}
                                                </button>
                                            )}
                                        </Form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="flex">
                    {/* Sidebar Navigation for Admin */}
                    {isAdmin() && <AdminNavigation />}

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Page Header */}
                        {header && (
                            <header className="bg-white dark:bg-gray-800 shadow">
                                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                    {header}
                                </div>
                            </header>
                        )}

                        {/* Main Content */}
                        <main className="py-6">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}

