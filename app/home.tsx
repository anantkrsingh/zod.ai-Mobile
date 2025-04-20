import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Keyboard,
} from "react-native";
import { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import { generateImage } from "@/services/ImageService";
import AuthService from "@/services/AuthService";

export default function HomeScreen() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const handleGenerateImage = () => {
    Keyboard.dismiss();
    setPrompt("");
    console.log("Generating image with prompt:", prompt);
    setLoadingImage(true);
    setGeneratedImage(null);
    setTimeout(async () => {
      const imageUrl = await generateImage(prompt.trim());
      setGeneratedImage(imageUrl);

      setLoadingImage(false);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar backgroundColor={"black"} barStyle={"light-content"} />

      <ScrollView
        className="flex-1 px-4 pt-12 mb-24"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-6">
          <Text className="text-white text-3xl font-bold text-center">
            Image Generator
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Describe what you'd like to see
          </Text>
        </View>

        {loadingImage && (
          <View className=" rounded-2xl p-4 shadow-lg">
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={250}
              height={250}
              style={{ borderRadius: 16 }}
              shimmerStyle={{ borderRadius: 16 }}
              visible={!loadingImage}
              shimmerColors={["#2c2c2e", "#3a3a3c", "#2c2c2e"]}
            />
          </View>
        )}

        {generatedImage && !loadingImage && (
          <View className=" rounded-2xl p-4 shadow-lg">
            <Image
              source={{ uri: generatedImage }}
              className="w-full h-80 rounded-xl"
              resizeMode="cover"
              onLoadEnd={() => setLoadingImage(false)}
            />
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-5 left-5 right-5  p-4 flex-col items-center space-x-3 border border-white/10  bg-[#1E1E1E] rounded-[30px]">
        <TextInput
          className="flex-1   text-white   rounded-xl pb-6  pt-2 ps-2 w-full"
          placeholder="Type your prompt..."
          placeholderTextColor="#9CA3AF"
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
        <View className="flex flex-row items-center justify-between w-full">
          <View>
            <TouchableOpacity className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mx-2">
              <Ionicons name="options-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              disabled={loadingImage}
              className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mx-2"
            >
              <MaterialCommunityIcons
                name="microphone"
                size={20}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={loadingImage}
              onPress={handleGenerateImage}
              className={`w-10 h-10  rounded-full items-center justify-center mx-2 ${
                prompt.length > 0 && !loadingImage ? "bg-white" : "bg-white/20"
              }`}
            >
              <Ionicons name="arrow-up" size={18} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
