// ... existing code ...
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Switch,
  Alert,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Document placeholder component instead of using an image file
const DocumentPlaceholder = () => (
  <View style={styles.documentPlaceholder}>
    <MaterialIcons name="description" size={80} color="#9e9e9e" />
    <Text style={styles.placeholderText}>Document Preview</Text>
    <Text style={styles.placeholderSubtext}>Scan a document to see it here</Text>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(true);
  const [scanMode, setScanMode] = useState('single'); // 'single' or 'batch'

  const handleScan = () => {
    // In a real implementation, this would open the camera
    navigation.navigate('Scan');
  };

  const navigateToLibrary = () => {
    navigation.navigate('DocumentLibrary');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.title}>SmartScanAI</Text>
        <TouchableOpacity onPress={navigateToLibrary}>
          <MaterialIcons name="library-books" size={28} color="#1E88E5" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.scanContainer}>
        <View style={styles.scanModeContainer}>
          <TouchableOpacity 
            style={[
              styles.scanModeButton, 
              scanMode === 'single' && styles.activeScanMode
            ]}
            onPress={() => setScanMode('single')}
          >
            <MaterialIcons name="filter-1" size={20} color={scanMode === 'single' ? "#1E88E5" : "#666"} />
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
            <MaterialIcons name="filter-none" size={20} color={scanMode === 'batch' ? "#1E88E5" : "#666"} />
            <Text style={[
              styles.scanModeText,
              scanMode === 'batch' && styles.activeScanModeText
            ]}>Multi-Page Batch</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setFlashEnabled(!flashEnabled)}
          >
            <Ionicons 
              name={flashEnabled ? "flash" : "flash-off"} 
              size={24} 
              color="#1E88E5" 
            />
            <Text style={styles.controlText}>Flash</Text>
          </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={handleScan}
        >
          <MaterialIcons name="camera-alt" size={36} color="white" />
        </TouchableOpacity>
        
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setAutoDetectEnabled(!autoDetectEnabled)}
          >
            <MaterialIcons 
              name={autoDetectEnabled ? "crop-free" : "crop"} 
              size={24} 
              color="#1E88E5" 
            />
            <Text style={styles.controlText}>
              {autoDetectEnabled ? "Auto" : "Manual"}
        </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 4,
    marginBottom: 40,
    width: '90%',
    maxWidth: 350,
  },
  scanModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
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
    color: '#1E88E5',
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: 'center',
    padding: 10,
  },
  controlText: {
    marginTop: 8,
    color: '#1E88E5',
    fontSize: 12,
    fontWeight: '500',
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginHorizontal: 30,
  },
});

export default HomeScreen; 