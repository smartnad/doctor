import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, Chip, useTheme, Button, IconButton } from 'react-native-paper';

interface DoctorCardProps {
    doctor: any;
    onPress: () => void;
}

export default function DoctorCard({ doctor, onPress }: DoctorCardProps) {
    const theme = useTheme();
    // Handle both flattened and nested structure
    const fullName = doctor.full_name || doctor.users?.full_name || 'Unknown Doctor';
    const avatarUrl = doctor.avatar_url || doctor.users?.avatar_url || 'https://via.placeholder.com/150';
    const specialization = doctor.specialization || 'General Practitioner';
    const rating = doctor.rating || 0;
    const experience = doctor.experience_years || 0;
    const fee = doctor.consultation_fee || 0;

    return (
        <Card style={styles.card} onPress={onPress} mode="elevated">
            <Card.Content style={styles.content}>
                <View style={styles.headerRow}>
                    <View style={styles.avatarContainer}>
                        <Avatar.Image
                            size={70}
                            source={{ uri: avatarUrl }}
                            style={{ backgroundColor: theme.colors.surfaceVariant }}
                        />
                        {rating >= 4.5 && (
                            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                                <IconButton icon="crown" size={12} iconColor="#fff" style={{ margin: 0 }} />
                            </View>
                        )}
                    </View>
                    <View style={styles.info}>
                        <View style={styles.nameRow}>
                            <Text variant="titleMedium" style={styles.name} numberOfLines={1}>{fullName}</Text>
                            <View style={styles.ratingContainer}>
                                <IconButton icon="star" size={14} iconColor="#FFC107" style={{ margin: 0, width: 14, height: 14 }} />
                                <Text variant="labelMedium" style={{ fontWeight: 'bold', marginLeft: 2 }}>{typeof rating === 'number' ? rating.toFixed(1) : rating}</Text>
                            </View>
                        </View>
                        <Chip
                            icon="medical-bag"
                            style={{
                                backgroundColor: theme.colors.secondaryContainer,
                                alignSelf: 'flex-start',
                                height: 24,
                                marginBottom: 4
                            }}
                            textStyle={{ fontSize: 11, color: theme.colors.onSecondaryContainer }}
                            compact
                        >
                            {specialization}
                        </Chip>
                        <View style={styles.experienceRow}>
                            <IconButton icon="briefcase-outline" size={12} iconColor={theme.colors.secondary} style={{ margin: 0 }} />
                            <Text variant="bodySmall" style={{ color: theme.colors.secondary, marginLeft: 2 }}>{experience} years exp.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.footerRow}>
                    <View style={styles.feeContainer}>
                        <Text variant="labelSmall" style={{ color: theme.colors.secondary }}>Consultation Fee</Text>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>₹{fee}</Text>
                    </View>
                    <Button
                        mode="contained"
                        onPress={onPress}
                        style={styles.bookButton}
                        labelStyle={{ fontSize: 13, fontWeight: 'bold' }}
                        icon="calendar-plus"
                        compact
                    >
                        Book Now
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    content: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    info: {
        marginLeft: 16,
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
        flex: 1,
        marginRight: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    experienceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f5f5f5',
        marginVertical: 12,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    feeContainer: {
        flex: 1,
        marginRight: 12,
    },
    bookButton: {
        borderRadius: 20,
        paddingHorizontal: 8,
    },
});
