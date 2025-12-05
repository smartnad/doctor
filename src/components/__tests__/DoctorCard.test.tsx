import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DoctorCard from '../DoctorCard';
import { Provider as PaperProvider } from 'react-native-paper';

const mockDoctor = {
    id: '1',
    users: {
        full_name: 'Dr. John Doe',
        avatar_url: 'https://example.com/avatar.jpg',
    },
    specialization: 'Cardiologist',
    rating: 4.5,
    experience_years: 10,
};

const renderWithTheme = (component: React.ReactNode) => {
    return render(<PaperProvider>{component}</PaperProvider>);
};

describe('DoctorCard', () => {
    it('renders doctor information correctly', () => {
        const onPressMock = jest.fn();
        const { getByText } = renderWithTheme(
            <DoctorCard doctor={mockDoctor} onPress={onPressMock} />
        );

        expect(getByText('Dr. John Doe')).toBeTruthy();
        expect(getByText('Cardiologist')).toBeTruthy();
        expect(getByText('4.5')).toBeTruthy();
        expect(getByText('10 yrs exp')).toBeTruthy();
    });

    it('calls onPress when clicked', () => {
        const onPressMock = jest.fn();
        const { getByText } = renderWithTheme(
            <DoctorCard doctor={mockDoctor} onPress={onPressMock} />
        );

        fireEvent.press(getByText('Dr. John Doe'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });
});
