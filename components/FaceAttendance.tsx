// src/components/FaceAttendance.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FaceAttendanceProps {
  onFaceDetected?: () => void;
  onFaceDetectionFailed?: () => void;
}

const FaceAttendance: React.FC<FaceAttendanceProps> = ({
  onFaceDetected,
  onFaceDetectionFailed,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (permission?.granted) {
      // Start face detection when permission is granted
      startFaceDetection();
    }
  }, [permission]);

  const startFaceDetection = () => {
    // Simulate face detection (in production, use actual face detection library)
    // For now, we'll use a simple approach where user needs to look at camera
    const interval = setInterval(() => {
      setCaptureCount((prev) => prev + 1);
      // Simulate face detection after 2 seconds
      if (captureCount >= 3) {
        clearInterval(interval);
        handleFaceDetected();
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const handleFaceDetected = () => {
    setFaceDetected(true);
    setIsProcessing(false);
    if (onFaceDetected) {
      onFaceDetected();
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);

    try {
      // Simulate face detection delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For now, assume face is detected (in production, use actual face detection)
      // You would integrate MediaPipe Face Detection here
      const faceDetected = Math.random() > 0.3; // Simulate 70% success rate

      if (faceDetected) {
        handleFaceDetected();
      } else {
        setIsProcessing(false);
        if (onFaceDetectionFailed) {
          onFaceDetectionFailed();
        }
      }
    } catch (error) {
      console.error('Face detection error:', error);
      setIsProcessing(false);
      if (onFaceDetectionFailed) {
        onFaceDetectionFailed();
      }
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1B72B5" />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons name="camera-off" size={64} color="#999" />
        <Text style={styles.text}>Camera permission is required for face verification</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (faceDetected) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <MaterialCommunityIcons name="check-circle" size={80} color="#4CAF50" />
        <Text style={styles.successText}>Face Verified ✓</Text>
        <Text style={styles.subtext}>You can now mark attendance</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={CameraType.front}
        onCameraReady={() => {
          // Camera is ready
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.faceFrame}>
            <Text style={styles.instruction}>Position your face within the frame</Text>
          </View>
          {isProcessing && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.processingText}>Detecting face...</Text>
            </View>
          )}
        </View>
      </CameraView>
      <TouchableOpacity
        style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
        onPress={handleCapture}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <MaterialCommunityIcons name="camera" size={32} color="#fff" />
        )}
      </TouchableOpacity>
      <Text style={styles.hint}>Tap the camera button to verify your face</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    width: '100%',
    height: '70%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  faceFrame: {
    width: 250,
    height: 300,
    borderWidth: 3,
    borderColor: '#1B72B5',
    borderRadius: 20,
    borderStyle: 'dashed',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    alignItems: 'center',
  },
  instruction: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  processingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1B72B5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  hint: {
    color: '#fff',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  successContainer: {
    backgroundColor: '#E8F5E9',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 20,
  },
  subtext: {
    fontSize: 14,
    color: '#558B2F',
    marginTop: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#1B72B5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FaceAttendance;
