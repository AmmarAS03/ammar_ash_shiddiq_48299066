// src/components/ProjectCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Project } from '../types/api';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const handlePress = () => {
    router.push(`/(projects)/${project.id}`);
  };

  return (
    <TouchableOpacity 
      className="bg-white rounded-lg p-4 mx-4 my-2 shadow-md"
      onPress={handlePress}
    >
      <Text className="text-lg font-bold mb-2">
        {project.title}
      </Text>
      <Text 
        className="text-sm text-gray-600 mb-2"
        numberOfLines={2}
      >
        {project.description}
      </Text>
      <Text className="text-xs text-gray-500">
        Scoring: {project.participant_scoring}
      </Text>
    </TouchableOpacity>
  );
}