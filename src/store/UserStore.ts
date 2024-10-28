// src/store/UserStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface UserState {
    username: string | null;
    profileImage: string | null;
    isLoggedIn: boolean;
    setUsername: (username: string) => void;
    setProfileImage: (image: string) => void;
    logout: () => Promise<void>;
    clearStorage: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            username: null,
            profileImage: null,
            isLoggedIn: false,
            setUsername: (username) => set({ username, isLoggedIn: true }),
            setProfileImage: (profileImage) => set({ profileImage }),
            logout: async () => {
                try {
                    await AsyncStorage.clear();
                    set({
                        username: null,
                        profileImage: null,
                        isLoggedIn: false
                    });
                } catch (error) {
                    console.error('Logout error:', error);
                    Alert.alert('Error', 'Failed to logout. Please try again.');
                }
            },
            clearStorage: async () => {
                try {
                    const keys = ['user-storage'];
                    await AsyncStorage.multiRemove(keys);
                    set({
                        username: null,
                        profileImage: null,
                        isLoggedIn: false
                    });
                } catch (error) {
                    console.error('Storage cleanup error:', error);
                    Alert.alert('Error', 'Failed to clear storage. Please try again.');
                }
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                console.log('Storage rehydrated');
            },
        }
    )
);


export const cleanupStorage = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const obsoleteKeys = keys.filter(key => 
            key.startsWith('user-storage') && key !== 'user-storage'
        );
        if (obsoleteKeys.length > 0) {
            await AsyncStorage.multiRemove(obsoleteKeys);
            console.log('Cleaned up obsolete storage keys');
        }
    } catch (error) {
        console.error('Cleanup error:', error);
    }
};