import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { APIClient } from "../../../src/api/client";
import { Project, ProjectLocation } from "../../../src/types/api";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/UserStore";
import WebView from "react-native-webview";
import { useProjectContext } from "@/context/ProjectContext";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ4Mjk5MDYifQ.uv2euB3WMOZ18RKDS-ChV3JHQ00mf30Qqd-pREK-xGo";
const apiClient = new APIClient(JWT);

export default function ProjectDetails() {
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [locations, setLocations] = useState<ProjectLocation[]>([]);
  const [totalPossiblePoints, setTotalPossiblePoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { username } = useUserStore();
  const [userPoints, setUserPoints] = useState(0);
  const [visitedLocations, setVisitedLocations] = useState(0);
  const [visitedLocationIds, setVisitedLocationIds] = useState<number[]>([]);
  const { refreshTrigger } = useProjectContext();

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setError(null);

        // Load project
        const projects = await apiClient.getPublishedProjects();
        const foundProject = projects.find((p) => p.id === Number(id));

        if (!foundProject) {
          throw new Error("Project not found");
        }

        setProject(foundProject);

        // Load locations
        const projectLocations = await apiClient.getProjectLocations(
          Number(id)
        );
        setLocations(projectLocations);

        // Calculate total possible points
        const totalPoints = projectLocations.reduce(
          (sum, location) => sum + location.score_points,
          0
        );
        setTotalPossiblePoints(totalPoints);

        // Load user points and visited locations
        const points = await apiClient.getUserProjectPoints(
          Number(id),
          username || ""
        );
        const visitedCount = await apiClient.getUserVisitedLocations(
          Number(id),
          username || ""
        );
        const visitedIds = await apiClient.getUserVisitedLocationIds(
          Number(id),
          username || ""
        );
        setVisitedLocationIds(visitedIds);

        setUserPoints(points);
        setVisitedLocations(visitedCount);

        router.setParams({
          title: foundProject.title,
        });
      } catch (err) {
        setError("Failed to load project details. Please try again.");
        console.error("Error loading project:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [id, refreshTrigger]);

  // Custom header configuration
  useEffect(() => {
    if (project) {
      router.setParams({
        title: project.title,
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
        <Text className="text-red-500 text-center mx-4">
          {error || "Project not found"}
        </Text>
        <Pressable className="mt-4" onPress={() => router.back()}>
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
            {project.instructions ||
              "Follow the clues and scan the QR codes once you get to the building location."}
          </Text>

          <Text className="text-lg font-bold mb-2">Initial Clue</Text>
          <Text className="text-gray-700">{project.initial_clue}</Text>
        </View>

        {/* Stats Card */}
        <View className="flex-row justify-between mx-4">
          <View className="bg-white p-4 rounded-lg shadow-sm flex-1 mr-2">
            <Text className="text-pink-500 text-2xl font-bold text-center">
              {userPoints}
            </Text>
            <Text className="text-center text-gray-600">Points</Text>
            <Text className="text-center text-gray-600">
              {userPoints}/{totalPossiblePoints}
            </Text>
          </View>

          <View className="bg-white p-4 rounded-lg shadow-sm flex-1 ml-2">
            <Text className="text-pink-500 text-2xl font-bold text-center">
              {visitedLocations}
            </Text>
            <Text className="text-center text-gray-600">Locations Visited</Text>
            <Text className="text-center text-gray-600">
              {visitedLocations}/{locations.length}
            </Text>
          </View>
        </View>
        <View className="mx-4 mt-4">
          {locations
            .filter((location) => visitedLocationIds.includes(location.id))
            .map((location, index) => (
              <View
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm mb-4"
              >
                <Text className="text-lg font-bold mb-2">
                  Location {index + 1}: {location.location_name}
                </Text>
                <View className="h-64 bg-white">
                  <WebView
                    source={{ html: location.location_content }}
                    style={{ flex: 1 }}
                    originWhitelist={["*"]}
                    scrollEnabled={true}
                    className="rounded-lg"
                  />
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </>
  );
}
