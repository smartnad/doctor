import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Card, Chip, useTheme, Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function BookAppointmentScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { doctor } = route.params;
    const user = useAuthStore(state => state.user);
    const theme = useTheme();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Mock slots for now - in real app, fetch from doctor_availability and appointments
    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];
    const dates = [0, 1, 2, 3, 4].map(d => {
        const date = new Date();
        date.setDate(date.getDate() + d);
        return date;
    });

    const handleBook = async () => {
        if (!selectedDate || !selectedTime) {
            Alert.alert('Error', 'Please select date and time');
            return;
        }

        setLoading(true);
        const appointmentDate = selectedDate.toISOString().split('T')[0];

        const { error } = await supabase
            .from('appointments')
            .insert({
                doctor_id: doctor.id,
                patient_id: user?.id,
                appointment_date: appointmentDate,
                appointment_time: selectedTime,
                status: 'pending',
            });

        if (error) {
            Alert.alert('Booking Failed', error.message);
        } else {
            // Alert.alert('Success', 'Appointment booked successfully!');
            navigation.navigate('BookingSuccess');
        }
        setLoading(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>Book Appointment</Text>
                    <Text variant="bodyLarge" style={{ color: theme.colors.secondary, marginTop: 4 }}>with {doctor.full_name}</Text>
                </View>

                <Card style={styles.card} mode="elevated">
                    <Card.Title title="Select Date" titleStyle={{ fontWeight: 'bold', color: theme.colors.primary }} />
                    <Card.Content>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
                            {dates.map((date, index) => {
                                const isSelected = selectedDate?.toDateString() === date.toDateString();
                                return (
                                    <Chip
                                        key={index}
                                        selected={isSelected}
                                        onPress={() => setSelectedDate(date)}
                                        style={[
                                            styles.chip,
                                            isSelected && { backgroundColor: theme.colors.primary }
                                        ]}
                                        textStyle={isSelected ? { color: '#fff' } : {}}
                                        showSelectedOverlay
                                    >
                                        {date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                                    </Chip>
                                );
                            })}
                        </ScrollView>
                    </Card.Content>
                </Card>

                <Card style={styles.card} mode="elevated">
                    <Card.Title title="Select Time" titleStyle={{ fontWeight: 'bold', color: theme.colors.primary }} />
                    <Card.Content>
                        <View style={styles.gridContainer}>
                            {timeSlots.map((time, index) => {
                                const isSelected = selectedTime === time;
                                return (
                                    <Chip
                                        key={index}
                                        selected={isSelected}
                                        onPress={() => setSelectedTime(time)}
                                        style={[
                                            styles.timeChip,
                                            isSelected && { backgroundColor: theme.colors.primary }
                                        ]}
                                        textStyle={isSelected ? { color: '#fff' } : {}}
                                        showSelectedOverlay
                                    >
                                        {time}
                                    </Chip>
                                );
                            })}
                        </View>
                    </Card.Content>
                </Card>

                <View style={styles.summaryContainer}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>Booking Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text>Date:</Text>
                        <Text style={{ fontWeight: 'bold' }}>{selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>Time:</Text>
                        <Text style={{ fontWeight: 'bold' }}>{selectedTime || 'Not selected'}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>Consultation Fee:</Text>
                        <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>${doctor.consultation_fee}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
                <Button
                    mode="contained"
                    onPress={handleBook}
                    loading={loading}
                    disabled={loading || !selectedDate || !selectedTime}
                    style={styles.button}
                    contentStyle={{ height: 56 }}
                    labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                >
                    Confirm Booking
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100, // Space for footer
    },
    header: {
        padding: 24,
        paddingBottom: 12,
        backgroundColor: '#fff',
    },
    card: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
    },
    chipsContainer: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    chip: {
        marginRight: 8,
        backgroundColor: '#f0f0f0',
    },
    timeChip: {
        margin: 4,
        backgroundColor: '#f0f0f0',
        minWidth: 80,
        justifyContent: 'center',
    },
    summaryContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        elevation: 1,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 10,
    },
    button: {
        borderRadius: 12,
        elevation: 4,
    },
});
