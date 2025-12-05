import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Avatar, ActivityIndicator, useTheme, IconButton, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
    const { user, profile, setSession } = useAuthStore();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    // Form state
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // Patient specific
    const [bloodGroup, setBloodGroup] = useState('');
    const [allergies, setAllergies] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');

    // Doctor specific
    const [specialization, setSpecialization] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [experience, setExperience] = useState('');
    const [fee, setFee] = useState('');
    const [bio, setBio] = useState('');
    const [clinicAddress, setClinicAddress] = useState('');

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setPhone(profile.phone || '');
            setAvatarUrl(profile.avatar_url || '');
            fetchRoleSpecificData();
        }
    }, [profile]);

    const fetchRoleSpecificData = async () => {
        if (!user || !profile) return;

        if (profile.role === 'patient') {
            const { data } = await supabase.from('patients').select('*').eq('id', user.id).single();
            if (data) {
                setBloodGroup(data.blood_group || '');
                setAllergies(data.allergies || '');
                setMedicalHistory(data.medical_history || '');
            }
        } else if (profile.role === 'doctor') {
            const { data } = await supabase.from('doctors').select('*').eq('id', user.id).single();
            if (data) {
                setSpecialization(data.specialization || '');
                setQualifications(data.qualifications || '');
                setExperience(data.experience_years?.toString() || '');
                setFee(data.consultation_fee?.toString() || '');
                setBio(data.bio || '');
                setClinicAddress(data.clinic_address || '');
            }
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            // In a real app, upload to Supabase Storage here
            Alert.alert('Info', 'Image selection successful. Upload logic requires Supabase Storage setup.');
            // setAvatarUrl(result.assets[0].uri); 
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);

        // Update public.users
        const { error: userError } = await supabase
            .from('users')
            .update({
                full_name: fullName,
                phone: phone,
                // avatar_url: avatarUrl,
            })
            .eq('id', user.id);

        if (userError) {
            Alert.alert('Error', userError.message);
            setLoading(false);
            return;
        }

        // Update role specific table
        let roleError = null;
        if (profile?.role === 'patient') {
            const { error } = await supabase
                .from('patients')
                .upsert({
                    id: user.id,
                    blood_group: bloodGroup,
                    allergies: allergies,
                    medical_history: medicalHistory,
                });
            roleError = error;
        } else if (profile?.role === 'doctor') {
            const { error } = await supabase
                .from('doctors')
                .upsert({
                    id: user.id,
                    specialization: specialization,
                    qualifications: qualifications,
                    experience_years: parseInt(experience) || 0,
                    consultation_fee: parseFloat(fee) || 0,
                    bio: bio,
                    clinic_address: clinicAddress,
                });
            roleError = error;
        }

        if (roleError) {
            Alert.alert('Error', roleError.message);
        } else {
            Alert.alert('Success', 'Profile updated successfully');
            setEditing(false);
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        {avatarUrl ? (
                            <Avatar.Image size={110} source={{ uri: avatarUrl }} />
                        ) : (
                            <Avatar.Text
                                size={110}
                                label={fullName.substring(0, 2).toUpperCase()}
                                style={{ backgroundColor: theme.colors.primaryContainer }}
                                color={theme.colors.onPrimaryContainer}
                            />
                        )}
                        {editing && (
                            <TouchableOpacity style={[styles.editBadge, { backgroundColor: theme.colors.primary }]} onPress={pickImage}>
                                <IconButton icon="camera" iconColor="#fff" size={20} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.onSurface }]}>{fullName}</Text>
                    <Text variant="bodyLarge" style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>{profile?.role?.toUpperCase()}</Text>
                </View>

                <View style={[styles.form, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.sectionHeader}>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Personal Information</Text>
                        <Button
                            mode={editing ? "contained-tonal" : "contained"}
                            onPress={() => setEditing(!editing)}
                            compact
                        >
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </View>

                    <TextInput
                        label="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        disabled={!editing}
                        style={styles.input}
                        mode="outlined"
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                        left={<TextInput.Icon icon="account" />}
                    />
                    <TextInput
                        label="Phone"
                        value={phone}
                        onChangeText={setPhone}
                        disabled={!editing}
                        style={styles.input}
                        mode="outlined"
                        keyboardType="phone-pad"
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                        left={<TextInput.Icon icon="phone" />}
                    />

                    {profile?.role === 'patient' && (
                        <>
                            <Divider style={styles.divider} />
                            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>Medical Details</Text>
                            <TextInput
                                label="Blood Group"
                                value={bloodGroup}
                                onChangeText={setBloodGroup}
                                disabled={!editing}
                                style={styles.input}
                                mode="outlined"
                                outlineColor={theme.colors.outline}
                                activeOutlineColor={theme.colors.primary}
                                left={<TextInput.Icon icon="water" />}
                            />
                            <TextInput
                                label="Allergies"
                                value={allergies}
                                onChangeText={setAllergies}
                                disabled={!editing}
                                style={styles.input}
                                mode="outlined"
                                multiline
                                outlineColor={theme.colors.outline}
                                activeOutlineColor={theme.colors.primary}
                                left={<TextInput.Icon icon="alert-circle" />}
                            />
                            <TextInput
                                label="Medical History"
                                value={medicalHistory}
                                onChangeText={setMedicalHistory}
                                disabled={!editing}
                                style={styles.input}
                                mode="outlined"
                                multiline
                                outlineColor={theme.colors.outline}
                                activeOutlineColor={theme.colors.primary}
                                left={<TextInput.Icon icon="history" />}
                            />
                        </>
                    )}

                    {profile?.role === 'doctor' && (
                        <>
                            <Divider style={styles.divider} />
                            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>Professional Details</Text>
                            <TextInput
                                label="Specialization"
                                value={specialization}
                                onChangeText={setSpecialization}
                                disabled={!editing}
                                style={styles.input}
                                mode="outlined"
                                outlineColor={theme.colors.outline}
                                activeOutlineColor={theme.colors.primary}
                                left={<TextInput.Icon icon="doctor" />}
                            />
                            <TextInput
                                label="Qualifications"
                                value={qualifications}
                                onChangeText={setQualifications}
                                disabled={!editing}
                                style={styles.input}
                                mode="outlined"
                                outlineColor={theme.colors.outline}
                                activeOutlineColor={theme.colors.primary}
                                left={<TextInput.Icon icon="school" />}
                            />
                            <View style={styles.row}>
                                <TextInput
                                    label="Experience (Yrs)"
                                    value={experience}
                                    onChangeText={setExperience}
                                    disabled={!editing}
                                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    outlineColor={theme.colors.outline}
                                    activeOutlineColor={theme.colors.primary}
                                />
                                <TextInput
                                    label="Fee ($)"
                                    value={fee}
                                    onChangeText={setFee}
                                    disabled={!editing}
                                    style={[styles.input, { flex: 1 }]}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    outlineColor={theme.colors.outline}
                                    activeOutlineColor={theme.colors.primary}
                                    left={<TextInput.Icon icon="cash" />}
                                />
                            </View>
                            <TextInput
                                label="Bio"
                                value={bio}
                                onChangeText={setBio}
                                disabled={!editing}
                                style={styles.input}
                                mode="outlined"
                                multiline
                                outlineColor={theme.colors.outline}
                                activeOutlineColor={theme.colors.primary}
                                left={<TextInput.Icon icon="text" />}
                            />
                            <TextInput
                                label="Clinic Address"
                                value={clinicAddress}
                                onChangeText={setClinicAddress}
                                disabled={!editing}
                                style={styles.input}
                                mode="outlined"
                                multiline
                                outlineColor={theme.colors.outline}
                                activeOutlineColor={theme.colors.primary}
                                left={<TextInput.Icon icon="map-marker" />}
                            />
                        </>
                    )}

                    {editing && (
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            loading={loading}
                            style={styles.saveButton}
                            contentStyle={{ height: 50 }}
                        >
                            Save Changes
                        </Button>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 32,
        paddingBottom: 40,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
        zIndex: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    name: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    form: {
        flex: 1,
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -20,
        paddingTop: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        marginTop: 8,
        marginBottom: 16,
        fontWeight: 'bold',
    },
    divider: {
        marginVertical: 20,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
    },
    saveButton: {
        marginTop: 20,
        marginBottom: 40,
        borderRadius: 12,
    },
});
