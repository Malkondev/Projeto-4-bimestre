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

      if (!response.ok) {
        setItems([]);
        return;
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Erro ao carregar lista de desejos:", error);
      setItems([]);
    }
  }

  async function toggleWishlist(selectedItem) {
    try {
      await fetch(`${API_URL}/clothing/${selectedItem.id}/wishlist`, {
        method: "PATCH",
      });

      loadItems();
    } catch (error) {
      console.log("Erro ao remover da lista de desejos:", error);
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

        <Text style={styles.title}>Favoritos ✨</Text>
        <View style={styles.grid}>
          {wishlistItems.map((item) => (
            <ClothingCard
              key={item.id}
              item={{
                ...item,
                image: item.image_url,
                isWishlist: Boolean(item.is_wishlist),
              }}
              onPressWishlist={toggleWishlist}
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
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});