import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import type { BarcodeScanningResult } from "expo-camera";
import { APIClient } from "@/api/client";
import { useUserStore } from "@/store/UserStore";
import { useProjectContext } from "@/context/ProjectContext";
import { useAPI } from '@/context/APIContext';

export default function ScannerScreen() {
  const { apiClient } = useAPI();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const { username } = useUserStore();
  const { triggerRefresh } = useProjectContext();

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const parseQRData = (data: string) => {
    try {
      // Split the data string by commas
      const pairs = data.split(",");
      const parsed: Record<string, number> = {};

      // Parse each key-value pair
      pairs.forEach((pair) => {
        const [key, value] = pair.split(":");
        parsed[key.trim()] = parseInt(value.trim(), 10);
      });

      // Only validate location_id and project_id
      if (!parsed.location_id || !parsed.project_id || 
          isNaN(parsed.location_id) || isNaN(parsed.project_id)) {
        throw new Error("Missing or invalid location_id or project_id");
      }

      return {
        location_id: parsed.location_id,
        project_id: parsed.project_id
      };
    } catch (error) {
      console.error("Error parsing QR code data:", error);
      return null;
    }
  };

  const handleTrackingSubmission = async (qrData: string) => {
    try {
      setLoading(true);
      const parsedData = parseQRData(qrData);

      if (!parsedData) {
        Alert.alert("Error", "Invalid QR code format");
        return;
      }

      // Fetch the location details to get the score_points
      const locations = await apiClient.getProjectLocations(parsedData.project_id);
      const location = locations.find(loc => loc.id === parsedData.location_id);

      if (!location) {
        Alert.alert("Error", "Location not found");
        return;
      }

      const trackingPayload = {
        project_id: parsedData.project_id,
        location_id: parsedData.location_id,
        points: location.score_points, // Use the score_points from the location
        username: "s4829906",
        participant_username: username || "",
      };

      console.log("Sending tracking payload:", trackingPayload);

      await apiClient.trackParticipant(trackingPayload);
      triggerRefresh();
      Alert.alert("Success", "Location tracked successfully!", [
        {
          text: "OK"
        },
      ]);
    } catch (error) {
      console.error("Error submitting tracking:", error);
      Alert.alert("Error", "Failed to track location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (loading) return;

    setScanned(true);
    setScannedData(result.data);
    await handleTrackingSubmission(result.data);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {scanned && (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>
            {loading ? "Processing..." : `Scanned data: ${scannedData}`}
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Scan Again" onPress={() => setScanned(false)} disabled={loading} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  scanResultContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 15,
  },
  scanResultText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
});
