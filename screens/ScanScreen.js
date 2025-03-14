import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  StatusBar,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

// Document placeholder component instead of using an image file
const DocumentPlaceholder = () => (
  <View style={styles.documentPlaceholder}>
    <MaterialIcons name="description" size={80} color="#9e9e9e" />
    <Text style={styles.placeholderText}>Document Preview</Text>
    <Text style={styles.placeholderSubtext}>Position document to scan</Text>
  </View>
);

const ScanScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(true);
  const [scanMode, setScanMode] = useState('single'); // 'single' or 'batch'
  const [scanning, setScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  
  const cameraRef = useRef(null);
  
  const takePicture = async () => {
    if (cameraRef.current) {
      setScanning(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        
        setCapturedImage(photo);
        setScanning(false);
        
        // Process the image (in a real app, you'd do document edge detection here)
        setTimeout(() => {
          // Navigate to document detail with the captured image
          navigation.navigate('DocumentDetail', { 
            newScan: true,
            imageUri: photo.uri
          });
        }, 500);
      } catch (error) {
        console.error("Error taking picture:", error);
        setScanning(false);
        Alert.alert("Error", "Failed to capture image. Please try again.");
      }
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  // Handle camera permission
  if (!permission) {
    // Camera permissions are still loading
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color="#2D5F7C" />
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <MaterialIcons name="no-photography" size={60} color="#FF6B6B" />
          <Text style={styles.permissionText}>Camera access is required to scan documents.</Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.permissionButton, {marginTop: 10, backgroundColor: '#ccc'}]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.permissionButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan Document</Text>
        <View style={{width: 24}} />
      </View>
      
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          enableTorch={flashEnabled}
        >
          {scanning && (
            <View style={styles.scanningOverlay}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.scanningText}>Processing...</Text>
            </View>
          )}
        </CameraView>
        
        <View style={styles.overlayControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setFlashEnabled(!flashEnabled)}
          >
            <Ionicons 
              name={flashEnabled ? "flash" : "flash-off"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setAutoDetectEnabled(!autoDetectEnabled)}
          >
            <MaterialIcons 
              name={autoDetectEnabled ? "crop-free" : "crop"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.controlsContainer}>
        <View style={styles.scanModeContainer}>
          <TouchableOpacity 
            style={[
              styles.scanModeButton, 
              scanMode === 'single' && styles.activeScanMode
            ]}
            onPress={() => setScanMode('single')}
          >
            <MaterialIcons name="filter-1" size={20} color={scanMode === 'single' ? "#2D5F7C" : "#666"} />
            <Text style={[
              styles.scanModeText,
              scanMode === 'single' && styles.activeScanModeText
            ]}>Single Page</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.scanModeButton, 
              scanMode === 'batch' && styles.activeScanMode
            ]}
            onPress={() => setScanMode('batch')}
          >
            <MaterialIcons name="filter-none" size={20} color={scanMode === 'batch' ? "#2D5F7C" : "#666"} />
            <Text style={[
              styles.scanModeText,
              scanMode === 'batch' && styles.activeScanModeText
            ]}>Multi-Page Batch</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={takePicture}
          disabled={scanning}
        >
          <MaterialIcons name="camera-alt" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  permissionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#2D5F7C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: 'white',
    fontSize: 18,
    marginTop: 16,
  },
  overlayControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  controlsContainer: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
  },
  scanModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 4,
    marginBottom: 16,
    width: '100%',
  },
  scanModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeScanMode: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  scanModeText: {
    marginLeft: 8,
    color: '#666',
    fontWeight: '500',
  },
  activeScanModeText: {
    color: '#2D5F7C',
    fontWeight: '600',
  },
  scanButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2D5F7C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default ScanScreen;