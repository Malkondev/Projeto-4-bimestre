import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

const outfits = [
  { id: 1, title: "Inverno", emoji: "🧥" },
  { id: 2, title: "Casual", emoji: "👗" },
  { id: 3, title: "Noite", emoji: "👚" },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <TextInput style={styles.search} placeholder="🔍  Buscar" />

        <TouchableOpacity
          style={styles.mountButton}
          onPress={() => navigation.navigate("Montagem")}
        >
          <Text style={styles.mountButtonText}>+ Criar montagem com IA</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suas montagens</Text>
          <Text style={styles.arrow}>›</Text>
        </View>

        {outfits.map((item) => (
          <View key={item.id} style={styles.outfitBlock}>
            <View style={styles.card}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.label}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    padding: 16,
    paddingBottom: 90,
  },
  search: {
    height: 38,
    borderRadius: 8,
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  mountButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  mountButtonText: {
    color: "#FFF",
    fontWeight: "800",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  arrow: {
    marginLeft: 8,
    fontSize: 22,
    fontWeight: "700",
  },
  outfitBlock: {
    marginBottom: 18,
  },
  card: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 76,
  },
  label: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
  },
});