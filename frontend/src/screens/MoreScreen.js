import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";

const options = [
  { icon: "⚙️", label: "Configurações" },
  { icon: "☆", label: "Favoritos" },
  { icon: "✉️", label: "Notificações" },
  { icon: "🧾", label: "Planos" },
  { icon: "ℹ️", label: "Informações" },
  { icon: "❔", label: "Central de ajuda" },
];

export default function MoreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userRow}>
        <Text style={styles.userIcon}>👤</Text>
        <Text style={styles.userName}>Usuário</Text>
      </View>

      <View style={styles.options}>
        {options.map((option) => (
          <TouchableOpacity key={option.label} style={styles.option}>
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 18,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 34,
  },
  userIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: "800",
  },
  options: {
    gap: 14,
  },
  option: {
    height: 52,
    backgroundColor: "#D9D9D9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  optionIcon: {
    width: 32,
    fontSize: 20,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "800",
  },
});