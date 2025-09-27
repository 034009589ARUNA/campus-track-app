import { MaterialIcons } from "@expo/vector-icons"; // icon set
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UploadWork() {
  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type === "success") {
        console.log("File selected:", result.uri);
        Alert.alert("Upload Success", `Uploaded: ${result.name}`);
      } else {
        console.log("User cancelled file picker");
      }
    } catch (err) {
      console.error("Error picking file:", err);
      Alert.alert("Upload Error", "Something went wrong while picking the file.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <MaterialIcons name="cloud-upload" size={24} color="white" />
        <Text style={styles.uploadText}>Upload Work</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.uploadButton, { marginTop: 20 }]}>
        <MaterialIcons name="folder" size={24} color="white" />
        <Text style={styles.uploadText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B72B5",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    elevation: 3,
  },
  uploadText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
