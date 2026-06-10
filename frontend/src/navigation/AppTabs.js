import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import GalleryScreen from "../screens/GalleryScreen";
import CameraScreen from "../screens/CameraScreen";
import WishlistScreen from "../screens/WishlistScreen";
import MoreScreen from "../screens/MoreScreen";
import OutfitBuilderScreen from "../screens/OutfitBuilderScreen";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Montagem" component={OutfitBuilderScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Favoritos" component={WishlistScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}