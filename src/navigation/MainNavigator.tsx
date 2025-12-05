import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import HomeNavigator from './HomeNavigator';
import DoctorDashboardScreen from '../screens/doctor/DoctorDashboardScreen';
import MyAppointmentsScreen from '../screens/patient/MyAppointmentsScreen';
import ManageScheduleScreen from '../screens/doctor/ManageScheduleScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import SettingsScreen from '../screens/common/SettingsScreen';
import AddPrescriptionScreen from '../screens/doctor/AddPrescriptionScreen';
import PrescriptionDetailsScreen from '../screens/patient/PrescriptionDetailsScreen';
import PatientHistoryScreen from '../screens/doctor/PatientHistoryScreen';
import { useAuthStore } from '../store/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
    const theme = useTheme();
    const profile = useAuthStore(state => state.profile);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: 'gray',
            }}
        >
            {profile?.role === 'patient' && (
                <>
                    <Tab.Screen
                        name="HomeTab"
                        component={HomeNavigator}
                        options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="home" color={color} size={size} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Appointments"
                        component={MyAppointmentsScreen}
                        options={{
                            tabBarLabel: 'Appointments',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="calendar" color={color} size={size} />
                            ),
                        }}
                    />
                </>
            )}

            {profile?.role === 'doctor' && (
                <>
                    <Tab.Screen
                        name="Doctor"
                        component={DoctorDashboardScreen}
                        options={{
                            tabBarLabel: 'Dashboard',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Schedule"
                        component={ManageScheduleScreen}
                        options={{
                            tabBarLabel: 'Schedule',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="clock-outline" color={color} size={size} />
                            ),
                        }}
                    />
                </>
            )}
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cog" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="AddPrescription" component={AddPrescriptionScreen} options={{ presentation: 'modal', headerShown: true, title: 'Add Prescription' }} />
            <Stack.Screen name="PrescriptionDetails" component={PrescriptionDetailsScreen} options={{ presentation: 'modal', headerShown: true, title: 'Prescription Details' }} />
            <Stack.Screen name="PatientHistory" component={PatientHistoryScreen} options={{ title: 'Patient History', headerShown: true }} />
        </Stack.Navigator>
    );
}
