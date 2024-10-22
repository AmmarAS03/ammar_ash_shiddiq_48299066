// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    // Add any custom fonts here if needed
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerType: 'front',
          drawerStyle: {
            backgroundColor: '#fff',
            width: '70%',
          },
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerActiveTintColor: '#f4511e',
        }}
      >
        <Drawer.Screen 
          name="index"
          options={{
            title: 'Projects',
            drawerLabel: 'Projects List',
            drawerIcon: ({ focused, size, color }) => (
              <Ionicons 
                name={focused ? 'list' : 'list-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen 
          name="profile"
          options={{
            title: 'Profile',
            drawerLabel: 'Profile',
            drawerIcon: ({ focused, size, color }) => (
              <Ionicons 
                name={focused ? 'person' : 'person-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}