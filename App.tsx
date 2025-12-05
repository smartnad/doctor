import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider
        theme={theme}
        settings={{
          icon: props => <MaterialCommunityIcons {...props} />,
        }}
      >
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
