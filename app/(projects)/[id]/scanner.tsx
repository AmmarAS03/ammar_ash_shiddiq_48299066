import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import type { BarcodeScanningResult } from "expo-camera";

export default function ScannerScreen() {
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [permission, requestPermission] = useCameraPermissions();

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
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    setScanned(true);
    setScannedData(result.data);
    console.log("Type: " + result.type);
    console.log("Data: " + result.data);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      {scanned && (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>Scanned data: {scannedData}</Text>
          <View style={styles.buttonContainer}>
            <Button 
              title="Scan Again" 
              onPress={() => setScanned(false)} 
            />
            <Button 
              title="Go to Map" 
              onPress={() => router.push('/map')}
            />
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