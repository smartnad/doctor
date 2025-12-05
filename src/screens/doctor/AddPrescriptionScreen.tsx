import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton, Card, useTheme, Surface } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';
import { mockAppointments } from '../../data/mockData';

export default function AddPrescriptionScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { appointmentId, patientName } = route.params as { appointmentId: string, patientName: string };
    const theme = useTheme();
    const user = useAuthStore(state => state.user);

    const [medicines, setMedicines] = useState<{ name: string; dosage: string; frequency: string; duration: string }[]>([
        { name: '', dosage: '', frequency: '', duration: '' }
    ]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const removeMedicine = (index: number) => {
        const newMedicines = [...medicines];
        newMedicines.splice(index, 1);
        setMedicines(newMedicines);
    };

    const updateMedicine = (index: number, field: string, value: string) => {
        const newMedicines = [...medicines];
        newMedicines[index] = { ...newMedicines[index], [field]: value };
        setMedicines(newMedicines);
    };

    const handleSubmit = async () => {
        if (medicines.some(m => !m.name)) {
            Alert.alert('Error', 'Please fill in the medicine name for all entries.');
            return;
        }

        setLoading(true);

        if (user?.id?.startsWith('demo-')) {
            // Simulate success for demo user
            setTimeout(() => {
                const apptIndex = mockAppointments.findIndex(a => a.id === appointmentId);
                if (apptIndex !== -1) {
                    // Update status
                    mockAppointments[apptIndex].status = 'completed';
                    // Add mock prescription
                    (mockAppointments[apptIndex] as any).prescriptions = [{
                        medicines: medicines,
                        instructions: notes,
                        created_at: new Date().toISOString()
                    }];
                }

                Alert.alert('Success', 'Prescription added successfully! (Demo Mode)');
                navigation.goBack();
                setLoading(false);
            }, 1000);
            return;
        }

        // 1. Create Prescription Record
        const { data: prescriptionData, error: prescriptionError } = await supabase
            .from('prescriptions')
            .insert({
                appointment_id: appointmentId,
                medicines: medicines, // Storing as JSONB
                instructions: notes,
            })
            .select()
            .single();

        if (prescriptionError) {
            Alert.alert('Error', prescriptionError.message);
            setLoading(false);
            return;
        }

        // 2. Update Appointment Status to Completed
        const { error: updateError } = await supabase
            .from('appointments')
            .update({ status: 'completed' })
            .eq('id', appointmentId);

        if (updateError) {
            Alert.alert('Error', 'Prescription saved but failed to update appointment status.');
        } else {
            Alert.alert('Success', 'Prescription added successfully!');
            navigation.goBack();
        }
        setLoading(false);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Surface style={styles.header} elevation={0}>
                <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.primary }]}>Prescription</Text>
                <Text variant="titleMedium" style={{ color: theme.colors.secondary, marginBottom: 8 }}>Patient: {patientName}</Text>
            </Surface>

            <View style={styles.content}>
                {medicines.map((med, index) => (
                    <Animated.View
                        key={index}
                        entering={FadeInDown.delay(index * 100).springify()}
                        layout={Layout.springify()}
                    >
                        <Card style={styles.card} mode="elevated">
                            <Card.Content>
                                <View style={styles.rowHeader}>
                                    <View style={styles.medicineBadge}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{index + 1}</Text>
                                    </View>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold', flex: 1, marginLeft: 12 }}>Medicine Details</Text>
                                    {medicines.length > 1 && (
                                        <IconButton icon="delete-outline" iconColor={theme.colors.error} onPress={() => removeMedicine(index)} />
                                    )}
                                </View>
                                <TextInput
                                    label="Medicine Name"
                                    value={med.name}
                                    onChangeText={(text) => updateMedicine(index, 'name', text)}
                                    style={styles.input}
                                    mode="outlined"
                                    outlineColor={theme.colors.outline}
                                    activeOutlineColor={theme.colors.primary}
                                    placeholder="e.g. Paracetamol"
                                />
                                <View style={styles.row}>
                                    <TextInput
                                        label="Dosage"
                                        value={med.dosage}
                                        onChangeText={(text) => updateMedicine(index, 'dosage', text)}
                                        style={[styles.input, { flex: 1, marginRight: 8 }]}
                                        mode="outlined"
                                        outlineColor={theme.colors.outline}
                                        activeOutlineColor={theme.colors.primary}
                                        placeholder="500mg"
                                    />
                                    <TextInput
                                        label="Frequency"
                                        value={med.frequency}
                                        onChangeText={(text) => updateMedicine(index, 'frequency', text)}
                                        style={[styles.input, { flex: 1 }]}
                                        mode="outlined"
                                        outlineColor={theme.colors.outline}
                                        activeOutlineColor={theme.colors.primary}
                                        placeholder="1-0-1"
                                    />
                                </View>
                                <TextInput
                                    label="Duration"
                                    value={med.duration}
                                    onChangeText={(text) => updateMedicine(index, 'duration', text)}
                                    style={styles.input}
                                    mode="outlined"
                                    outlineColor={theme.colors.outline}
                                    activeOutlineColor={theme.colors.primary}
                                    placeholder="5 days"
                                />
                            </Card.Content>
                        </Card>
                    </Animated.View>
                ))}

                <Button
                    mode="outlined"
                    onPress={addMedicine}
                    style={[styles.addButton, { borderColor: theme.colors.primary }]}
                    textColor={theme.colors.primary}
                    icon="plus"
                    contentStyle={{ height: 48 }}
                >
                    Add Another Medicine
                </Button>

                <Card style={styles.card} mode="elevated">
                    <Card.Content>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 12 }}>Additional Notes</Text>
                        <TextInput
                            label="Instructions"
                            value={notes}
                            onChangeText={setNotes}
                            style={styles.notesInput}
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            outlineColor={theme.colors.outline}
                            activeOutlineColor={theme.colors.primary}
                            placeholder="Take after food..."
                        />
                    </Card.Content>
                </Card>

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loading}
                    style={styles.submitButton}
                    contentStyle={{ height: 56 }}
                    labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                >
                    Save & Complete
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        paddingBottom: 16,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    content: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
    },
    rowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    medicineBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#0066CC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
    },
    addButton: {
        marginBottom: 24,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 12,
    },
    notesInput: {
        backgroundColor: '#fff',
    },
    submitButton: {
        marginBottom: 40,
        borderRadius: 16,
        elevation: 4,
    },
});
