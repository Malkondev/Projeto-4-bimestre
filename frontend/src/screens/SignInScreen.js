import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { theme } from "../styles/theme";

export default function SignInScreen({ navigation }) {
  const [mode, setMode] = useState("login");

  const isRegister = mode === "register";

  function handleContinue() {
    navigation.replace("Main");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>SmartCloset</Text>

        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchButton, mode === "login" && styles.switchActive]}
            onPress={() => setMode("login")}
          >
            <Text style={[styles.switchText, mode === "login" && styles.switchTextActive]}>
              Entrar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchButton, mode === "register" && styles.switchActive]}
            onPress={() => setMode("register")}
          >
            <Text style={[styles.switchText, mode === "register" && styles.switchTextActive]}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          {isRegister ? "Criar uma conta" : "Entrar na conta"}
        </Text>

        <Text style={styles.subtitle}>
          {isRegister
            ? "Insira seus dados para se cadastrar neste aplicativo"
            : "Insira seus dados para acessar seu guarda-roupa"}
        </Text>

        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#999"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="email@dominio.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
        />

        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#999"
            secureTextEntry
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>
            {isRegister ? "Cadastrar" : "Continuar"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          Ao clicar em continuar, você concorda com nossos{"\n"}
          <Text style={styles.link}>Termos de Serviço</Text> e com a{" "}
          <Text style={styles.link}>Política de Privacidade</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 48,
    color: theme.colors.text,
  },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  switchActive: {
    backgroundColor: "#000",
  },
  switchText: {
    color: "#777",
    fontWeight: "600",
  },
  switchTextActive: {
    color: "#FFF",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: theme.colors.muted,
    marginBottom: 18,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: "#FFF",
  },
  button: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
  },
  terms: {
    textAlign: "center",
    color: "#888",
    fontSize: 11,
    marginTop: 28,
    lineHeight: 18,
  },
  link: {
    color: "#000",
    fontWeight: "700",
  },
});