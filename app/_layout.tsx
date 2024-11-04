// app/_layout.tsx
import { Drawer } from "expo-router/drawer";
import React, { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/UserStore";
import { View, Text } from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { APIProvider } from "@/context/APIContext";
import "../global.css";

/**
 * Custom drawer content component
 * 
 * Renders a customized drawer with:
 * - User information header (when user is logged in)
 * - Navigation items
 * - Logout button (when user is logged in)
 * 
 * @component
 * @param {CustomDrawerContentProps} props - Drawer content props from react-navigation
 */
function CustomDrawerContent(props: any) {
  const { username } = useUserStore();

  return (
    <View className="flex-1">
      {/* Custom Header - Only shown if username exists */}
      {username && username.trim() !== "" && (
        <View className="bg-[#f4511e] p-4 pb-6">
          <View className="mt-8">
            <Text className="text-white text-base font-medium mb-1">
              Current User:
            </Text>
            <Text className="text-white text-lg">{username}</Text>
          </View>
        </View>
      )}

      {/* Default Drawer Items */}
      <DrawerContentScrollView
        {...props}
        // Add padding top when there's no username to account for safe area
        className={username ? "" : "mt-8"}
      >
        <DrawerItemList {...props} />
        {username && <LogoutButton />}
      </DrawerContentScrollView>
    </View>
  );
}

/**
 * Root layout component for the application
 * 
 * Provides the main navigation structure using expo-router drawer navigation.
 * Includes:
 * - Custom drawer navigation
 * - Screen configurations
 * - API context provider
 * - Font loading handling
 * - Gesture handler root view
 * 
 * @component
 * @example
 * ```tsx
 * // App entry point
 * export default function App() {
 *   return <Layout />;
 * }
 * ```
 */
export default function Layout() {
  const [fontsLoaded] = useFonts({});

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <APIProvider>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Drawer
          screenOptions={{
            headerShown: true,
            drawerType: "front",
            drawerStyle: {
              backgroundColor: "#fff",
              width: "70%",
            },
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            drawerActiveTintColor: "#f4511e",
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="welcome"
            options={{
              title: "Welcome",
              drawerLabel: "Welcome",
              drawerIcon: ({ focused, size, color }) => (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="(projects)"
            options={{
              title: "Projects",
              drawerLabel: "Projects List",
              drawerIcon: ({ focused, size, color }) => (
                <Ionicons
                  name={focused ? "list" : "list-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="profile"
            options={{
              title: "Profile",
              drawerLabel: "Profile",
              drawerIcon: ({ focused, size, color }) => (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="about"
            options={{
              title: "About",
              drawerLabel: "About",
              drawerIcon: ({ focused, size, color }) => (
                <Ionicons
                  name={focused ? "information" : "information-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </APIProvider>
  );
}
