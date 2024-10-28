// app/(projects)/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { APIClient } from '../../../src/api/client';
import { Project } from '../../../src/types/api';
import { Ionicons } from "@expo/vector-icons";

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ4Mjk5MDYifQ.uv2euB3WMOZ18RKDS-ChV3JHQ00mf30Qqd-pREK-xGo";
const apiClient = new APIClient(JWT);

export default function ProjectDetails() {
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setError(null);
        const projects = await apiClient.getPublishedProjects();
        const foundProject = projects.find(p => p.id === Number(id));
        
        if (!foundProject) {
          throw new Error('Project not found');
        }
        
        setProject(foundProject);
      } catch (err) {
        setError('Failed to load project details. Please try again.');
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  if (error || !project) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-center mx-4">{error || 'Project not found'}</Text>
        <View className="mt-4">
          <Text 
            className="text-f4511e text-center"
            onPress={() => router.back()}
          >
            Go back to projects
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-white m-4 p-4 rounded-lg shadow-sm">
        {/* Project Title */}
        <Text className="text-2xl font-bold mb-4">{project.title}</Text>

        {/* Project Description */}
        <View className="mb-4">
          <Text className="text-gray-700">{project.description}</Text>
        </View>

        {/* Project Status */}
        <View className="flex-row items-center mb-4">
          <Ionicons 
            name="checkmark-circle" 
            size={20} 
            color="#4CAF50" 
          />
          <Text className="ml-2 text-gray-600">Published</Text>
        </View>

        {/* Project Dates */}
        <View className="mt-4 pt-4 border-t border-gray-200">
          <Text className="text-gray-600">
            Initial Clue: {project.initial_clue}
          </Text>
          {project.instructions && (
            <Text className="text-gray-600 mt-1">
              instructions: {project.instructions}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}