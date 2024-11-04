import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Project } from "../types/api";
import { APIClient } from "@/api/client";
import { useAPI } from '@/context/APIContext';

interface ProjectCardProps {
  project: Project;
}

/**
 * ProjectCard component
 * 
 * Displays a card with project information including title, description,
 * scoring method, and participant count. The card is clickable and navigates
 * to the project detail page when pressed.
 * 
 * @component
 * @param {ProjectCardProps} props - Component props
 * 
 * @example
 * ```tsx
 * const project = {
 *   id: 1,
 *   title: "Project Title",
 *   description: "Project Description",
 *   participant_scoring: "individual"
 * };
 * 
 * <ProjectCard project={project} />
 * ```
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const { apiClient } = useAPI();
  const router = useRouter();
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipantCount = async () => {
      try {
        setIsLoading(true);
        const count = await apiClient.getProjectParticipantCount(project.id);
        setParticipantCount(count);
      } catch (error) {
        console.error("Error fetching participant count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipantCount();
  }, [project.id]);
  const handlePress = () => {
    router.push({
      pathname: `/(projects)/[id]`,
      params: {
        id: project.id.toString(),
        title: project.title,
      },
    });
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mx-4 my-2 shadow-md"
      onPress={handlePress}
    >
      <Text className="text-lg font-bold mb-2">{project.title}</Text>
      <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
        {project.description}
      </Text>
      <Text className="text-xs text-gray-500">
        Scoring: {project.participant_scoring}
      </Text>
      <Text className="text-xs text-gray-500">
        {isLoading ? "Loading..." : `${participantCount} participants`}
      </Text>
    </TouchableOpacity>
  );
}
