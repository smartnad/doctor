import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, Button, useTheme, Avatar, Surface, IconButton } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { mockAppointments } from '../../data/mockData';

export default function MyAppointmentsScreen() {
    const navigation = useNavigation<any>();
    const user = useAuthStore(state => state.user);
    const theme = useTheme();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAppointments = async () => {
        if (!user) return;
        setLoading(true);

        if (user.id.startsWith('demo-')) {
            setTimeout(() => {
                const myAppointments = mockAppointments.filter(a => a.patient_id === user.id);
                setAppointments(myAppointments);
                setLoading(false);
            }, 500);
            return;
        }

        const { data, error } = await supabase
            .from('appointments')
            .select(`
        *,
        doctors (
          specialization,
          users (
            full_name,
            avatar_url
          )
        )
      `)
            .eq('patient_id', user.id)
            .order('appointment_date', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setAppointments(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();
    }, [user]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAppointments();
        setRefreshing(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return theme.colors.primary;
            case 'pending': return '#FFC107'; // Amber
            case 'cancelled': return theme.colors.error;
            case 'completed': return theme.colors.secondary;
            default: return '#9E9E9E';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Surface style={styles.header} elevation={2}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>My Appointments</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>Track your health journey</Text>
            </Surface>

            {loading && !refreshing ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card style={styles.card} mode="elevated">
                            <Card.Content>
                                <View style={styles.cardHeader}>
                                    <Avatar.Image
                                        size={56}
                                        source={{ uri: item.doctors?.users?.avatar_url || 'https://via.placeholder.com/150' }}
                                        style={{ backgroundColor: theme.colors.surface }}
                                    />
                                    <View style={styles.doctorInfo}>
                                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">
                                            {item.doctors?.users?.full_name || 'Unknown Doctor'}
                                        </Text>
                                        <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>{item.doctors?.specialization}</Text>
                                    </View>
                                    <Chip
                                        textStyle={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}
                                        style={{ backgroundColor: getStatusColor(item.status), height: 24, alignItems: 'center' }}
                                        compact
                                    >
                                        {item.status.toUpperCase()}
                                    </Chip>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.detailsRow}>
                                    <View style={styles.detailItem}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <IconButton icon="calendar" size={16} style={{ margin: 0 }} />
                                            <Text variant="bodyMedium" style={{ fontWeight: 'bold', marginLeft: 4 }}>{new Date(item.appointment_date).toLocaleDateString()}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <IconButton icon="clock-outline" size={16} style={{ margin: 0 }} />
                                            <Text variant="bodyMedium" style={{ fontWeight: 'bold', marginLeft: 4 }}>{item.appointment_time.slice(0, 5)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Card.Content>
                            <Card.Actions style={{ justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: 16 }}>
                                {item.status === 'completed' && (
                                    <Button
                                        mode="contained"
                                        onPress={() => navigation.navigate('PrescriptionDetails', { appointmentId: item.id })}
                                        style={{ backgroundColor: theme.colors.primary, borderRadius: 8 }}
                                        icon="file-document-outline"
                                    >
                                        View Prescription
                                    </Button>
                                )}
                            </Card.Actions>
                        </Card>
                    )}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Text variant="bodyLarge" style={{ color: '#888' }}>No appointments found.</Text>
                        </View>
                    }
                />
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
        backgroundColor: '#fff',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    list: {
        padding: 16,
        paddingBottom: 100, // Extra padding for bottom tab bar
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    doctorInfo: {
        flex: 1,
        marginLeft: 16,
        marginRight: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    detailItem: {
        alignItems: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
