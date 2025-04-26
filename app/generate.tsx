import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Keyboard,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import { generateImage } from "@/services/ImageService";
import Voice from '@react-native-voice/voice';

export default function GenerateScreen() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>("cartoon");
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);

  const styles = [
    { id: "cartoon", name: "Cartoon" },
    { id: "ghibli", name: "Ghibli" },
    { id: "sketch", name: "Sketch" },
    { id: "3d-cartoon", name: "3D Cartoon" },
  ];

  useEffect(() => {
    const initVoice = async () => {
      try {
        await Voice.isAvailable();
        setIsVoiceAvailable(true);
      } catch (e) {
        console.error('Voice recognition not available:', e);
        setIsVoiceAvailable(false);
      }
    };

    initVoice();

    Voice.onSpeechStart = () => {
      setIsRecording(true);
    };
    Voice.onSpeechEnd = () => {
      setIsRecording(false);
    };
    Voice.onSpeechError = (error) => {
      console.error('Speech recognition error:', error);
      setError('Failed to recognize speech. Please try again.');
      setIsRecording(false);
    };
    Voice.onSpeechResults = (results: { value?: string[] }) => {
      if (results.value && results.value.length > 0) {
        setPrompt(prev => prev + ' ' + results.value[0]);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleGenerateImage = async () => {
    Keyboard.dismiss();
    console.log("Generating image with prompt:", prompt);
    setLoadingImage(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const imageUrl = await generateImage(prompt.trim());
      setGeneratedImage(imageUrl);
      setPrompt("");
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error("Error generating image:", err);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleRetry = () => {
    if (prompt.trim()) {
      handleGenerateImage();
    }
  };

  const handleVoiceInput = async () => {
    try {
      if (isRecording) {
        await Voice.stop();
        return;
      }

      if (!isVoiceAvailable) {
        setError('Voice recognition is not available on this device');
        return;
      }

      await Voice.start('en-US');
    } catch (error) {
      console.error('Speech recognition error:', error);
      setError('Failed to start speech recognition. Please try again.');
      setIsRecording(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
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
          <View className="rounded-2xl p-4 shadow-lg">
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

        {error && !loadingImage && (
          <View className="rounded-2xl p-4 shadow-lg items-center">
            <Text className="text-red-500 font-bold text-center mb-4">
              {error}
            </Text>
            <TouchableOpacity
              onPress={handleRetry}
              className="bg-white/10 rounded-full px-6 py-3 flex-row items-center"
            >
              <Ionicons name="reload" size={20} color="white" />
              <Text className="text-white ml-2">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {generatedImage && !loadingImage && !error && (
          <View className="rounded-2xl p-4 shadow-lg">
            <Image
              source={{ uri: generatedImage }}
              className="w-full h-80 rounded-xl"
              resizeMode="cover"
              onLoadEnd={() => setLoadingImage(false)}
            />
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-5 left-5 right-5 p-4 flex-col items-center space-x-3 border border-white/10 bg-[#1E1E1E] rounded-[30px]">
        <TextInput
          className="flex-1 text-white rounded-xl pb-6 pt-2 ps-2 w-full"
          placeholder="Type your prompt..."
          placeholderTextColor="#9CA3AF"
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
        <View className="flex flex-row items-center justify-between w-full">
          <View>
            <TouchableOpacity 
              onPress={() => setShowOptions(!showOptions)}
              className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mx-2"
            >
              <Ionicons name="options-outline" size={20} color="white" />
            </TouchableOpacity>
            {showOptions && (
              <View className="absolute bottom-0 left-0 bg-[#1E1E1E] rounded-2xl p-3 w-40 shadow-lg border border-white/10">
                <Text className="text-white text-sm font-semibold mb-2">Style Options</Text>
                {styles.map((style) => (
                  <TouchableOpacity
                    key={style.id}
                    onPress={() => {
                      setSelectedStyle(style.id);
                      setShowOptions(false);
                    }}
                    className={`px-3 py-2 rounded-lg mb-1 ${
                      selectedStyle === style.id ? "bg-white" : "bg-white/5"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Text
                        className={`text-sm flex-1 ${
                          selectedStyle === style.id ? "text-black" : "text-white"
                        }`}
                      >
                        {style.name}
                      </Text>
                      {selectedStyle === style.id && (
                        <Ionicons name="checkmark" size={16} color="black" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View className="flex-row">
            <TouchableOpacity
              disabled={loadingImage || !isVoiceAvailable}
              onPress={handleVoiceInput}
              className={`w-10 h-10 rounded-full items-center justify-center mx-2 ${
                isRecording ? "bg-red-500" : "bg-white/10"
              }`}
            >
              <MaterialCommunityIcons
                name="microphone"
                size={20}
                color={isRecording ? "white" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={loadingImage}
              onPress={handleGenerateImage}
              className={`w-10 h-10 rounded-full items-center justify-center mx-2 ${
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