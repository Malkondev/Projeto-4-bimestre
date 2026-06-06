import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import ClothingCard from "../components/ClothingCard";

const API_URL = "http://localhost:3000/api";

export default function WishlistScreen() {
  const [items, setItems] = useState([]);

  async function loadItems() {
    try {
      const response = await fetch(`${API_URL}/clothing`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.log("Erro ao carregar lista de desejos:", error);
    }
  }

  async function toggleFavorite(selectedItem) {
    try {
      await fetch(`${API_URL}/clothing/${selectedItem.id}/favorite`, {
        method: "PATCH",
      });

      loadItems();
    } catch (error) {
      console.log("Erro ao favoritar peça:", error);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const wishlistItems = items.filter((item) => item.is_wishlist);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TextInput style={styles.search} placeholder="🔍  Buscar" />

        <Text style={styles.title}>Lista de desejos ✨</Text>

        <View style={styles.grid}>
          {wishlistItems.map((item) => (
            <ClothingCard
              key={item.id}
              item={{
                ...item,
                image: item.image_url,
                isFavorite: item.is_favorite,
              }}
              onPressFavorite={toggleFavorite}
            />
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
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
});