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

export default function GalleryScreen() {
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
      console.log("Erro ao carregar galeria:", error);
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
      console.log("Erro ao atualizar lista de desejos:", error);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const categories = ["Blusas", "Calças", "Sapatos", "Acessórios", "Vestidos", "Outros"];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TextInput style={styles.search} placeholder="🔍  Buscar" />

        <Text style={styles.pageTitle}>Galeria</Text>

        {categories.map((category) => {
          const categoryItems = items.filter((item) => item.category === category);

          if (categoryItems.length === 0) {
            return null;
          }

          return (
            <View key={category} style={styles.category}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.arrow}>›</Text>
              </View>

              <View style={styles.grid}>
                {categoryItems.map((item) => (
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
            </View>
          );
        })}
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
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 18,
  },
  category: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  arrow: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});