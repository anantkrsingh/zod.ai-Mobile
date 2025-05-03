import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useRef, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { GradientButton } from "./GradientButton";
import { useRouter } from "expo-router";

interface CreationDialogProps {
  visible: boolean;
  onClose: () => void;
  imageUrl: string;
  prompt: string;
  isPremium: boolean;
  user: {
    id: string;
    name: string;
    profileUrl?: string;
  };
}

const CreationDialog = ({
  visible,
  onClose,
  imageUrl,
  prompt,
  isPremium,
  user,
}: CreationDialogProps) => {
  const screenHeight = Dimensions.get("window").height;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [showTooltip, setShowTooltip] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleDownload = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + "image.jpg";
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      console.log("Image downloaded to:", uri);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing AI-generated image! Prompt: ${prompt}`,
        url: imageUrl,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleUserProfilePress = () => {
    router.push(`/user-profile?userId=${user.id}`);
    requestAnimationFrame(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      hardwareAccelerated
    >
      <View className="flex-1 bg-transparent">
        <Animated.View
          className="flex-1 bg-black/80"
          style={{ opacity: fadeAnim }}
        >
          <Animated.View
            className="flex-1"
            style={{ transform: [{ translateY: slideAnim }] }}
          >
            <TouchableOpacity
              className="absolute top-4 right-4 z-10"
              onPress={onClose}
            >
              <Ionicons name="close" size={32} color="white" />
            </TouchableOpacity>

            <View className="flex-1 justify-center items-center p-4">
              <Image
                source={{ uri: imageUrl }}
                className="w-full aspect-square rounded-2xl"
                resizeMode="contain"
              />

              <View className="w-full mt-4">
                <Text className="text-white text-lg font-semibold mb-2">
                  Prompt
                </Text>
                <Text className="text-white/80 text-base mb-4">{prompt}</Text>

                {isPremium && (
                  <View className="mb-4">
                    <GradientButton
                      text="Premium"
                      onPress={() => {}}
                      isSelected={true}
                      className="py-0.5 px-2"
                      tooltipMessage="This image was generated using premium tokens."
                      tooltipButtonName="Purchase"
                      showTooltip={showTooltip}
                      onTooltipButtonPress={() => {
                        console.log("Purchase clicked");
                      }}
                    />
                  </View>
                )}

                <View className="flex-row justify-between items-center mb-4">
                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={handleUserProfilePress}
                    activeOpacity={0.7}
                  >
                    <TouchableOpacity
                      onPress={handleUserProfilePress}
                      className="w-10 h-10 bg-white/10 rounded-full justify-center items-center mr-2 overflow-hidden"
                    >
                      {user.profileUrl ? (
                        <Image
                          source={{ uri: user.profileUrl }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="person" size={20} color="white" />
                      )}
                    </TouchableOpacity>
                    <Text className="text-white">{user.name}</Text>
                  </TouchableOpacity>

                  <View className="flex-row space-x-2 gap-4">
                    <TouchableOpacity
                      onPress={handleDownload}
                      className="w-10 h-10 bg-white/10 rounded-full justify-center items-center"
                    >
                      <Ionicons name="download" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleShare}
                      className="w-10 h-10 bg-white/10 rounded-full justify-center items-center"
                    >
                      <Ionicons name="share-outline" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CreationDialog; 