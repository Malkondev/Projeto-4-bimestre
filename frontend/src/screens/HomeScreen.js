import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = "http://localhost:3000/api";

export default function HomeScreen({ navigation }) {
  const [outfits, setOutfits] = useState([]);

  async function loadOutfits() {
    try {
      const response = await fetch(`${API_URL}/outfits/public`);
      const data = await response.json();
      setOutfits(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Erro ao carregar montagens:", error);
      setOutfits([]);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadOutfits();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <TextInput style={styles.search} placeholder="🔍  Buscar" />

        <TouchableOpacity
          style={styles.mountButton}
          onPress={() => navigation.navigate("Montagem")}
        >
          <Text style={styles.mountButtonText}>+ Criar montagem com IA</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Montagens públicas</Text>
          <Text style={styles.arrow}>›</Text>
        </View>

        {outfits.length === 0 && (
          <Text style={styles.emptyText}>
            Nenhuma montagem salva ainda.
          </Text>
        )}

        <View style={styles.grid}>
          {outfits.map((item) => (
            <View key={item.id} style={styles.outfitBlock}>
              <Image
                source={{ uri: item.generated_image_url }}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.label}>{item.name}</Text>
            </View>
          ))}
        </View>
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
  emptyText: {
    color: "#777",
    marginBottom: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  outfitBlock: {
    width: 180,
    marginRight: 14,
    marginBottom: 18,
  },
  cardImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    backgroundColor: "#EDEDED",
  },
  label: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
  },
});