import { create } from 'zustand';

interface UserState {
    username: string | null;
    profileImage: string | null;
    setUsername: (username: string) => void;
    setProfileImage: (image: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    username: null,
    profileImage: null,
    setUsername: (username) => set({ username }),
    setProfileImage: (profileImage) => set({ profileImage }),
}));