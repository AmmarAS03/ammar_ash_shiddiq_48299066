import { Project, ProjectLocation } from "@/types/api";
import { useLocalSearchParams, useRouter  } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { useUserStore } from "@/store/UserStore";
import { useProjectContext } from "@/context/ProjectContext";
import { useAPI } from '@/context/APIContext';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const { apiClient } = useAPI();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [locations, setLocations] = useState<ProjectLocation[]>([]);
  const [unlockedLocations, setUnlockedLocations] = useState<ProjectLocation[]>(
    []
  );
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useProjectContext();

  const { id } = useLocalSearchParams();
  const projectId = id ? Number(id) : NaN;
  const { username } = useUserStore();
  useEffect(() => {
    if (!username) {
      router.push("/profile");
      return;
    }
  }, [username]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([setupLocation(), fetchProjectData()]);
      } catch (error) {
        console.error("Error initializing data:", error);
        setError("Failed to initialize map data");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [projectId, refreshTrigger]);

  const setupLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission is required");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const initialLocation: LocationCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(initialLocation);

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (newLocation) => {
          setUserLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });
        }
      );

      return () => subscription.remove();
    } catch (error) {
      console.error("Error setting up location:", error);
      setError("Failed to get location");
    }
  };

  const fetchProjectData = async () => {
    try {
      // Get project details
      const projects = await apiClient.getPublishedProjects();
      const foundProject = projects.find((p) => p.id === projectId);
      if (!foundProject) throw new Error("Project not found");
      setProject(foundProject);

      // Get project locations
      const projectLocations = await apiClient.getProjectLocations(projectId);
      setLocations(projectLocations);

      // Get unlocked locations
      const visitedLocationIds = await apiClient.getUserVisitedLocationIds(
        projectId,
        username
      );
      const unlockedLocs = projectLocations.filter((loc) =>
        visitedLocationIds.includes(loc.id)
      );
      setUnlockedLocations(unlockedLocs);
    } catch (error) {
      console.error("Error fetching project data:", error);
      setError("Failed to load project data");
    }
  };

  const shouldDisplayAllLocations = () => {
    return project?.homescreen_display === "Display all locations";
  };

  const getVisibleLocations = () => {
    if (shouldDisplayAllLocations()) {
      return locations;
    }
    return unlockedLocations;
  };

  if (loading || !userLocation) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7862FC" />
      </View>
    );
  }

  // if (error) {
  //     return (
  //         <View style={styles.container}>
  //             <Text style={{ color: 'red' }}>{error}</Text>
  //         </View>
  //     );
  // }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {getVisibleLocations().map((location) => {
          // Parse location coordinates from string "(lat,lng)"
          const [lat, lng] = location.location_position
            .replace(/[()]/g, "")
            .split(",")
            .map((coord) => parseFloat(coord.trim()));

          if (isNaN(lat) || isNaN(lng)) {
            console.error(`Invalid coordinates for location ${location.id}`);
            return null;
          }

          const isUnlocked = unlockedLocations.some(
            (loc) => loc.id === location.id
          );

          return (
            <React.Fragment key={location.id}>
              <Marker
                coordinate={{ latitude: lat, longitude: lng }}
                title={location.location_name}
                pinColor={isUnlocked ? "green" : "red"}
              />
              {(isUnlocked || shouldDisplayAllLocations()) && (
                <Circle
                  center={{ latitude: lat, longitude: lng }}
                  radius={200} // 200 meters radius
                  strokeColor="rgba(0, 150, 136, 0.5)"
                  fillColor="rgba(0, 150, 136, 0.2)"
                />
              )}
            </React.Fragment>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
