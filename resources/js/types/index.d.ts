export interface Auth {
    user: User;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PageProps {
    auth: Auth;
    url?: string;
    [key: string]: unknown;
}

export interface Appointment {
    id: number;
    appointment_number: string;
    patient_id: number;
    doctor_id: number;
    appointment_date: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    reason: string | null;
    notes: string | null;
    diagnosis: string | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
    patient?: {
        id: number;
        patient_id: string;
        user: {
            name: string;
            email: string;
        };
    };
    doctor?: {
        id: number;
        doctor_id: string;
        user: {
            name: string;
            email: string;
        };
    };
}
