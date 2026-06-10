import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

const API_URL = "http://localhost:3000/api";

export default function OutfitBuilderScreen() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lookName, setLookName] = useState("");

  async function loadItems() {
    try {
      const response = await fetch(`${API_URL}/clothing`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Erro ao carregar peças:", error);
    }
  }

  function toggleSelect(item) {
    const alreadySelected = selectedItems.some((selected) => selected.id === item.id);

    if (alreadySelected) {
      setSelectedItems((current) =>
        current.filter((selected) => selected.id !== item.id)
      );
    } else {
      setSelectedItems((current) => [...current, item]);
    }
  }

  function handleGenerateLook() {
    if (!lookName || selectedItems.length < 2) {
      Alert.alert(
        "Montagem incompleta",
        "Informe um nome e selecione pelo menos duas peças."
      );
      return;
    }

    Alert.alert(
      "IA simulada",
      "Nesta versão, a IA ainda será integrada. Por enquanto, a montagem foi preparada com as peças selecionadas."
    );
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Montar look com IA</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome da montagem"
          value={lookName}
          onChangeText={setLookName}
        />

        <Text style={styles.subtitle}>Selecione suas roupas</Text>

        <View style={styles.grid}>
          {items.map((item) => {
            const selected = selectedItems.some((selectedItem) => selectedItem.id === item.id);

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => toggleSelect(item)}
              >
                <Image source={{ uri: item.image_url }} style={styles.image} />
                <Text numberOfLines={1} style={styles.itemName}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGenerateLook}>
          <Text style={styles.buttonText}>Gerar montagem com IA</Text>
        </TouchableOpacity>

        <Text style={styles.info}>
          Próxima etapa: integrar uma API de IA para gerar uma imagem real do look
          usando as peças selecionadas.
        </Text>
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
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },
  input: {
    height: 42,
    borderRadius: 8,
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    width: 160,
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    marginRight: 14,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: "#000",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    backgroundColor: "#F7F7F7",
  },
  itemName: {
    padding: 8,
    fontWeight: "700",
    fontSize: 12,
  },
  button: {
    height: 46,
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "800",
  },
  info: {
    marginTop: 14,
    color: "#777",
    lineHeight: 20,
  },
});