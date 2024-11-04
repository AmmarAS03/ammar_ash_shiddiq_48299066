// src/components/ProjectCard.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Project } from "../types/api";
import { APIClient } from "@/api/client";

interface ProjectCardProps {
  project: Project;
}

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ4Mjk5MDYifQ.uv2euB3WMOZ18RKDS-ChV3JHQ00mf30Qqd-pREK-xGo";
const apiClient = new APIClient(JWT);

export function ProjectCard({ project }: ProjectCardProps) {
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
