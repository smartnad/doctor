import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, Surface, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function BookingSuccessScreen() {
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(1, { damping: 10 });
    }, []);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <Surface style={styles.card} elevation={4}>
                <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                    <MaterialCommunityIcons name="check-circle" size={100} color={theme.colors.primary} />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>Booking Confirmed!</Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(500).springify()}>
                    <Text variant="bodyLarge" style={styles.message}>
                        Your appointment has been successfully booked. We have sent a confirmation to your email.
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('Home')}
                        style={styles.button}
                        contentStyle={{ height: 56 }}
                        labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                    >
                        Go to Home
                    </Button>

                    <Button
                        mode="text"
                        onPress={() => navigation.navigate('MyAppointments')}
                        style={{ marginTop: 16 }}
                    >
                        View My Appointments
                    </Button>
                </Animated.View>
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        padding: 32,
        borderRadius: 30,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 32,
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        borderRadius: 16,
    },
});
