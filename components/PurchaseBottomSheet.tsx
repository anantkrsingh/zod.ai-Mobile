import React from "react";
import { View, Text, TouchableOpacity, Modal, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface PurchaseBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const { height } = Dimensions.get("window");

export const PurchaseBottomSheet: React.FC<PurchaseBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <TouchableOpacity className="flex-1" onPress={onClose} />
        <View
          className="bg-[#1A1A1A] rounded-t-3xl p-6"
          style={{ height: height * 0.5 }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-xl font-bold">Purchase</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="space-y-4 gap-4">
            <LinearGradient
              colors={["rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl p-4 border border-blue-500/30 overflow-hidden"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-blue-400 text-lg font-bold">₹19</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#60A5FA"
                    />
                    <Text className="text-blue-400 text-sm ml-1">
                      4 Regular Image Generations
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#60A5FA"
                    />
                    <Text className="text-blue-400 text-sm ml-1">
                      5 Premium Image Generations
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="bg-blue-500 px-4 py-1.5 rounded-full"
                  onPress={() => console.log("Purchase ₹19 package")}
                >
                  <Text className="text-white text-xs font-bold">Purchase</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Premium Package */}
            <LinearGradient
              colors={["rgba(234, 179, 8, 0.2)", "rgba(234, 179, 8, 0.1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl p-4 border border-yellow-800 overflow-hidden"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-yellow-600 text-lg font-bold">₹99</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#D97706"
                    />
                    <Text className="text-yellow-600 text-sm ml-1">
                      30 Premium Image Generations
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#D97706"
                    />
                    <Text className="text-yellow-600 text-sm ml-1">
                      25 Regular Image Generations
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#D97706"
                    />
                    <Text className="text-yellow-600 text-sm ml-1">
                      1M Ads Free Browsing
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="bg-yellow-600 px-4 py-1.5 rounded-full"
                  onPress={() => console.log("Purchase ₹99 package")}
                >
                  <Text className="text-white text-xs font-bold">Purchase</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
};
