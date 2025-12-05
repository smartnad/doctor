import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Text, TextInput, SegmentedButtons, useTheme, Surface } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
    const navigation = useNavigation();
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('patient'); // patient or doctor
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !fullName) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        });

        if (error) {
            Alert.alert('Registration Failed', error.message);
        } else {
            Alert.alert('Success', 'Please check your email for verification link.');
            navigation.goBack();
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <View style={styles.header}>
                        <Text variant="displaySmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Join Us</Text>
                        <Text variant="titleMedium" style={{ color: theme.colors.secondary, marginTop: 8 }}>Start your health journey</Text>
                    </View>

                    <Surface style={styles.formCard} elevation={2}>
                        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>Create Account</Text>

                        <TextInput
                            label="Full Name"
                            mode="outlined"
                            value={fullName}
                            onChangeText={setFullName}
                            style={styles.input}
                            outlineColor={theme.colors.outline}
                            activeOutlineColor={theme.colors.primary}
                            left={<TextInput.Icon icon="account" />}
                        />

                        <TextInput
                            label="Email"
                            mode="outlined"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                            outlineColor={theme.colors.outline}
                            activeOutlineColor={theme.colors.primary}
                            left={<TextInput.Icon icon="email" />}
                        />

                        <TextInput
                            label="Password"
                            mode="outlined"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                            outlineColor={theme.colors.outline}
                            activeOutlineColor={theme.colors.primary}
                            left={<TextInput.Icon icon="lock" />}
                        />

                        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>I am a:</Text>
                        <SegmentedButtons
                            value={role}
                            onValueChange={setRole}
                            buttons={[
                                { value: 'patient', label: 'Patient', icon: 'account' },
                                { value: 'doctor', label: 'Doctor', icon: 'doctor' },
                            ]}
                            style={styles.segment}
                            theme={{ colors: { secondaryContainer: theme.colors.primaryContainer, onSecondaryContainer: theme.colors.onPrimaryContainer } }}
                        />

                        <Button
                            mode="contained"
                            onPress={handleRegister}
                            loading={loading}
                            disabled={loading}
                            style={styles.button}
                            contentStyle={{ height: 50 }}
                        >
                            Sign Up
                        </Button>

                        <Button
                            onPress={() => navigation.goBack()}
                            style={styles.linkButton}
                            textColor={theme.colors.primary}
                        >
                            Already have an account? Login
                        </Button>
                    </Surface>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    formCard: {
        padding: 24,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    segment: {
        marginBottom: 24,
    },
    button: {
        marginTop: 8,
        marginBottom: 16,
        borderRadius: 12,
    },
    linkButton: {
        marginTop: 8,
    },
});
