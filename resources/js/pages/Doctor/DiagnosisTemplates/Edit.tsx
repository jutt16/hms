import { Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface DiagnosisTemplate {
    id: number;
    name: string;
    category: string;
    diagnosis: string;
    treatment: string | null;
    is_public: boolean;
}

interface DiagnosisTemplatesEditProps extends PageProps {
    template: DiagnosisTemplate;
}

export default function Edit({ template }: DiagnosisTemplatesEditProps) {
    return (
        <AuthenticatedLayout title="Edit Diagnosis Template">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/doctor/diagnosis-templates"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Templates
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Diagnosis Template</h2>

                        <Form
                            action={`/doctor/diagnosis-templates/${template.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            defaultValue={template.name}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="category"
                                            id="category"
                                            required
                                            defaultValue={template.category}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="General">General</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Orthopedics">Orthopedics</option>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.category && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Diagnosis <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="diagnosis"
                                            id="diagnosis"
                                            required
                                            rows={8}
                                            defaultValue={template.diagnosis}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.diagnosis && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.diagnosis}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Treatment
                                        </label>
                                        <textarea
                                            name="treatment"
                                            id="treatment"
                                            rows={6}
                                            defaultValue={template.treatment || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.treatment && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.treatment}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="is_public"
                                            name="is_public"
                                            type="checkbox"
                                            defaultChecked={template.is_public}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                            Make this template public (visible to all doctors)
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/doctor/diagnosis-templates"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Template'}
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

