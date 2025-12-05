import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/patient/HomeScreen';
import DoctorDetailsScreen from '../screens/patient/DoctorDetailsScreen';
import BookAppointmentScreen from '../screens/patient/BookAppointmentScreen';
import BookingSuccessScreen from '../screens/patient/BookingSuccessScreen';
import CategoriesScreen from '../screens/patient/CategoriesScreen';

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DoctorList"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DoctorDetails"
                component={DoctorDetailsScreen}
                options={{ title: 'Doctor Details' }}
            />
            <Stack.Screen
                name="BookAppointment"
                component={BookAppointmentScreen}
                options={{ title: 'Book Appointment' }}
            />
            <Stack.Screen
                name="BookingSuccess"
                component={BookingSuccessScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Categories"
                component={CategoriesScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
