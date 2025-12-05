import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Divider, ActivityIndicator, useTheme, Avatar } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { useRoute } from '@react-navigation/native';

export default function PrescriptionDetailsScreen() {
    const route = useRoute();
    const { appointmentId } = route.params as { appointmentId: string };
    const theme = useTheme();
    const [prescription, setPrescription] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrescription = async () => {
            const { data, error } = await supabase
                .from('prescriptions')
                .select('*')
                .eq('appointment_id', appointmentId)
                .single();

            if (error) {
                console.error(error);
            } else {
                setPrescription(data);
            }
            setLoading(false);
        };

        fetchPrescription();
    }, [appointmentId]);

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!prescription) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <Text variant="bodyLarge" style={{ color: theme.colors.secondary }}>No prescription found for this appointment.</Text>
            </View>
        );
    }

    const medicines = prescription.medicines || [];

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Card style={styles.card} mode="elevated">
                <Card.Title
                    title="Prescription Details"
                    titleStyle={{ fontWeight: 'bold', fontSize: 20, color: theme.colors.primary }}
                    left={(props) => <Avatar.Icon {...props} icon="pill" style={{ backgroundColor: theme.colors.secondaryContainer }} color={theme.colors.onSecondaryContainer} />}
                />
                <Card.Content>
                    <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>Medicines</Text>
                    {medicines.map((med: any, index: number) => (
                        <View key={index} style={styles.medicineItem}>
                            <View style={styles.medHeader}>
                                <Text style={styles.medName}>{index + 1}. {med.name}</Text>
                                <Text style={[styles.medDuration, { color: theme.colors.secondary }]}>{med.duration}</Text>
                            </View>
                            <Text style={styles.medDetails}>
                                {med.dosage} • {med.frequency}
                            </Text>
                            {index < medicines.length - 1 && <Divider style={styles.divider} />}
                        </View>
                    ))}

                    <Divider style={{ marginVertical: 16, height: 1, backgroundColor: '#ddd' }} />

                    <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>Instructions</Text>
                    <Text style={styles.instructions}>{prescription.instructions || 'No specific instructions provided.'}</Text>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
    },
    sectionTitle: {
        marginTop: 16,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    medicineItem: {
        marginBottom: 12,
    },
    medHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    medName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    medDuration: {
        fontWeight: 'bold',
    },
    medDetails: {
        color: '#666',
        marginLeft: 16,
    },
    divider: {
        marginTop: 12,
        backgroundColor: '#f0f0f0',
    },
    instructions: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
        fontStyle: 'italic',
    },
});
