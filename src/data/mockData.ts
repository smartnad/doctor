export const mockDoctors = [
    {
        id: 'doc-1',
        specialization: 'Cardiologist',
        rating: 4.8,
        experience_years: 12,
        consultation_fee: 150,
        clinic_address: '123 Heart Lane, Medical City',
        bio: 'Expert in heart rhythm disorders and preventive cardiology.',
        users: {
            full_name: 'Dr. Sarah Smith',
            avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg',
        }
    },
    {
        id: 'doc-2',
        specialization: 'Dermatologist',
        rating: 4.5,
        experience_years: 8,
        consultation_fee: 100,
        clinic_address: '456 Skin Care Blvd, Wellness Town',
        bio: 'Specializing in cosmetic dermatology and skin cancer screening.',
        users: {
            full_name: 'Dr. John Doe',
            avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
        }
    },
    {
        id: 'doc-3',
        specialization: 'Pediatrician',
        rating: 4.9,
        experience_years: 15,
        consultation_fee: 120,
        clinic_address: '789 Kids Corner, Happy Valley',
        bio: 'Dedicated to the health and well-being of children from birth to young adulthood.',
        users: {
            full_name: 'Dr. Emily Blunt',
            avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
        }
    },
    {
        id: 'doc-4',
        specialization: 'Neurologist',
        rating: 4.7,
        experience_years: 10,
        consultation_fee: 180,
        clinic_address: '321 Brain Ave, Neuro Park',
        bio: 'Focusing on disorders of the nervous system.',
        users: {
            full_name: 'Dr. Michael Chang',
            avatar_url: 'https://randomuser.me/api/portraits/men/64.jpg',
        }
    },
    {
        id: 'doc-5',
        specialization: 'Orthopedic',
        rating: 4.6,
        experience_years: 14,
        consultation_fee: 160,
        clinic_address: '654 Bone St, Joint City',
        bio: 'Expert in musculoskeletal trauma, sports injuries, and degenerative diseases.',
        users: {
            full_name: 'Dr. Robert Brown',
            avatar_url: 'https://randomuser.me/api/portraits/men/88.jpg',
        }
    }
];

export const mockAppointments = [
    {
        id: 'appt-1',
        patient_id: 'demo-patient-id',
        doctor_id: 'doc-1',
        appointment_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        appointment_time: '10:00:00',
        status: 'confirmed',
        doctors: {
            specialization: 'Cardiologist',
            clinic_address: '123 Heart Lane, Medical City',
            users: {
                full_name: 'Dr. Sarah Smith',
                avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg',
            }
        },
        patients: {
            users: {
                full_name: 'Jane Doe',
                avatar_url: null
            }
        }
    },
    {
        id: 'appt-2',
        patient_id: 'demo-patient-id',
        doctor_id: 'doc-2',
        appointment_date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        appointment_time: '14:30:00',
        status: 'pending',
        doctors: {
            specialization: 'Dermatologist',
            clinic_address: '456 Skin Care Blvd, Wellness Town',
            users: {
                full_name: 'Dr. John Doe',
                avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
            }
        },
        patients: {
            users: {
                full_name: 'Jane Doe',
                avatar_url: null
            }
        }
    },
    {
        id: 'appt-3',
        patient_id: 'other-patient',
        doctor_id: 'demo-doctor-id',
        appointment_date: new Date().toISOString(), // Today
        appointment_time: '09:00:00',
        status: 'confirmed',
        doctors: {
            users: {
                full_name: 'Dr. Demo',
            }
        },
        patients: {
            users: {
                full_name: 'Alice Wonderland',
                avatar_url: 'https://randomuser.me/api/portraits/women/12.jpg'
            }
        }
    },
    {
        id: 'appt-4',
        patient_id: 'other-patient-2',
        doctor_id: 'demo-doctor-id',
        appointment_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        appointment_time: '11:00:00',
        status: 'pending',
        doctors: {
            users: {
                full_name: 'Dr. Demo',
            }
        },
        patients: {
            users: {
                full_name: 'Bob Builder',
                avatar_url: 'https://randomuser.me/api/portraits/men/22.jpg'
            }
        }
    },
    {
        id: 'appt-5',
        patient_id: 'demo-patient-id',
        doctor_id: 'doc-3',
        appointment_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        appointment_time: '16:00:00',
        status: 'completed',
        doctors: {
            specialization: 'Pediatrician',
            clinic_address: '789 Kids Corner, Happy Valley',
            users: {
                full_name: 'Dr. Emily Blunt',
                avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
            }
        },
        patients: {
            users: {
                full_name: 'Jane Doe',
                avatar_url: null
            }
        }
    }
];

export const mockAvailability: any[] = [];
export const mockPrescriptions: any[] = [];
