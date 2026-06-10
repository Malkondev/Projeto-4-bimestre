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
  Modal,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = "http://localhost:3000/api";

export default function HomeScreen({ navigation }) {
  const [outfits, setOutfits] = useState([]);
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  async function loadOutfits() {
    try {
      const response = await fetch(`${API_URL}/outfits/public`);

      if (!response.ok) {
        console.log("Erro HTTP ao carregar montagens:", response.status);
        setOutfits([]);
        return;
      }

      const data = await response.json();
      setOutfits(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Erro ao carregar montagens:", error);
      setOutfits([]);
    }
  }

  async function deleteOutfit(outfit) {
    if (!outfit) return;

    const confirmed =
      Platform.OS === "web"
        ? window.confirm(`Deseja remover a montagem "${outfit.name}"?`)
        : true;

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/outfits/${outfit.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (Platform.OS === "web") {
          window.alert("Não foi possível remover a montagem.");
        }
        return;
      }

      setSelectedOutfit(null);
      loadOutfits();
    } catch (error) {
      console.log("Erro ao remover montagem:", error);

      if (Platform.OS === "web") {
        window.alert("Não foi possível remover a montagem.");
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadOutfits();
    }, [])
  );

  function renderOutfitPreview(outfit) {
    const clothes = outfit.clothing_items || [];

    if (clothes.length === 0 && outfit.generated_image_url) {
      return (
        <Image
          source={{ uri: outfit.generated_image_url }}
          style={styles.generatedImage}
          resizeMode="contain"
        />
      );
    }

    return (
      <View style={styles.previewGrid}>
       {clothes.slice(0, 4).map((item) => (
  <View key={item.id} style={styles.clothingPreview}>
    <Image
      source={{ uri: item.image_url }}
      style={styles.clothingImage}
      resizeMode="contain"
    />
    <Text numberOfLines={1} style={styles.clothingName}>
      {item.name}
    </Text>
  </View>
))}
      </View>
    );
  }

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
          <Text style={styles.sectionTitle}>Montagens</Text>
          <Text style={styles.arrow}>›</Text>
        </View>

        {outfits.length === 0 && (
          <Text style={styles.emptyText}>Nenhuma montagem salva ainda.</Text>
        )}

        <View style={styles.grid}>
          {outfits.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.outfitBlock}
              onPress={() => setSelectedOutfit(item)}
            >
              <View style={styles.card}>
                <Text numberOfLines={1} style={styles.cardTitle}>
                  {item.name}
                </Text>

                {renderOutfitPreview(item)}
              </View>

              <Text style={styles.label}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={Boolean(selectedOutfit)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedOutfit(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedOutfit?.name}</Text>

            <Text style={styles.modalSubtitle}>Roupas usadas</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.modalClothesScroll}
            >
              {(selectedOutfit?.clothing_items || []).map((item) => (
                <View key={item.id} style={styles.modalClothingCard}>
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.modalClothingImage}
                    resizeMode="contain"
                  />
                  <Text numberOfLines={1} style={styles.modalClothingName}>
                    {item.name}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <Text style={styles.modalSubtitle}>Comentário da IA</Text>

            <ScrollView style={styles.suggestionScroll}>
              <Text style={styles.suggestionText}>
                {selectedOutfit?.ai_suggestion ||
                  "Essa montagem ainda não possui comentário da IA."}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteOutfit(selectedOutfit)}
            >
              <Text style={styles.closeButtonText}>Remover montagem</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedOutfit(null)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
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
    fontSize: 20,
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
  width: 225,
  marginRight: 18,
  marginBottom: 24,
},

card: {
  width: "100%",
  height: 275,
  borderRadius: 8,
  backgroundColor: "#EDEDED",
  padding: 12,
  overflow: "hidden",
},

cardTitle: {
  fontSize: 16,
  fontWeight: "900",
  marginBottom: 10,
},

previewGrid: {
  flex: 1,
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignContent: "flex-start",
},

clothingPreview: {
  width: "48%",
  height: 100,
  backgroundColor: "#FFF",
  marginBottom: 8,
  padding: 4,
  overflow: "hidden",
},

clothingImage: {
  width: "100%",
  height: 72,
  backgroundColor: "#F7F7F7",
},

clothingName: {
  fontSize: 8,
  fontWeight: "700",
  marginTop: 3,
},
  generatedImage: {
    width: "100%",
    height: 210,
    backgroundColor: "#F7F7F7",
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "800",
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
    maxWidth: 520,
    maxHeight: "85%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 18,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },
  modalSubtitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  modalClothesScroll: {
    marginBottom: 18,
  },
  modalClothingCard: {
    width: 115,
    height: 125,
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    marginRight: 10,
    padding: 6,
  },
  modalClothingImage: {
    width: "100%",
    height: 85,
    backgroundColor: "#FFF",
  },
  modalClothingName: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 5,
  },
  suggestionScroll: {
    maxHeight: 240,
    backgroundColor: "#F1F1F1",
    borderRadius: 8,
    padding: 12,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#111",
  },
  deleteButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#B00020",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  closeButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "800",
  },
});