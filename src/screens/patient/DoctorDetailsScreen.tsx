import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Avatar, Card, Paragraph, Chip, useTheme, Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DoctorDetailsScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { doctor } = route.params;
    const theme = useTheme();

    // Ensure we handle both flat and nested structures if necessary, though HomeScreen flattens it.
    const fullName = doctor.full_name || doctor.users?.full_name;
    const avatarUrl = doctor.avatar_url || doctor.users?.avatar_url || 'https://via.placeholder.com/150';

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Avatar.Image
                    size={120}
                    source={{ uri: avatarUrl }}
                    style={{ backgroundColor: theme.colors.surface }}
                />
                <Text variant="headlineMedium" style={[styles.name, { color: theme.colors.onSurface }]}>{fullName}</Text>
                <Text variant="titleMedium" style={{ color: theme.colors.primary }}>{doctor.specialization}</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{doctor.experience_years}+</Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>Years Exp.</Text>
                    </View>
                    <Divider style={{ width: 1, height: '100%', backgroundColor: '#ddd' }} />
                    <View style={styles.statItem}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{doctor.rating?.toFixed(1) || 'N/A'}</Text>
                            <Text variant="bodySmall" style={{ marginLeft: 2 }}>⭐</Text>
                        </View>
                        <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>Rating</Text>
                    </View>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <Card style={styles.card} mode="elevated">
                    <Card.Title title="About Doctor" titleStyle={{ fontWeight: 'bold', color: theme.colors.primary }} />
                    <Card.Content>
                        <Paragraph style={{ lineHeight: 24, color: '#555' }}>{doctor.bio || 'No biography available for this doctor.'}</Paragraph>
                    </Card.Content>
                </Card>

                <Card style={styles.card} mode="elevated">
                    <Card.Title title="Clinic Information" titleStyle={{ fontWeight: 'bold', color: theme.colors.primary }} />
                    <Card.Content>
                        <View style={styles.infoRow}>
                            <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>Address:</Text>
                            <Text variant="bodyMedium" style={{ flex: 1, marginLeft: 8 }}>{doctor.clinic_address || 'Address not provided.'}</Text>
                        </View>
                        <Divider style={{ marginVertical: 12 }} />
                        <View style={styles.infoRow}>
                            <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>Consultation Fee:</Text>
                            <Text variant="titleMedium" style={{ color: theme.colors.primary, marginLeft: 8, fontWeight: 'bold' }}>${doctor.consultation_fee}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    style={styles.bookButton}
                    contentStyle={{ height: 56 }}
                    labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                    onPress={() => navigation.navigate('BookAppointment', { doctor })}
                >
                    Book Appointment
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
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    name: {
        marginTop: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 24,
        paddingHorizontal: 20,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    contentContainer: {
        paddingHorizontal: 16,
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    footer: {
        padding: 16,
        paddingBottom: 32,
    },
    bookButton: {
        borderRadius: 12,
        elevation: 4,
    },
});
