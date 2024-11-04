import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Project } from "../../src/types/api";
import { ProjectCard } from "../../src/components/ProjectCard";
import { useAPI } from "@/context/APIContext";
import { useUserStore } from "@/store/UserStore";
import { NoProfileRedirect } from "@/components/NoProfile";

/**
 * Projects Index Screen Component
 *
 * Displays a list of published projects with:
 * - Pull-to-refresh functionality
 * - Loading states
 * - Error handling
 * - Profile check with redirect
 *
 * Requires user authentication to view projects.
 * Uses APIContext for data fetching and UserStore for auth state.
 *
 * @component
 * @example
 * ```tsx
 * // In your navigation
 * <Stack.Screen name="(projects)" component={Index} />
 * ```
 */
export default function Index() {
  const { apiClient } = useAPI();
  const [projects, setProjects] = useState<Project[]>([]);
  const [participantCounts, setParticipantCounts] = useState<
    Record<number, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { username } = useUserStore();

  /**
   * Fetches published projects from the API
   *
   * Updates the projects state and handles loading/error states.
   * Called on initial load and refresh.
   *
   * @async
   * @function
   */
  const loadProjects = async () => {
    try {
      setError(null);
      const fetchedProjects = await apiClient.getPublishedProjects();
      setProjects(fetchedProjects);
    } catch (err) {
      setError("Failed to load projects. Please try again.");
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /**
   * Handles pull-to-refresh action
   *
   * Triggers project reload and manages refresh state
   *
   * @function
   */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadProjects();
  }, []);

  /**
   * Renders the appropriate content based on current state
   *
   * Handles different render states:
   * - No profile (redirect)
   * - Loading
   * - Error
   * - Project list
   *
   * @function
   * @returns {React.ReactElement} The appropriate UI element based on current state
   */
  const renderContent = () => {
    if (!username) {
      return <NoProfileRedirect />;
    }

    if (loading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f4511e" />
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-center mx-4 my-4">{error}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={projects}
        renderItem={({ item }) => <ProjectCard project={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text>No projects available</Text>
          </View>
        }
      />
    );
  };

  return <View className="flex-1 bg-gray-100">{renderContent()}</View>;
}
