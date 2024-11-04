// app/index.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet,
  RefreshControl 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Project } from '../../src/types/api';
import { ProjectCard } from '../../src/components/ProjectCard';
import { useAPI } from '@/context/APIContext';

export default function Index() {
  const { apiClient } = useAPI();
  const [projects, setProjects] = useState<Project[]>([]);
  const [participantCounts, setParticipantCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadProjects = async () => {
    try {
      setError(null);
      const fetchedProjects = await apiClient.getPublishedProjects();
      setProjects(fetchedProjects);
    } catch (err) {
      setError('Failed to load projects. Please try again.');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadProjects();
  }, []);

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
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={projects}
        renderItem={({ item }) => <ProjectCard project={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text>No projects available</Text>
          </View>
        }
      />
    </View>
  );
}