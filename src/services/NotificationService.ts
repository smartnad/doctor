import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'web') {
        console.log('Push notifications are not supported on web in this demo.');
        return;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }

        // Get the token
        try {
            token = (await Notifications.getExpoPushTokenAsync({
                projectId: 'your-project-id', // You should replace this with your actual project ID if you have one, or remove it if using bare workflow/development build
            })).data;
            console.log('Expo Push Token:', token);
        } catch (e) {
            console.error('Error fetching push token', e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

export async function savePushToken(userId: string, token: string) {
    if (!userId || !token) return;

    const { error } = await supabase
        .from('users')
        .update({ push_token: token })
        .eq('id', userId);

    if (error) {
        console.error('Error saving push token:', error);
    }
}
