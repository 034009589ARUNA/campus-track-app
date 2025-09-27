// src/components/DashboardCard.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type DashboardCardProps = {
  title: string;
  message: string;
  icon: string;
  onPress: () => void;
  backgroundColor?: string; // optional prop
  textColor?: string; // optional prop
};

export default function DashboardCard({ title, message, icon, onPress, backgroundColor,textColor }: DashboardCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: backgroundColor || "#fff" }]}
      onPress={onPress}
    >
      <Icon name={icon} size={40} color="#007BFF" style={styles.icon} />
      <Text style={[styles.cardTitle, { color: textColor || "#333" }]}>{title}</Text>
      <Text style={[styles.cardMessage, { color: textColor || "#333" }]}>{message}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  cardMessage: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});
