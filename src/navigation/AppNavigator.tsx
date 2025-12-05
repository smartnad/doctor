import React, { useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator } from 'react-native';
import { registerForPushNotificationsAsync, savePushToken } from '../services/NotificationService';
import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { session, user, isLoading, checkSession } = useAuthStore();
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (user) {
            registerForPushNotificationsAsync().then(token => {
                if (token) {
                    savePushToken(user.id, token);
                }
            });
        }
    }, [user]);

    useEffect(() => {
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification Received:', notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification Response:', response);
        });

        return () => {
            notificationListener.current && notificationListener.current.remove();
            responseListener.current && responseListener.current.remove();
        };
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {session ? (
                <Stack.Screen name="Main" component={MainNavigator} />
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
}
