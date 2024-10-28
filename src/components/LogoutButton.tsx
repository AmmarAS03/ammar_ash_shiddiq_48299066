// src/components/LogoutButton.tsx
import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/UserStore';
import { Ionicons } from '@expo/vector-icons';

export function LogoutButton() {
    const router = useRouter();
    const logout = useUserStore(state => state.logout);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/welcome'); // Navigate to welcome screen
                    }
                }
            ]
        );
    };

    return (
        <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center px-4 py-3"
        >
            <Ionicons name="log-out-outline" size={24} color="#f4511e" />
            <Text className="ml-4 text-[#f4511e] font-medium">Logout</Text>
        </TouchableOpacity>
    );
}