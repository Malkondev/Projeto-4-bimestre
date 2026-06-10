import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ClothingCard({ item, onPressWishlist, onPressDelete }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.footer}>
        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>

        <TouchableOpacity onPress={() => onPressWishlist?.(item)}>
          <Text style={styles.heart}>{item.isWishlist ? "♥" : "♡"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onPressDelete?.(item)}>
          <Text style={styles.delete}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 14,
    marginRight: 14,
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#F2F2F2",
  },
  footer: {
    minHeight: 42,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
  },
  heart: {
    fontSize: 24,
    marginLeft: 8,
  },
  delete: {
    fontSize: 18,
    marginLeft: 10,
  },
});