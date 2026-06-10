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
  Alert,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = "http://localhost:3000/api";

function showMessage(title, message) {
  if (Platform.OS === "web") {
    window.alert(`${title}${message ? `\n\n${message}` : ""}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function OutfitBuilderScreen() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lookName, setLookName] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function loadItems() {
    try {
      const response = await fetch(`${API_URL}/clothing`);

      if (!response.ok) {
        console.log("Erro HTTP ao carregar peças:", response.status);
        setItems([]);
        return;
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Erro ao carregar peças:", error);
      setItems([]);
    }
  }

  function toggleSelect(item) {
    const alreadySelected = selectedItems.some(
      (selected) => selected.id === item.id
    );

    if (alreadySelected) {
      setSelectedItems((current) =>
        current.filter((selected) => selected.id !== item.id)
      );
    } else {
      setSelectedItems((current) => [...current, item]);
    }
  }

  async function handleGenerateLook() {
    try {
      if (!lookName.trim()) {
        showMessage("Atenção", "Informe um nome para a montagem.");
        return;
      }

      if (selectedItems.length < 2) {
        showMessage("Atenção", "Selecione pelo menos duas roupas.");
        return;
      }

      setIsGenerating(true);
      setAiSuggestion("");

      const response = await fetch(`${API_URL}/outfits/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          look_name: lookName,
          clothing_item_ids: selectedItems.map((item) => item.id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Erro da IA:", data);
        showMessage(
          "Erro",
          data.message || "Não foi possível gerar a sugestão com IA."
        );
        return;
      }

      if (!data.suggestion) {
        showMessage("Erro", "A IA não retornou uma sugestão.");
        return;
      }

      setAiSuggestion(data.suggestion);
    } catch (error) {
      console.log("Erro ao gerar sugestão com IA:", error);
      showMessage("Erro", "Erro ao gerar sugestão com IA. Veja o console.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSaveLook() {
    try {
      if (!aiSuggestion) {
        showMessage("Atenção", "Gere a sugestão primeiro.");
        return;
      }

      if (!lookName.trim()) {
        showMessage("Atenção", "Informe um nome para a montagem.");
        return;
      }

      setIsSaving(true);

      const response = await fetch(`${API_URL}/outfits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          name: lookName,
          description: "Montagem analisada com IA no SmartCloset.",
          generated_image_url: null,
          ai_suggestion: aiSuggestion,
          clothing_item_ids: selectedItems.map((item) => item.id),
          is_public: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Erro ao salvar montagem:", data);
        showMessage("Erro", data.message || "Não foi possível salvar a montagem.");
        return;
      }

      showMessage("Montagem salva", "Seu look agora aparece na Home.");

      setLookName("");
      setSelectedItems([]);
      setAiSuggestion("");
    } catch (error) {
      console.log("Erro ao salvar montagem:", error);
      showMessage("Erro", "Não foi possível salvar a montagem.");
    } finally {
      setIsSaving(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

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

        {items.length === 0 && (
          <Text style={styles.emptyText}>
            Nenhuma roupa cadastrada ainda. Tire fotos pela câmera primeiro.
          </Text>
        )}

        <View style={styles.grid}>
          {items.map((item) => {
            const selected = selectedItems.some(
              (selectedItem) => selectedItem.id === item.id
            );

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => toggleSelect(item)}
                disabled={isGenerating || isSaving}
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.image}
                  resizeMode="contain"
                />

                <View style={styles.cardFooter}>
                  <Text numberOfLines={1} style={styles.itemName}>
                    {item.name}
                  </Text>

                  <Text style={styles.selectedText}>{selected ? "✓" : ""}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.button, isGenerating && styles.buttonDisabled]}
          onPress={handleGenerateLook}
          disabled={isGenerating || isSaving}
        >
          <Text style={styles.buttonText}>
            {isGenerating ? "Gerando sugestão..." : "Gerar sugestão com IA"}
          </Text>
        </TouchableOpacity>

        {aiSuggestion ? (
          <View style={styles.previewBox}>
            <Text style={styles.subtitle}>Sugestão da IA</Text>

            <View style={styles.suggestionBox}>
              <Text style={styles.suggestionText}>{aiSuggestion}</Text>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.buttonDisabled]}
              onPress={handleSaveLook}
              disabled={isSaving || isGenerating}
            >
              <Text style={styles.buttonText}>
                {isSaving ? "Salvando..." : "Salvar montagem"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={styles.info}>
          A IA analisa as roupas selecionadas e sugere onde usar, o que combina
          e o que pode melhorar no look.
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
  emptyText: {
    color: "#777",
    marginBottom: 16,
    lineHeight: 20,
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
    backgroundColor: "#F7F7F7",
  },
  cardFooter: {
    minHeight: 42,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    flex: 1,
    fontWeight: "700",
    fontSize: 12,
  },
  selectedText: {
    fontSize: 18,
    fontWeight: "900",
    marginLeft: 6,
  },
  button: {
    height: 46,
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  saveButton: {
    height: 46,
    backgroundColor: "#222",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "800",
  },
  previewBox: {
    marginTop: 24,
  },
  suggestionBox: {
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    padding: 14,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#111",
  },
  info: {
    marginTop: 14,
    color: "#777",
    lineHeight: 20,
  },
});