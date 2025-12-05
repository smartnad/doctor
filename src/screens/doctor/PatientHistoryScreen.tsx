import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, ActivityIndicator, useTheme, Avatar, Chip, Surface, IconButton } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { useRoute } from '@react-navigation/native';
import { mockAppointments } from '../../data/mockData';

export default function PatientHistoryScreen() {
    const route = useRoute<any>();
    const { patientId, patientName } = route.params;
    const theme = useTheme();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);

            if (patientId?.startsWith('demo-') || patientId === 'demo-patient-id') {
                // Simulate network delay
                setTimeout(() => {
                    const historyData = mockAppointments.filter(
                        appt => (appt.patient_id === patientId || appt.patient_id === 'demo-patient-id') &&
                            (appt.status === 'completed' || appt.status === 'confirmed') // Show confirmed too for demo purposes if needed, but strictly history is completed
                    ).map(appt => ({
                        ...appt,
                        doctors: appt.doctors,
                        prescriptions: [] // Mock prescriptions if needed, or leave empty
                    }));
                    setHistory(historyData);
                    setLoading(false);
                }, 500);
                return;
            }

            const { data, error } = await supabase
                .from('appointments')
                .select(`
            *,
            doctors (
              users (
                full_name
              )
            ),
            prescriptions (*)
          `)
                .eq('patient_id', patientId)
                .eq('status', 'completed')
                .order('appointment_date', { ascending: false });

            if (error) {
                console.error(error);
            } else {
                setHistory(data);
            }
            setLoading(false);
        };

        fetchHistory();
    }, [patientId]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Surface style={styles.header} elevation={2}>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Patient History</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>{patientName}</Text>
            </Surface>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card style={styles.card} mode="elevated">
                            <Card.Content>
                                <View style={styles.cardHeader}>
                                    <View style={styles.dateContainer}>
                                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                                            {new Date(item.appointment_date).toLocaleDateString()}
                                        </Text>
                                        <Text variant="bodySmall" style={{ color: '#666' }}>{item.appointment_time.slice(0, 5)}</Text>
                                    </View>
                                    <Chip compact style={{ backgroundColor: theme.colors.secondaryContainer }}>
                                        Completed
                                    </Chip>
                                </View>

                                <Text variant="bodyMedium" style={{ marginBottom: 4 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Doctor:</Text> {item.doctors?.users?.full_name}
                                </Text>

                                {item.prescriptions && item.prescriptions.length > 0 ? (
                                    <View style={styles.prescriptionContainer}>
                                        <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: 'bold', marginBottom: 4 }}>Prescription:</Text>
                                        {item.prescriptions[0].medicines?.map((med: any, index: number) => (
                                            <Text key={index} variant="bodySmall" style={{ marginLeft: 8 }}>
                                                • {med.name} ({med.dosage})
                                            </Text>
                                        ))}
                                    </View>
                                ) : (
                                    <Text variant="bodySmall" style={{ color: '#888', fontStyle: 'italic', marginTop: 8 }}>No prescription recorded.</Text>
                                )}
                            </Card.Content>
                        </Card>
                    )}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Text variant="bodyLarge" style={{ color: '#888' }}>No medical history found.</Text>
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
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateContainer: {
        flexDirection: 'column',
    },
    prescriptionContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
