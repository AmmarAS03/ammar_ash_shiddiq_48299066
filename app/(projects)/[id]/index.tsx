import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
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
        // Update the navigation title with the project title
        router.setParams({
          title: foundProject.title
        });
      } catch (err) {
        setError('Failed to load project details. Please try again.');
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  // Custom header configuration
  useEffect(() => {
    if (project) {
      router.setParams({
        title: project.title
      });
    }
  }, [project]);

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
        <Pressable 
          className="mt-4"
          onPress={() => router.back()}
        >
          <Text className="text-[#f4511e] text-center">
            Go back to projects
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <ScrollView className="flex-1 bg-gray-100">
        {/* Instructions Card */}
        <View className="bg-white m-4 p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-bold mb-2">Instructions</Text>
          <Text className="text-gray-700 mb-4">
            {project.instructions || 'Follow the clues and scan the QR codes once you get to the building location.'}
          </Text>
          
          <Text className="text-lg font-bold mb-2">Initial Clue</Text>
          <Text className="text-gray-700">
            {project.initial_clue}
          </Text>
        </View>

        {/* Stats Card */}
        <View className="flex-row justify-between mx-4">
          <View className="bg-white p-4 rounded-lg shadow-sm flex-1 mr-2">
            <Text className="text-pink-500 text-2xl font-bold text-center">0</Text>
            <Text className="text-center text-gray-600">Points</Text>
            <Text className="text-center text-gray-600">0/20</Text>
          </View>
          
          <View className="bg-white p-4 rounded-lg shadow-sm flex-1 ml-2">
            <Text className="text-pink-500 text-2xl font-bold text-center">0</Text>
            <Text className="text-center text-gray-600">Locations Visited</Text>
            <Text className="text-center text-gray-600">0/3</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}