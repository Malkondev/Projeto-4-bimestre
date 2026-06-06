import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ClothingCard({ item, onPressFavorite }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.footer}>
        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>

        <TouchableOpacity onPress={() => onPressFavorite?.(item)}>
          <Text style={styles.favorite}>{item.isFavorite ? "♥" : "♡"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 14,
  },
  image: {
    width: "100%",
    height: 125,
    resizeMode: "cover",
    backgroundColor: "#DDD",
  },
  footer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
  },
  favorite: {
    fontSize: 20,
    marginLeft: 6,
  },
});