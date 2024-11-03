import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface LocationCoords {
    latitude: number;
    longitude: number;
}

export default function MapScreen() {
    const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
    const [loading, setLoading] = useState(true);

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