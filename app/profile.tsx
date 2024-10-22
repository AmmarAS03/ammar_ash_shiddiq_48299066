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
        // Request permission
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
        <View style={styles.container}>
            <View style={styles.profileImageContainer}>
                <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                    {profileImage ? (
                        <Image 
                            source={{ uri: profileImage }} 
                            style={styles.profileImage}
                        />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Ionicons name="person" size={40} color="#666" />
                        </View>
                    )}
                    <View style={styles.editBadge}>
                        <Ionicons name="camera" size={20} color="white" />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={inputUsername}
                    onChangeText={setInputUsername}
                    placeholder="Enter your username"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <TouchableOpacity 
                style={styles.saveButton} 
                onPress={saveProfile}
            >
                <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => router.back()}
            >
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    imagePickerButton: {
        position: 'relative',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    editBadge: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#f4511e',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    saveButton: {
        backgroundColor: '#f4511e',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f4511e',
    },
    cancelButtonText: {
        color: '#f4511e',
        fontSize: 16,
        fontWeight: '600',
    },
});