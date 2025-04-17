import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useState } from "react";

export default function HomeScreen() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateImage = () => {
    // TODO: Implement image generation
    console.log("Generating image with prompt:", prompt);
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-2xl p-6 shadow-lg">
        <Text className="text-2xl font-bold mb-4 text-gray-800">
          Generate Your Image
        </Text>
        
        <TextInput
          className="bg-gray-100 rounded-xl px-4 py-3 mb-4 text-gray-800"
          placeholder="Describe the image you want to generate..."
          placeholderTextColor="#6B7280"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          className="bg-black rounded-xl py-4"
          onPress={handleGenerateImage}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Generate Image
          </Text>
        </TouchableOpacity>
      </View>

      {generatedImage && (
        <View className="mt-6 bg-white rounded-2xl p-4 shadow-lg">
          <Image
            source={{ uri: generatedImage }}
            className="w-full h-64 rounded-xl"
            resizeMode="cover"
          />
        </View>
      )}
    </View>
  );
} 