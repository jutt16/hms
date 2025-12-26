import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';

interface VitalSign {
    id: number;
    recorded_at: string;
    temperature: number | null;
    blood_pressure_systolic: number | null;
    blood_pressure_diastolic: number | null;
    pulse_rate: number | null;
    respiratory_rate: number | null;
    oxygen_saturation: number | null;
    weight: number | null;
    height: number | null;
    notes: string | null;
}

interface VitalSignsEditProps extends PageProps {
    vitalSign: VitalSign;
}

export default function Edit({ vitalSign }: VitalSignsEditProps) {
    const recordedAt = new Date(vitalSign.recorded_at);
    const formattedDate = recordedAt.toISOString().slice(0, 16);

    return (
        <AuthenticatedLayout title="Edit Vital Signs">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/ipd/vital-signs"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Vital Signs
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Vital Signs</h2>

                        <Form
                            action={`/admin/ipd/vital-signs/${vitalSign.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="recorded_at" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Recorded At <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="recorded_at"
                                            id="recorded_at"
                                            required
                                            defaultValue={formattedDate}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.recorded_at && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.recorded_at}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Temperature (°C)
                                            </label>
                                            <input
                                                type="number"
                                                name="temperature"
                                                id="temperature"
                                                step="0.1"
                                                min="30"
                                                max="45"
                                                defaultValue={vitalSign.temperature || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.temperature && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.temperature}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="blood_pressure_systolic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                BP Systolic
                                            </label>
                                            <input
                                                type="number"
                                                name="blood_pressure_systolic"
                                                id="blood_pressure_systolic"
                                                min="50"
                                                max="250"
                                                defaultValue={vitalSign.blood_pressure_systolic || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.blood_pressure_systolic && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.blood_pressure_systolic}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="blood_pressure_diastolic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                BP Diastolic
                                            </label>
                                            <input
                                                type="number"
                                                name="blood_pressure_diastolic"
                                                id="blood_pressure_diastolic"
                                                min="30"
                                                max="150"
                                                defaultValue={vitalSign.blood_pressure_diastolic || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.blood_pressure_diastolic && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.blood_pressure_diastolic}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="pulse_rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Pulse Rate (bpm)
                                            </label>
                                            <input
                                                type="number"
                                                name="pulse_rate"
                                                id="pulse_rate"
                                                min="30"
                                                max="200"
                                                defaultValue={vitalSign.pulse_rate || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.pulse_rate && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.pulse_rate}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="respiratory_rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Respiratory Rate
                                            </label>
                                            <input
                                                type="number"
                                                name="respiratory_rate"
                                                id="respiratory_rate"
                                                min="10"
                                                max="50"
                                                defaultValue={vitalSign.respiratory_rate || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.respiratory_rate && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.respiratory_rate}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="oxygen_saturation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Oxygen Saturation (%)
                                            </label>
                                            <input
                                                type="number"
                                                name="oxygen_saturation"
                                                id="oxygen_saturation"
                                                step="0.1"
                                                min="0"
                                                max="100"
                                                defaultValue={vitalSign.oxygen_saturation || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.oxygen_saturation && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.oxygen_saturation}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Weight (kg)
                                            </label>
                                            <input
                                                type="number"
                                                name="weight"
                                                id="weight"
                                                step="0.1"
                                                min="0"
                                                defaultValue={vitalSign.weight || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.weight && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.weight}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Height (cm)
                                            </label>
                                            <input
                                                type="number"
                                                name="height"
                                                id="height"
                                                step="0.1"
                                                min="0"
                                                defaultValue={vitalSign.height || ''}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                            {errors.height && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.height}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            id="notes"
                                            rows={3}
                                            defaultValue={vitalSign.notes || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.notes && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/ipd/vital-signs"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Vital Signs'}
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

