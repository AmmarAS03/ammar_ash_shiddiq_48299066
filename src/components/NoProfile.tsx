import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export const NoProfileRedirect = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50 p-6">
      {/* Icon */}
      <View className="mb-6">
        <Ionicons name="person-circle-outline" size={80} color="#f4511e" />
      </View>

      {/* Message */}
      <View className="bg-white p-6 rounded-xl shadow-sm w-full max-w-sm">
        <Text className="text-xl font-bold text-center text-gray-800 mb-2">
          Profile Required
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Please set up your profile to view and participate in projects.
        </Text>
      </View>
    </View>
  );
};