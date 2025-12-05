import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#0066CC', // Medical Blue
        secondary: '#03DAC6', // Teal
        background: '#F5F7FA', // Light Grey Background
        surface: '#FFFFFF',
        error: '#B00020',
        text: '#000000',
        onSurface: '#000000',
        accent: '#03DAC6',
    },
    roundness: 12, // More rounded corners
};
