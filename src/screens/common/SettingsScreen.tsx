import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Divider, Button, useTheme, Text } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';

export default function SettingsScreen() {
    const signOut = useAuthStore(state => state.signOut);
    const theme = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>Settings</Text>
            </View>

            <List.Section style={styles.section}>
                <List.Subheader style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Preferences</List.Subheader>
                <List.Item
                    title="Push Notifications"
                    description="Receive updates about appointments"
                    left={props => <List.Icon {...props} icon="bell-outline" color={theme.colors.secondary} />}
                    right={() => <Switch value={notifications} onValueChange={setNotifications} color={theme.colors.primary} />}
                    style={styles.item}
                />
                <Divider style={styles.divider} />
                <List.Item
                    title="Dark Mode"
                    description="Switch to dark theme"
                    left={props => <List.Icon {...props} icon="theme-light-dark" color={theme.colors.secondary} />}
                    right={() => <Switch value={darkMode} onValueChange={setDarkMode} color={theme.colors.primary} />}
                    style={styles.item}
                />
            </List.Section>

            <List.Section style={styles.section}>
                <List.Subheader style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Account</List.Subheader>
                <List.Item
                    title="Change Password"
                    left={props => <List.Icon {...props} icon="lock-outline" color={theme.colors.secondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => { }}
                    style={styles.item}
                />
                <Divider style={styles.divider} />
                <List.Item
                    title="Privacy Policy"
                    left={props => <List.Icon {...props} icon="shield-account-outline" color={theme.colors.secondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => { }}
                    style={styles.item}
                />
                <Divider style={styles.divider} />
                <List.Item
                    title="Help & Support"
                    left={props => <List.Icon {...props} icon="help-circle-outline" color={theme.colors.secondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => { }}
                    style={styles.item}
                />
            </List.Section>

            <View style={styles.footer}>
                <Button
                    mode="outlined"
                    onPress={signOut}
                    textColor={theme.colors.error}
                    style={[styles.logout, { borderColor: theme.colors.error }]}
                    icon="logout"
                >
                    Sign Out
                </Button>
                <Text variant="bodySmall" style={{ textAlign: 'center', marginTop: 16, color: '#888' }}>Version 1.0.0</Text>
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
        paddingBottom: 8,
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 1,
    },
    item: {
        paddingVertical: 8,
    },
    divider: {
        backgroundColor: '#f0f0f0',
    },
    footer: {
        padding: 24,
        marginTop: 8,
        marginBottom: 24,
    },
    logout: {
        borderWidth: 1,
    },
});
