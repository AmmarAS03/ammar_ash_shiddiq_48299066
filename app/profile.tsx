// app/profile.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '../src/store/UserStore';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
    const router = useRouter();
    const { username, profileImage, setUsername, setProfileImage } = useUserStore();
    const [inputUsername, setInputUsername] = useState(username || '');

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert(
                'Permission Needed', 
                'Sorry, we need camera roll permissions to upload a profile picture.'
            );
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets[0].uri) {
                setProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const saveProfile = () => {
        if (!inputUsername.trim()) {
            Alert.alert('Error', 'Please enter a username');
            return;
        }
        setUsername(inputUsername.trim());
        Alert.alert('Success', 'Profile updated successfully', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <View className="flex-1 p-5 bg-white">
            <View className="items-center mt-5 mb-8">
                <TouchableOpacity onPress={pickImage} className="relative">
                    {profileImage ? (
                        <Image 
                            source={{ uri: profileImage }} 
                            className="w-[120px] h-[120px] rounded-full"
                        />
                    ) : (
                        <View className="w-[120px] h-[120px] rounded-full bg-gray-100 justify-center items-center border border-gray-300">
                            <Ionicons name="person" size={40} color="#666" />
                        </View>
                    )}
                    <View className="absolute right-0 bottom-0 bg-[#f4511e] w-9 h-9 rounded-full justify-center items-center border-2 border-white">
                        <Ionicons name="camera" size={20} color="white" />
                    </View>
                </TouchableOpacity>
            </View>

            <View className="mb-5">
                <Text className="text-base text-gray-700 mb-2 font-medium">
                    Username
                </Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50"
                    value={inputUsername}
                    onChangeText={setInputUsername}
                    placeholder="Enter your username"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <TouchableOpacity 
                className="bg-[#f4511e] p-4 rounded-lg items-center my-2.5"
                onPress={saveProfile}
            >
                <Text className="text-white text-base font-semibold">
                    Save Profile
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                className="p-4 rounded-lg items-center border border-[#f4511e]"
                onPress={() => router.back()}
            >
                <Text className="text-[#f4511e] text-base font-semibold">
                    Cancel
                </Text>
            </TouchableOpacity>
        </View>
    );
}