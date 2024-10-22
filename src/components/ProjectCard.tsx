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

  return (
    <TouchableOpacity 
      style={styles.card}
    //   onPress={() => router.push(`/project/${project.id}`)}
    >
      <Text style={styles.title}>{project.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {project.description}
      </Text>
      <Text style={styles.scoring}>
        Scoring: {project.participant_scoring}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  scoring: {
    fontSize: 12,
    color: '#888',
  },
});