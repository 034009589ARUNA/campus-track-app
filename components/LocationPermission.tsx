import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const LocationPermission = ({ onLocationUpdate }) => {
  const [status, setStatus] = useState(null);
  const [coords, setCoords] = useState(null);

  const requestPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setStatus(status);

    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const coordinates = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    setCoords(coordinates);
    onLocationUpdate && onLocationUpdate(coordinates);
  };

  return (
    <View style={styles.container}>
      <Button title="Allow Location" onPress={requestPermission} />
      {coords && (
        <Text style={styles.text}>
          ✅ Location Set ({coords.latitude.toFixed(3)}, {coords.longitude.toFixed(3)})
        </Text>
      )}
    </View>
  );
};

export default LocationPermission;

const styles = StyleSheet.create({
  container: { marginVertical: 15 },
  text: { marginTop: 10, fontSize: 14, color: '#1B72B5' },
});
