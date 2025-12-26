import { Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

export default function Create() {
    return (
        <AuthenticatedLayout title="Create Staff">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/staff/staff"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Staff
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Staff Member</h2>

                        <Form
                            action="/admin/staff/staff"
                            method="post"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.name && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.email && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.password && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Confirm Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                id="password_confirmation"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Phone
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                id="phone"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.phone && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                name="date_of_birth"
                                                id="date_of_birth"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.date_of_birth && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.date_of_birth}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Address
                                        </label>
                                        <textarea
                                            name="address"
                                            id="address"
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.address && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            id="gender"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.gender && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.gender}</p>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Employment Details</h3>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Department <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="department"
                                                    id="department"
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                />
                                                {errors.department && (
                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.department}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Position <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="position"
                                                    id="position"
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                />
                                                {errors.position && (
                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.position}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                                            <div>
                                                <label htmlFor="employee_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Employee Type <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="employee_type"
                                                    id="employee_type"
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="full_time">Full Time</option>
                                                    <option value="part_time">Part Time</option>
                                                    <option value="contract">Contract</option>
                                                    <option value="intern">Intern</option>
                                                </select>
                                                {errors.employee_type && (
                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.employee_type}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="joining_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Joining Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="joining_date"
                                                    id="joining_date"
                                                    required
                                                    defaultValue={new Date().toISOString().split('T')[0]}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                />
                                                {errors.joining_date && (
                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.joining_date}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Salary
                                            </label>
                                            <input
                                                type="number"
                                                name="salary"
                                                id="salary"
                                                step="0.01"
                                                min="0"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.salary && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.salary}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Emergency Contact</h3>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Contact Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="emergency_contact_name"
                                                    id="emergency_contact_name"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                />
                                                {errors.emergency_contact_name && (
                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.emergency_contact_name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Contact Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    name="emergency_contact_phone"
                                                    id="emergency_contact_phone"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                />
                                                {errors.emergency_contact_phone && (
                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.emergency_contact_phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Additional Information</h3>

                                        <div>
                                            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Qualifications
                                            </label>
                                            <textarea
                                                name="qualifications"
                                                id="qualifications"
                                                rows={3}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.qualifications && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.qualifications}</p>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Experience
                                            </label>
                                            <textarea
                                                name="experience"
                                                id="experience"
                                                rows={3}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.experience && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.experience}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/staff/staff"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Creating...' : 'Create Staff'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

