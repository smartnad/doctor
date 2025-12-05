import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const CATEGORIES = [
    { name: 'Cardiologist', icon: 'heart-pulse' },
    { name: 'Dentist', icon: 'tooth' },
    { name: 'Dermatologist', icon: 'skin-milky' }, // custom icon mapping might be needed
    { name: 'Pediatrician', icon: 'baby-face-outline' },
    { name: 'Neurologist', icon: 'brain' },
    { name: 'Orthopedic', icon: 'bone' },
    { name: 'General', icon: 'doctor' },
    { name: 'Eye Specialist', icon: 'eye' },
];

export default function CategoriesScreen() {
    const navigation = useNavigation<any>();
    const theme = useTheme();

    const handleCategoryPress = (category: string) => {
        // Navigate back to Home with the selected category
        navigation.navigate('DoctorList', { selectedCategory: category });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginLeft: 8 }}>All Specialties</Text>
            </View>

            <ScrollView contentContainerStyle={styles.grid}>
                {CATEGORIES.map((cat, index) => (
                    <TouchableOpacity key={index} style={styles.gridItem} onPress={() => handleCategoryPress(cat.name)}>
                        <Card style={styles.card} mode="elevated">
                            <Card.Content style={styles.cardContent}>
                                <Avatar.Icon
                                    size={50}
                                    icon={cat.icon}
                                    style={{ backgroundColor: theme.colors.secondaryContainer }}
                                    color={theme.colors.onSecondaryContainer}
                                />
                                <Text variant="bodyMedium" style={styles.categoryName}>{cat.name}</Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 48,
        backgroundColor: '#fff',
        elevation: 2,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: 16,
    },
    card: {
        borderRadius: 16,
        backgroundColor: '#fff',
    },
    cardContent: {
        alignItems: 'center',
        padding: 16,
    },
    categoryName: {
        marginTop: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
