import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Searchbar, ActivityIndicator, Chip, useTheme, Surface, IconButton } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import DoctorCard from '../../components/DoctorCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const CATEGORIES = ['All', 'Cardiologist', 'Dentist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Orthopedic'];

import { useAuthStore } from '../../store/authStore';
import { mockDoctors } from '../../data/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const theme = useTheme();
    const user = useAuthStore(state => state.user);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Handle category selection from CategoriesScreen
    useEffect(() => {
        if (route.params?.selectedCategory) {
            setSelectedCategory(route.params.selectedCategory);
            // Clear params to avoid resetting on every render/focus if needed, 
            // but for simple stack navigation this is fine.
            navigation.setParams({ selectedCategory: undefined });
        }
    }, [route.params?.selectedCategory]);

    const fetchDoctors = async () => {
        setLoading(true);

        if (user?.id?.startsWith('demo-')) {
            // Simulate network delay
            setTimeout(() => {
                const formattedDoctors = mockDoctors.map((doc: any) => ({
                    ...doc,
                    full_name: doc.users?.full_name || 'Unknown Doctor',
                    avatar_url: doc.users?.avatar_url,
                }));
                setDoctors(formattedDoctors);
                setFilteredDoctors(formattedDoctors);
                setLoading(false);
            }, 800);
            return;
        }

        const { data, error } = await supabase
            .from('doctors')
            .select(`
        *,
        users (
          full_name,
          avatar_url
        )
      `);

        if (error) {
            console.error(error);
        } else {
            const formattedDoctors = data.map((doc: any) => ({
                ...doc,
                full_name: doc.users?.full_name || 'Unknown Doctor',
                avatar_url: doc.users?.avatar_url,
            }));
            setDoctors(formattedDoctors);
            setFilteredDoctors(formattedDoctors);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        let result = doctors;

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(doc =>
                doc.full_name?.toLowerCase().includes(query) ||
                doc.specialization?.toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            result = result.filter(doc => doc.specialization === selectedCategory);
        }

        setFilteredDoctors(result);
    }, [searchQuery, selectedCategory, doctors]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDoctors();
        setRefreshing(false);
    };

    const handleCategoryPress = (cat: string) => {
        setSelectedCategory(cat);
        if (cat === 'All') {
            setSearchQuery('');
        }
    };

    const renderHeader = () => (
        <View>
            {/* Hero Banner */}
            <View style={styles.bannerContainer}>
                <Surface style={[styles.banner, { backgroundColor: theme.colors.primaryContainer }]} elevation={2}>
                    <View style={styles.bannerContent}>
                        <View style={{ flex: 1 }}>
                            <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onPrimaryContainer, marginBottom: 4 }}>
                                Find Your Specialist
                            </Text>
                            <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.8 }}>
                                Top doctors are ready to help you.
                            </Text>
                            <TouchableOpacity style={[styles.bannerButton, { backgroundColor: theme.colors.primary }]} onPress={() => { }}>
                                <Text style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>Book Now</Text>
                            </TouchableOpacity>
                        </View>
                        <IconButton icon="doctor" size={60} iconColor={theme.colors.primary} style={{ margin: 0 }} />
                    </View>
                </Surface>
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Specialties</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>See All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
                    {CATEGORIES.map((cat, index) => (
                        <Animated.View key={cat} entering={FadeInRight.delay(index * 100).springify()}>
                            <TouchableOpacity onPress={() => handleCategoryPress(cat)}>
                                <Chip
                                    selected={selectedCategory === cat}
                                    style={[
                                        styles.chip,
                                        selectedCategory === cat
                                            ? { backgroundColor: theme.colors.primary }
                                            : { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: '#e0e0e0' }
                                    ]}
                                    textStyle={[
                                        styles.chipText,
                                        selectedCategory === cat ? { color: theme.colors.onPrimary } : { color: theme.colors.onSurface }
                                    ]}
                                    showSelectedOverlay
                                    mode="flat"
                                >
                                    {cat}
                                </Chip>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </ScrollView>
            </View>

            {/* Top Doctors Header */}
            <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Top Doctors</Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.headerContainer, { backgroundColor: theme.colors.primary }]}>
                <View style={styles.headerContent}>
                    <View>
                        <Text variant="bodyLarge" style={{ color: theme.colors.onPrimary, opacity: 0.9 }}>Welcome Back,</Text>
                        <Text variant="headlineMedium" style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>
                            {user?.user_metadata?.full_name || 'Patient'}
                        </Text>
                    </View>
                    <IconButton icon="bell-outline" iconColor={theme.colors.onPrimary} size={24} onPress={() => { }} />
                </View>

                <Searchbar
                    placeholder="Search doctor, specialty..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor={theme.colors.primary}
                    placeholderTextColor={theme.colors.secondary}
                    elevation={4}
                />
            </View>

            {loading && !refreshing ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredDoctors}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 100).springify().damping(12)}>
                            <DoctorCard
                                doctor={item}
                                onPress={() => navigation.navigate('DoctorDetails', { doctor: item })}
                            />
                        </Animated.View>
                    )}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Text variant="bodyLarge" style={{ color: theme.colors.secondary }}>No doctors found.</Text>
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
    headerContainer: {
        padding: 24,
        paddingTop: 60,
        paddingBottom: 32,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 8,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    searchBar: {
        borderRadius: 16,
        backgroundColor: '#fff',
        height: 56,
    },
    searchInput: {
        alignSelf: 'center',
    },
    bannerContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    banner: {
        borderRadius: 20,
        padding: 20,
        overflow: 'hidden',
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bannerButton: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignSelf: 'flex-start',
        elevation: 2,
    },
    categoriesContainer: {
        paddingVertical: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 12,
    },
    categoriesList: {
        paddingHorizontal: 16,
    },
    chip: {
        marginRight: 10,
        borderRadius: 24,
        height: 36,
    },
    chipText: {
        fontWeight: '600',
        fontSize: 13,
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
