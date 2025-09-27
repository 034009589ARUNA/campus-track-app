import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LocationPermission = () => {
  const [status, setStatus] = useState(null);

  const requestPermission = async () => {
    // Ask for permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    setStatus(status);

    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    // If granted, get current location
    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    alert(`Location: ${location.coords.latitude}, ${location.coords.longitude}`);
  };

  return (
    <View style={styles.container}>
      <Button title="Allow Location" onPress={requestPermission} />
      {status && <Text style={styles.text}>Permission: {status}</Text>}
   
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Mark Present</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1B72B5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 50,
    elevation: 3, // shadow for Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LocationPermission;

