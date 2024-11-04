// app/welcome.tsx   // Make sure this file is in the correct location
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router"; // Use Link instead of useRouter

/**
 * Welcome Screen Component
 *
 * Initial landing screen of the Storypath app that provides:
 * - Engaging hero section with app logo
 * - Introduction to key features
 * - Call-to-action buttons for profile creation and exploration
 * - Visual feature highlights
 *
 * @component
 */
export default function Welcome() {
  const screenHeight = Dimensions.get("window").height;

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Hero Section */}
      <View className="bg-[#f4511e] rounded-b-[40px] shadow-lg pb-8 mb-6">
        <View className="items-center pt-12 pb-6">
          <View className="bg-white rounded-full p-6 shadow-xl mb-4">
            <Ionicons name="map" size={48} color="#f4511e" />
          </View>
          <Text className="text-white text-3xl font-bold mb-2">
            Welcome to Storypath
          </Text>
          <Text className="text-white text-lg opacity-90 text-center px-6">
            Your Adventure Begins Here
          </Text>
        </View>
      </View>

      <View className="px-4">
        <View className="bg-gray-50 rounded-xl p-6 mb-8">
          <Text className="text-gray-800 text-lg text-center leading-6">
            Discover and create amazing location-based adventures. From city
            tours to treasure hunts, the possibilities are endless!
          </Text>
        </View>

        <View className="mb-8">
          <Link href="/profile" asChild>
            <TouchableOpacity className="bg-[#f4511e] p-4 rounded-xl items-center mb-4 shadow-sm flex-row justify-center">
              <Ionicons
                name="person-add-outline"
                size={24}
                color="white"
                className="mr-2"
              />
              <Text className="text-white text-lg font-semibold ml-2">
                Go to Profile
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(projects)" asChild>
            <TouchableOpacity className="p-4 rounded-xl items-center border-2 border-[#f4511e] flex-row justify-center">
              <Ionicons
                name="compass-outline"
                size={24}
                color="#f4511e"
                className="mr-2"
              />
              <Text className="text-[#f4511e] text-lg font-semibold ml-2">
                Explore Projects
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
