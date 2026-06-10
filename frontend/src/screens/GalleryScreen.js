import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ClothingCard from "../components/ClothingCard";

const API_URL = "http://localhost:3000/api";

function showMessage(title, message) {
  if (Platform.OS === "web") {
    window.alert(`${title}${message ? `\n\n${message}` : ""}`);
  } else {
    Alert.alert(title, message);
  }
}

function confirmAction(message) {
  if (Platform.OS === "web") {
    return window.confirm(message);
  }

  return true;
}

export default function GalleryScreen() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function loadItems() {
    try {
      const response = await fetch(`${API_URL}/clothing`);

      if (!response.ok) {
        console.log("Erro HTTP ao carregar galeria:", response.status);
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

  async function deleteItem(selectedItem) {
    const confirmed = confirmAction(
      `Deseja remover "${selectedItem.name}" da galeria?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/clothing/${selectedItem.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        showMessage("Erro", "Não foi possível remover a peça.");
        return;
      }

      loadItems();
    } catch (error) {
      console.log("Erro ao remover peça:", error);
      showMessage("Erro", "Não foi possível remover a peça.");
    }
  }

  async function addInternetPhoto() {
    try {
      if (!name.trim() || !category.trim() || !imageUrl.trim()) {
        showMessage("Atenção", "Preencha nome, tipo e URL da imagem.");
        return;
      }

      const response = await fetch(`${API_URL}/clothing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          name,
          category,
          image_url: imageUrl,
          is_favorite: false,
          is_wishlist: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        showMessage("Erro", data.message || "Não foi possível cadastrar a peça.");
        return;
      }

      setName("");
      setCategory("");
      setImageUrl("");
      setModalVisible(false);
      loadItems();

      showMessage("Sucesso", "Foto adicionada na galeria.");
    } catch (error) {
      console.log("Erro ao adicionar foto da internet:", error);
      showMessage("Erro", "Não foi possível adicionar a foto.");
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const categories = [...new Set(items.map((item) => item.category || "Outros"))];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TextInput style={styles.search} placeholder="🔍  Buscar" />

        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Galeria</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Foto da internet</Text>
          </TouchableOpacity>
        </View>

        {items.length === 0 && (
          <Text style={styles.emptyText}>Nenhuma peça cadastrada ainda.</Text>
        )}

        {categories.map((category) => {
          const categoryItems = items.filter(
            (item) => (item.category || "Outros") === category
          );

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
                    onPressDelete={deleteItem}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Adicionar foto da internet</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da peça"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Tipo: Blusas, Calças, Sapatos..."
              value={category}
              onChangeText={setCategory}
            />

            <TextInput
              style={styles.input}
              placeholder="URL da imagem"
              value={imageUrl}
              onChangeText={setImageUrl}
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.saveButton} onPress={addInternetPhoto}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  addButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 12,
  },
  emptyText: {
    color: "#777",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  modalBox: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
  },
  input: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  saveButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "800",
  },
  cancelButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    fontWeight: "800",
  },
});