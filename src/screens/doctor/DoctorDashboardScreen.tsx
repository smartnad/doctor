import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator, useTheme, Avatar, Chip, IconButton, Surface } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { mockAppointments } from '../../data/mockData';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function DoctorDashboardScreen() {
    const navigation = useNavigation<any>();
    const user = useAuthStore(state => state.user);
    const signOut = useAuthStore(state => state.signOut);
    const theme = useTheme();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAppointments = async () => {
        if (!user) return;
        // Only set loading on initial fetch, not on refresh or focus
        if (appointments.length === 0) setLoading(true);

        if (user.id.startsWith('demo-')) {
            setTimeout(() => {
                const myAppointments = mockAppointments.filter(a => a.doctor_id === user.id);
                setAppointments(myAppointments);
                setLoading(false);
            }, 500);
            return;
        }

        const { data, error } = await supabase
            .from('appointments')
            .select(`
        *,
        patients (
          users (
            full_name,
            avatar_url
          )
        )
      `)
            .eq('doctor_id', user.id)
            .order('appointment_date', { ascending: true });

        if (error) {
            console.error(error);
        } else {
            setAppointments(data);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [user])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAppointments();
        setRefreshing(false);
    };

    const updateStatus = async (id: string, status: string) => {
        if (user?.id?.startsWith('demo-')) {
            // Simulate update for demo
            const apptIndex = mockAppointments.findIndex(a => a.id === id);
            if (apptIndex !== -1) {
                mockAppointments[apptIndex].status = status;
            }
            // Refresh local state from the updated mock data
            const myAppointments = mockAppointments.filter(a => a.doctor_id === user.id);
            setAppointments(myAppointments);
            return;
        }

        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            fetchAppointments();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return theme.colors.primary;
            case 'pending': return '#FFC107';
            case 'cancelled': return theme.colors.error;
            case 'completed': return theme.colors.secondary;
            default: return '#9E9E9E';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Surface style={styles.header} elevation={2}>
                <View>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Dashboard</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>Welcome back, Doctor</Text>
                </View>
                <IconButton
                    icon="logout"
                    mode="contained"
                    containerColor={theme.colors.errorContainer}
                    iconColor={theme.colors.error}
                    onPress={signOut}
                    size={20}
                />
            </Surface>

            {loading && !refreshing ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                >
                    {appointments.filter(a => a.status === 'pending').length > 0 && (
                        <>
                            <View style={styles.sectionHeader}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.error }}>Appointment Requests</Text>
                            </View>
                            <View style={styles.list}>
                                {appointments.filter(a => a.status === 'pending').map((item) => (
                                    <Card key={item.id} style={[styles.card, { borderColor: theme.colors.errorContainer, borderWidth: 1 }]} mode="elevated">
                                        <Card.Content>
                                            <View style={styles.cardHeader}>
                                                <Avatar.Text
                                                    size={48}
                                                    label={item.patients?.users?.full_name?.substring(0, 2).toUpperCase() || 'P'}
                                                    style={{ backgroundColor: theme.colors.errorContainer }}
                                                    color={theme.colors.error}
                                                />
                                                <View style={styles.patientInfo}>
                                                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.patients?.users?.full_name || 'Unknown Patient'}</Text>
                                                    <View style={styles.dateTimeRow}>
                                                        <IconButton icon="calendar" size={16} style={{ margin: 0 }} />
                                                        <Text variant="bodySmall" style={{ color: '#666' }}>{new Date(item.appointment_date).toLocaleDateString()}</Text>
                                                        <IconButton icon="clock-outline" size={16} style={{ margin: 0, marginLeft: 8 }} />
                                                        <Text variant="bodySmall" style={{ color: '#666' }}>{item.appointment_time.slice(0, 5)}</Text>
                                                    </View>
                                                </View>
                                                <Chip
                                                    textStyle={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}
                                                    style={{ backgroundColor: getStatusColor(item.status), height: 24, alignItems: 'center' }}
                                                    compact
                                                >
                                                    {item.status.toUpperCase()}
                                                </Chip>
                                            </View>

                                            <View style={styles.actionsContainer}>
                                                <View style={styles.buttonRow}>
                                                    <Button
                                                        mode="contained"
                                                        onPress={() => updateStatus(item.id, 'confirmed')}
                                                        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                                                        compact
                                                    >
                                                        Confirm
                                                    </Button>
                                                    <Button
                                                        mode="outlined"
                                                        onPress={() => updateStatus(item.id, 'cancelled')}
                                                        style={[styles.actionButton, { borderColor: theme.colors.error }]}
                                                        textColor={theme.colors.error}
                                                        compact
                                                    >
                                                        Cancel
                                                    </Button>
                                                </View>
                                                <Button
                                                    mode="text"
                                                    compact
                                                    onPress={() => navigation.navigate('PatientHistory', { patientId: item.patient_id, patientName: item.patients?.users?.full_name })}
                                                    textColor={theme.colors.primary}
                                                    style={{ marginTop: 8 }}
                                                >
                                                    View History
                                                </Button>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                ))}
                            </View>
                        </>
                    )}

                    <View style={styles.sectionHeader}>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>Upcoming Appointments</Text>
                    </View>

                    <View style={styles.list}>
                        {appointments.filter(a => a.status === 'confirmed' || a.status === 'completed').length === 0 ? (
                            <Text variant="bodyMedium" style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>No upcoming appointments.</Text>
                        ) : (
                            appointments.filter(a => a.status === 'confirmed' || a.status === 'completed').map((item) => (
                                <Card key={item.id} style={styles.card} mode="elevated">
                                    <Card.Content>
                                        <View style={styles.cardHeader}>
                                            <Avatar.Text
                                                size={48}
                                                label={item.patients?.users?.full_name?.substring(0, 2).toUpperCase() || 'P'}
                                                style={{ backgroundColor: theme.colors.primaryContainer }}
                                                color={theme.colors.onPrimaryContainer}
                                            />
                                            <View style={styles.patientInfo}>
                                                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.patients?.users?.full_name || 'Unknown Patient'}</Text>
                                                <View style={styles.dateTimeRow}>
                                                    <IconButton icon="calendar" size={16} style={{ margin: 0 }} />
                                                    <Text variant="bodySmall" style={{ color: '#666' }}>{new Date(item.appointment_date).toLocaleDateString()}</Text>
                                                    <IconButton icon="clock-outline" size={16} style={{ margin: 0, marginLeft: 8 }} />
                                                    <Text variant="bodySmall" style={{ color: '#666' }}>{item.appointment_time.slice(0, 5)}</Text>
                                                </View>
                                            </View>
                                            <Chip
                                                textStyle={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}
                                                style={{ backgroundColor: getStatusColor(item.status), height: 24, alignItems: 'center' }}
                                                compact
                                            >
                                                {item.status.toUpperCase()}
                                            </Chip>
                                        </View>

                                        <View style={styles.actionsContainer}>
                                            {item.status === 'confirmed' && (
                                                <Button
                                                    mode="contained"
                                                    onPress={() => navigation.navigate('AddPrescription', {
                                                        appointmentId: item.id,
                                                        patientName: item.patients?.users?.full_name
                                                    })}
                                                    style={{ backgroundColor: theme.colors.secondary, borderRadius: 8 }}
                                                    icon="pill"
                                                >
                                                    Complete & Prescribe
                                                </Button>
                                            )}
                                            {item.status === 'completed' && (
                                                <Button mode="text" disabled textColor={theme.colors.secondary} icon="check-circle">Completed</Button>
                                            )}
                                            <Button
                                                mode="text"
                                                compact
                                                onPress={() => navigation.navigate('PatientHistory', { patientId: item.patient_id, patientName: item.patients?.users?.full_name })}
                                                textColor={theme.colors.primary}
                                                style={{ marginTop: 8 }}
                                            >
                                                View History
                                            </Button>
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))
                        )}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        paddingTop: 48,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    sectionHeader: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    list: {
        padding: 16,
        paddingTop: 0,
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    patientInfo: {
        flex: 1,
        marginLeft: 16,
    },
    dateTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    actionsContainer: {
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        borderRadius: 8,
        minWidth: 80,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
