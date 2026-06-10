import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";

const options = [
  {
    icon: "⚙️",
    label: "Configurações",
    title: "Configurações",
    text: "Aqui ficarão as configurações do aplicativo, como tema, idioma e preferências do usuário.",
    action: "modal",
  },
  {
    icon: "☆",
    label: "Favoritos",
    action: "favorites",
  },
  {
    icon: "✉️",
    label: "Notificações",
    title: "Notificações",
    text: "Você ainda não possui notificações. Futuramente o SmartCloset poderá avisar sobre novas sugestões de looks.",
    action: "modal",
  },
  {
    icon: "🧾",
    label: "Planos",
    title: "Planos",
    text: "Plano gratuito: galeria, favoritos, câmera e montagens básicas. Plano premium: poderia incluir mais sugestões com IA e recursos avançados.",
    action: "modal",
  },
  {
    icon: "ℹ️",
    label: "Informações",
    title: "Informações",
    text: "SmartCloset é um aplicativo de guarda-roupa digital que permite cadastrar roupas, criar montagens e receber sugestões de looks com IA.",
    action: "modal",
  },
  {
    icon: "❔",
    label: "Central de ajuda",
    title: "Central de ajuda",
    text: "Para usar o app: cadastre roupas pela câmera ou por URL, adicione itens aos favoritos, crie montagens e veja sugestões de estilo.",
    action: "modal",
  },
];

export default function MoreScreen({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(null);

  function handlePressOption(option) {
    if (option.action === "favorites") {
      navigation.navigate("Favoritos");
      return;
    }

    setSelectedOption(option);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userRow}>
        <Text style={styles.userIcon}>👤</Text>
        <View>
          <Text style={styles.userName}>Usuário</Text>
          <Text style={styles.userEmail}>SmartCloset</Text>
        </View>
      </View>

      <View style={styles.options}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={styles.option}
            onPress={() => handlePressOption(option)}
          >
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <Text style={styles.optionText}>{option.label}</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={Boolean(selectedOption)} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedOption?.title}</Text>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalText}>{selectedOption?.text}</Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedOption(null)}
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
    padding: 18,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 34,
  },
  userIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "900",
  },
  userEmail: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },
  options: {
    gap: 14,
  },
  option: {
    minHeight: 56,
    backgroundColor: "#D9D9D9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  optionIcon: {
    width: 34,
    fontSize: 20,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
  },
  optionArrow: {
    fontSize: 24,
    fontWeight: "900",
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
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  modalContent: {
    maxHeight: 240,
    backgroundColor: "#F1F1F1",
    borderRadius: 8,
    padding: 12,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#111",
  },
  closeButton: {
    height: 44,
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "800",
  },
});