import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
    session: Session | null;
    user: User | null;
    profile: any | null;
    isLoading: boolean;
    setSession: (session: Session | null) => Promise<void>;
    signOut: () => Promise<void>;
    checkSession: () => Promise<void>;
    demoLogin: (role: 'doctor' | 'patient') => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    setSession: async (session) => {
        if (session?.user) {
            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
            set({ session, user: session.user, profile: data, isLoading: false });
        } else {
            set({ session: null, user: null, profile: null, isLoading: false });
        }
    },
    signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null, user: null, profile: null });
    },
    checkSession: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                set({ session, user: session.user, profile: data, isLoading: false });
            } else {
                set({ session: null, user: null, profile: null, isLoading: false });
            }
        } catch (error) {
            set({ isLoading: false });
        }
    },
    demoLogin: async (role) => {
        const mockUser = {
            id: role === 'doctor' ? 'demo-doctor-id' : 'demo-patient-id',
            email: role === 'doctor' ? 'doctor@demo.com' : 'patient@demo.com',
            role: 'authenticated',
            aud: 'authenticated',
            app_metadata: {},
            user_metadata: {},
            created_at: new Date().toISOString(),
        } as User;

        const mockProfile = {
            id: mockUser.id,
            full_name: role === 'doctor' ? 'Dr. Demo' : 'Jane Doe',
            role: role,
            email: mockUser.email,
        };

        const mockSession = {
            access_token: 'demo-token',
            refresh_token: 'demo-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: mockUser,
        } as Session;

        set({ session: mockSession, user: mockUser, profile: mockProfile, isLoading: false });
    },
}));
