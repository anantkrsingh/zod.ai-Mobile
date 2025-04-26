import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import GenerateScreen from "./generate";
import ProfileScreen from "./profile";
import NotificationsScreen from "./notifications";
import Creations from "./creations";

type Tab = {
  id: string;
  icon: string;
  label: string;
};

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("home");

  const tabs: Tab[] = [
    { id: "home", icon: "home", label: "Home" },
    { id: "new", icon: "add-circle", label: "New" },
    { id: "profile", icon: "person", label: "Profile" },
    { id: "notifications", icon: "notifications", label: "Notifications" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Creations />;
      case "new":
        return <GenerateScreen />;
      case "profile":
        return <ProfileScreen />;
      case "notifications":
        return <NotificationsScreen />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar backgroundColor={"black"} barStyle={"light-content"} />
      
      {/* Main Content */}
      <View className="flex-1">
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      <View className="bg-[#1E1E1E] border-t border-white/10">
        <View className="flex-row justify-around items-center py-3">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              className="items-center"
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons
                name={tab.icon as any}
                size={24}
                color={activeTab === tab.id ? "white" : "gray"}
              />
              <Text
                className={`text-xs mt-1 ${
                  activeTab === tab.id ? "text-white" : "text-gray-500"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
