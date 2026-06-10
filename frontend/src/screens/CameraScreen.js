import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const API_URL = "http://localhost:3000/api";

export default function CameraScreen({ navigation }) {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  async function takePhoto() {
  try {
    const permission = await requestCameraPermission();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o uso da câmera para tirar fotos."
      );
      return;
    }

    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.5,
      base64: true,
    });

    if (!photo?.uri) {
      return;
    }

    setPhotoUri(photo.uri);

    let finalImage = "";

    if (photo.base64) {
      if (photo.base64.startsWith("data:image")) {
        finalImage = photo.base64;
      } else {
        finalImage = `data:image/jpeg;base64,${photo.base64}`;
      }
    } else {
      finalImage = await convertUriToBase64(photo.uri);
    }

    setPhotoBase64(finalImage);
  } catch (error) {
    Alert.alert("Erro", "Não foi possível tirar a foto.");
    console.log(error);
  }
}
  async function savePhoto() {
    try {
      if (!name || !category || !photoBase64) {
        Alert.alert("Campos obrigatórios", "Informe nome e tipo da peça.");
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
          image_url: photoBase64,
          is_favorite: false,
          is_wishlist: false,
        }),
      });

      if (!response.ok) {
        Alert.alert("Erro", "Não foi possível salvar a peça.");
        return;
      }

      Alert.alert("Peça salva", "A foto foi enviada para a sua galeria.");

      setName("");
      setCategory("");
      setPhotoUri(null);
      setPhotoBase64(null);

      navigation.navigate("Gallery");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar a peça.");
      console.log(error);
    }
  }

  if (!cameraPermission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Carregando câmera...</Text>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.permissionText}>
          O app precisa acessar a câmera.
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestCameraPermission}
        >
          <Text style={styles.permissionButtonText}>Permitir acesso</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (photoUri) {
    return (
      <SafeAreaView style={styles.formContainer}>
        <Image source={{ uri: photoUri }} style={styles.previewLarge} />

        <Text style={styles.title}>Cadastrar peça</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome da peça"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Tipo: Blusas, Calças, Sapatos, Vestidos..."
          value={category}
          onChangeText={setCategory}
        />

        <TouchableOpacity style={styles.saveButton} onPress={savePhoto}>
          <Text style={styles.saveButtonText}>Salvar na galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setPhotoUri(null);
            setPhotoBase64(null);
          }}
        >
          <Text style={styles.cancelButtonText}>Tirar outra foto</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
return (
  <SafeAreaView style={styles.container}>
    <CameraView ref={cameraRef} style={styles.camera} facing="back" />

    <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
      <View style={styles.cameraButtonInner} />
    </TouchableOpacity>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#272121",
  },
  camera: {
    flex: 1,
  },
  cameraButton: {
    position: "absolute",
    bottom: 44,
    alignSelf: "center",
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#272121",
  },
  center: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  permissionText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 18,
  },
  permissionButton: {
    backgroundColor: "#000",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 18,
  },
  previewLarge: {
    width: "100%",
    height: 280,
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 14,
  },
  input: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  saveButton: {
    height: 46,
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
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    fontWeight: "800",
  },
});