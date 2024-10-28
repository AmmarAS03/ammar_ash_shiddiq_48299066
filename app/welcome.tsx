// app/profile.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useUserStore } from "../src/store/UserStore";
import { Ionicons } from "@expo/vector-icons";

export default function Welcome() {
  const router = useRouter();
  const { username, profileImage, setUsername, setProfileImage } =
    useUserStore();
  const [inputUsername, setInputUsername] = useState(username || "");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Needed",
        "Sorry, we need camera roll permissions to upload a profile picture."
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
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const saveProfile = () => {
    if (!inputUsername.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }
    setUsername(inputUsername.trim());
    Alert.alert("Success", "Profile updated successfully", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <View className="items-center mt-5 mb-8">
        <Text className="text-[#f4511e] text-2xl font-bold">Welcome to Storypath</Text>
      </View>

      <View className="bg-gray-200 mb-5 rounded-xl p-3">
        <Text className="text-center text-md">
          With Storypath, you can discover and create amazing locaiton-based
          adventures. From city tours to treasure hunts, the possibilities are
          endless!
        </Text>
      </View>

      <TouchableOpacity
        className="bg-[#f4511e] p-4 rounded-lg items-center my-2.5"
      >
        <Text className="text-white text-base font-semibold">
          Create Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="p-4 rounded-lg items-center border border-[#f4511e]"
      >
        <Text className="text-[#f4511e] text-base font-semibold">
          Explore Projects
        </Text>
      </TouchableOpacity>
    </View>
  );
}
