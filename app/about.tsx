import React from 'react';
import { View, Text } from 'react-native';

/**
 * About Screen Component
 * 
 * Displays information about the Storypath application,
 * including its purpose, course context, and development details.
 * 
 * @component
 * @example
 * ```tsx
 * <Stack.Screen name="about" component={About} />
 * ```
 */
 export default function About() {
  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View className="bg-[#f4511e] p-8 rounded-b-3xl shadow-md">
        <Text className="text-3xl font-bold text-white text-center mb-2">
          Storypath
        </Text>
        <Text className="text-white text-center text-base opacity-90">
          Location-Based Adventure Platform
        </Text>
      </View>

      {/* Main Content */}
      <View className="p-6 mt-4">
        <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            About the Project
          </Text>
          <Text className="text-gray-600 text-base leading-6 mb-4">
            Storypath is a location-based adventure platform developed as part of the
            COMP2140 course at The University of Queensland. It enables users to
            discover and participate in interactive, location-based experiences.
          </Text>
        </View>

        {/* Features Section */}
        <View className="bg-gray-50 rounded-xl p-6 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Key Features
          </Text>
          <View className="space-y-2">
            <Text className="text-gray-600 flex-row items-center">
              • QR Code Integration
            </Text>
            <Text className="text-gray-600 flex-row items-center">
              • Real-time Location Tracking
            </Text>
            <Text className="text-gray-600 flex-row items-center">
              • Interactive Maps
            </Text>
            <Text className="text-gray-600 flex-row items-center">
              • Point-based Rewards
            </Text>
          </View>
        </View>

        {/* Course Info */}
        <View className="bg-gray-50 rounded-xl p-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Course Details
          </Text>
          <Text className="text-gray-600 text-base">
            COMP2140: Design Computing Studio 2 - Information
          </Text>
          <Text className="text-gray-500 text-sm mt-2">
            The University of Queensland
          </Text>
        </View>
      </View>
    </View>
  );
}