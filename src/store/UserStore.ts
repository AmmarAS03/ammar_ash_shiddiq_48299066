import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
/**
 * Interface defining the structure and actions available in the UserStore
 * 
 * @interface UserState
 * @property {string | null} username - Current username of the logged-in user
 * @property {string | null} profileImage - URL or path to the user's profile image
 * @property {boolean} isLoggedIn - Flag indicating whether a user is currently logged in
 */
interface UserState {
    username: string | null;
    profileImage: string | null;
    isLoggedIn: boolean;
    setUsername: (username: string) => void;
    setProfileImage: (image: string) => void;
    logout: () => Promise<void>;
    clearStorage: () => Promise<void>;
}

/**
 * Custom hook for managing user state with persistence
 * 
 * Uses Zustand for state management and AsyncStorage for persistence.
 * Handles user authentication state, profile information, and storage cleanup.
 * 
 * @example
 * ```tsx
 * const { username, isLoggedIn, setUsername } = useUserStore();
 * 
 * // Set username
 * setUsername('ammar');
 * 
 * // Check login status
 * console.log(isLoggedIn); // true
 * ```
 */
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

/**
 * Utility function to clean up obsolete storage keys
 * 
 * Removes any storage keys that start with 'user-storage' except for
 * the main 'user-storage' key. This helps prevent storage bloat from
 * old or unused storage entries.
 * 
 * @async
 * @returns {Promise<void>}
 * 
 * @example
 * ```tsx
 * await cleanupStorage();
 * ```
 */
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