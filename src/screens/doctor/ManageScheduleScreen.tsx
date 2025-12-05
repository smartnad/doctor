import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, TextInput, Switch, useTheme, Surface } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { mockAvailability } from '../../data/mockData';

export default function ManageScheduleScreen() {
    const user = useAuthStore(state => state.user);
    const theme = useTheme();
    const [availability, setAvailability] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        fetchAvailability();
    }, [user]);

    const fetchAvailability = async () => {
        if (!user) return;

        if (user.id.startsWith('demo-')) {
            // Mock availability for demo
            // If mockAvailability is empty, initialize it
            if (mockAvailability.length === 0) {
                const initial = days.map((day, index) => ({
                    day_of_week: index,
                    start_time: '09:00',
                    end_time: '17:00',
                    enabled: index > 0 && index < 6, // Mon-Fri
                }));
                mockAvailability.push(...initial);
            }

            setAvailability([...mockAvailability]);
            return;
        }

        const { data, error } = await supabase
            .from('doctor_availability')
            .select('*')
            .eq('doctor_id', user.id);

        if (error) {
            console.error(error);
        } else {
            // Map existing availability or create default
            const mapped = days.map((day, index) => {
                const existing = data.find((d: any) => d.day_of_week === index);
                return existing || {
                    day_of_week: index,
                    start_time: '09:00',
                    end_time: '17:00',
                    enabled: !!existing,
                };
            });
            setAvailability(mapped);
        }
    };

    const handleSave = async (dayIndex: number, start: string, end: string, enabled: boolean) => {
        if (!user) return;
        setLoading(true);

        if (user.id.startsWith('demo-')) {
            // Simulate save for demo
            setTimeout(() => {
                const targetIndex = mockAvailability.findIndex(a => a.day_of_week === dayIndex);
                if (targetIndex !== -1) {
                    mockAvailability[targetIndex] = { ...mockAvailability[targetIndex], start_time: start, end_time: end, enabled };
                }
                setAvailability([...mockAvailability]);
                setLoading(false);
            }, 300);
            return;
        }

        if (enabled) {
            const { error } = await supabase
                .from('doctor_availability')
                .upsert({
                    doctor_id: user.id,
                    day_of_week: dayIndex,
                    start_time: start,
                    end_time: end,
                }, { onConflict: 'doctor_id, day_of_week' });

            if (error) Alert.alert('Error', error.message);
        } else {
            const { error } = await supabase
                .from('doctor_availability')
                .delete()
                .eq('doctor_id', user.id)
                .eq('day_of_week', dayIndex);

            if (error) Alert.alert('Error', error.message);
        }

        fetchAvailability();
        setLoading(false);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>Manage Schedule</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.secondary, marginTop: 4 }}>Set your weekly availability</Text>
            </View>

            <View style={styles.list}>
                {availability.map((item, index) => (
                    <Surface key={index} style={styles.card} elevation={1}>
                        <View style={styles.row}>
                            <Text variant="titleMedium" style={[styles.day, { color: item.enabled ? theme.colors.primary : '#888' }]}>
                                {days[index]}
                            </Text>
                            <Switch
                                value={item.enabled}
                                onValueChange={(val) => handleSave(index, item.start_time, item.end_time, val)}
                                color={theme.colors.primary}
                            />
                        </View>
                        {item.enabled && (
                            <View style={styles.timeRow}>
                                <TextInput
                                    label="Start"
                                    value={item.start_time}
                                    style={styles.input}
                                    mode="outlined"
                                    dense
                                    onChangeText={(text) => {
                                        const newAvail = [...availability];
                                        newAvail[index].start_time = text;
                                        setAvailability(newAvail);
                                    }}
                                    onBlur={() => handleSave(index, item.start_time, item.end_time, true)}
                                    right={<TextInput.Icon icon="clock-outline" />}
                                />
                                <Text style={{ alignSelf: 'center', marginHorizontal: 8 }}>to</Text>
                                <TextInput
                                    label="End"
                                    value={item.end_time}
                                    style={styles.input}
                                    mode="outlined"
                                    dense
                                    onChangeText={(text) => {
                                        const newAvail = [...availability];
                                        newAvail[index].end_time = text;
                                        setAvailability(newAvail);
                                    }}
                                    onBlur={() => handleSave(index, item.start_time, item.end_time, true)}
                                    right={<TextInput.Icon icon="clock-outline" />}
                                />
                            </View>
                        )}
                    </Surface>
                ))}
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
    },
    list: {
        padding: 16,
        paddingTop: 0,
    },
    card: {
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    day: {
        fontWeight: 'bold',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
