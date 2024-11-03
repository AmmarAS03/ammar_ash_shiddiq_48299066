import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

export default function ProjectTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f4511e',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
        },
        headerShown: false, // Hide the tab header since we already have the stack header
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Project Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'qr-code' : 'qr-code-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}