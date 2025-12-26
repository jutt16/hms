import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { PageProps } from '@/types';
import { useState } from 'react';

interface Patient {
    id: number;
    patient_id: string;
    user: {
        name: string;
        email: string;
    };
}

interface Doctor {
    id: number;
    user: {
        name: string;
    };
}

interface Ward {
    id: number;
    name: string;
}

interface Bed {
    id: number;
    bed_number: string;
    ward: Ward;
}

interface AdmissionsCreateProps extends PageProps {
    patients: Patient[];
    doctors: Doctor[];
    wards: Ward[];
    availableBeds: Bed[];
}

export default function Create({ patients, doctors, wards, availableBeds }: AdmissionsCreateProps) {
    const [selectedWardId, setSelectedWardId] = useState<number | ''>('');
    const filteredBeds = selectedWardId
        ? availableBeds.filter((bed) => bed.ward.id === Number(selectedWardId))
        : availableBeds;

    return (
        <AuthenticatedLayout title="Create Admission">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/admin/ipd/admissions"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Admissions
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">New Admission</h2>

                        <Form
                            action="/admin/ipd/admissions"
                            method="post"
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Patient <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="patient_id"
                                            id="patient_id"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Patient</option>
                                            {patients.map((patient) => (
                                                <option key={patient.id} value={patient.id}>
                                                    {patient.user.name} ({patient.patient_id})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.patient_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.patient_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="doctor_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Doctor <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="doctor_id"
                                            id="doctor_id"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Doctor</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    {doctor.user.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.doctor_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.doctor_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="ward_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Ward <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="ward_id"
                                            id="ward_id"
                                            required
                                            value={selectedWardId}
                                            onChange={(e) => setSelectedWardId(e.target.value ? Number(e.target.value) : '')}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Select Ward</option>
                                            {wards.map((ward) => (
                                                <option key={ward.id} value={ward.id}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.ward_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.ward_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="bed_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Bed <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="bed_id"
                                            id="bed_id"
                                            required
                                            disabled={!selectedWardId || filteredBeds.length === 0}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">
                                                {!selectedWardId
                                                    ? 'Select Ward First'
                                                    : filteredBeds.length === 0
                                                    ? 'No Available Beds'
                                                    : 'Select Bed'}
                                            </option>
                                            {filteredBeds.map((bed) => (
                                                <option key={bed.id} value={bed.id}>
                                                    {bed.bed_number} ({bed.ward.name})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.bed_id && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.bed_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="admission_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Admission Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="admission_date"
                                            id="admission_date"
                                            required
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.admission_date && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.admission_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="admission_reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Admission Reason <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="admission_reason"
                                            id="admission_reason"
                                            required
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.admission_reason && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.admission_reason}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Diagnosis
                                        </label>
                                        <textarea
                                            name="diagnosis"
                                            id="diagnosis"
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.diagnosis && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.diagnosis}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            id="notes"
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.notes && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Link
                                            href="/admin/ipd/admissions"
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Admitting...' : 'Admit Patient'}
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

