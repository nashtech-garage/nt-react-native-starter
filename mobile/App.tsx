import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from './src/screens/signin-screen';
import { AuthProvider } from './src/contexts/auth-context';
import MainNavigator from './src/screens/navigator/main-navigator';
import { Provider } from 'react-redux';
import store from './src/stores/store';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{ title: 'ReactNativeStater' }}
        />
        {/* <Stack.Screen
          name="Demo"
          component={DemoUseContext}
          options={{ title: 'Demo Screen' }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default App;
