import { Project, ProjectLocation } from '@/types/api';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

interface LocationCoords {
    latitude: number;
    longitude: number;
}

export default function MapScreen() {
    const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
    const [locations, setLocations] = useState<ProjectLocation[]>([]);
    const [unlockedLocations, setUnlockedLocations] = useState<ProjectLocation[]>([]);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useLocalSearchParams();
    const projectId = id ? Number(id) : NaN;
    const username = "s4829906";

    useEffect(() => {
        // Simulate location setup with dummy data
        const setupDummyLocation = async () => {
            try {
                // Brisbane coordinates as dummy location
                const dummyLocation: LocationCoords = {
                    latitude: -27.4705,
                    longitude: 153.0260,
                };

                setUserLocation(dummyLocation);
                setLoading(false);
            } catch (error) {
                console.error('Error setting up dummy location:', error);
                setLoading(false);
            }
        };

        setupDummyLocation();
    }, []);

    useEffect(() => {
      const setupLocation = async () => {
          try {
              const { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                  console.error('Permission to access location was denied');
                  setLoading(false);
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
  
              return () => {
                  subscription.remove();
              };
  
          } catch (error) {
              console.error('Error setting up location:', error);
              setLoading(false);
          }
      };
  
      setupLocation();
  }, []);

    if (loading || !userLocation) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#7862FC" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                <Marker
                    coordinate={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                    }}
                    title="You are here"
                    pinColor="#7862FC"
                />
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
      width: '100%',
      height: '100%',
  },
});