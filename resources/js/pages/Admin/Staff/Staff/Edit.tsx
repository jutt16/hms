import { Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    date_of_birth: string | null;
    gender: string | null;
}

interface Staff {
    id: number;
    department: string;
    position: string;
    employee_type: string;
    joining_date: string;
    termination_date: string | null;
    salary: number | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    qualifications: string | null;
    experience: string | null;
    is_active: boolean;
    user: User;
}

interface StaffEditProps extends PageProps {
    staff: Staff;
}

export default function Edit({ staff }: StaffEditProps) {
    return (
        <AuthenticatedLayout title="Edit Staff">
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Staff Member</h2>

                        <Form
                            action={`/admin/staff/staff/${staff.id}`}
                            method="put"
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
                                                defaultValue={staff.user.name}
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
                                                defaultValue={staff.user.email}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.email && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Password (leave blank to keep current)
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                        )}
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
                                                defaultValue={staff.user.phone || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                name="date_of_birth"
                                                id="date_of_birth"
                                                defaultValue={staff.user.date_of_birth ? new Date(staff.user.date_of_birth).toISOString().split('T')[0] : ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
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
                                            defaultValue={staff.user.address || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            id="gender"
                                            defaultValue={staff.user.gender || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
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
                                                    defaultValue={staff.department}
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
                                                    defaultValue={staff.position}
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
                                                    defaultValue={staff.employee_type}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                >
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
                                                    defaultValue={new Date(staff.joining_date).toISOString().split('T')[0]}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                />
                                                {errors.joining_date && (
                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.joining_date}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                                            <div>
                                                <label htmlFor="termination_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Termination Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="termination_date"
                                                    id="termination_date"
                                                    defaultValue={staff.termination_date ? new Date(staff.termination_date).toISOString().split('T')[0] : ''}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Salary
                                                </label>
                                                <input
                                                    type="number"
                                                    name="salary"
                                                    id="salary"
                                                    step="0.01"
                                                    min="0"
                                                    defaultValue={staff.salary || ''}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                />
                                            </div>
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
                                                    defaultValue={staff.emergency_contact_name || ''}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Contact Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    name="emergency_contact_phone"
                                                    id="emergency_contact_phone"
                                                    defaultValue={staff.emergency_contact_phone || ''}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                />
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
                                                defaultValue={staff.qualifications || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                        </div>

                                        <div className="mt-6">
                                            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Experience
                                            </label>
                                            <textarea
                                                name="experience"
                                                id="experience"
                                                rows={3}
                                                defaultValue={staff.experience || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                        </div>

                                        <div className="mt-6 flex items-center">
                                            <input
                                                id="is_active"
                                                name="is_active"
                                                type="checkbox"
                                                defaultChecked={staff.is_active}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                                Active
                                            </label>
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
                                            {processing ? 'Updating...' : 'Update Staff'}
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

