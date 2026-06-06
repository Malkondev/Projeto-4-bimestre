import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);

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
        quality: 0.8,
      });

      if (!photo?.uri) {
        return;
      }

      setPhotoUri(photo.uri);

      Alert.alert(
        "Foto capturada",
        "A foto foi tirada. Na versão web ela fica apenas como prévia."
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível tirar a foto.");
      console.log(error);
    }
  }

  if (Platform.OS === "web") {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Câmera</Text>
        <Text style={styles.permissionText}>
          A câmera com salvamento na galeria será testada pelo celular com Expo Go.
        </Text>
        <Text style={styles.permissionText}>
          No navegador, use as telas Galeria e Lista de desejos para testar as fotos do banco.
        </Text>
      </SafeAreaView>
    );
  }

  if (!cameraPermission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Carregando permissões...</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={styles.topBar}>
          <Text style={styles.backText}>‹</Text>
        </View>

        {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}

        <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
          <View style={styles.cameraButtonInner} />
        </TouchableOpacity>
      </CameraView>
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
  topBar: {
    paddingTop: 20,
    paddingLeft: 18,
  },
  backText: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "#FFF",
    color: "#FFF",
    fontSize: 30,
    lineHeight: 30,
    textAlign: "center",
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
  preview: {
    position: "absolute",
    right: 16,
    bottom: 50,
    width: 70,
    height: 90,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  center: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 12,
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
});