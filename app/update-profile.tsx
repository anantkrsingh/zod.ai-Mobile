import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { router } from "expo-router";
import { get, post } from "../utils/api";
import ProfileService, { UserProfile } from "../services/ProfileService";
import HandleService from "../services/HandleService";
import ImageCropPicker from "react-native-image-crop-picker";
import { debounce } from "../utils/debounce";

interface Avatar {
  id: string;
  imageUrl: string;
}

interface AvatarsResponse {
  avatars: Avatar[];
  currentPage: number;
  totalAvatars: number;
  totalPages: number;
}

export default function UpdateProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCheckingHandle, setIsCheckingHandle] = useState(false);
  const [isHandleAvailable, setIsHandleAvailable] = useState<boolean | null>(
    true
  );
  const [handleError, setHandleError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedBase64, setSelectedBase64] = useState<string | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (showAvatarSelector) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showAvatarSelector]);

  const fetchProfile = async () => {
    try {
      const data = await ProfileService.getProfile();
      setProfile(data);
      setName(data.user.name);
      setHandle(data.user.handle || "");
      setSelectedAvatar(data.user.profileUrl || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvatars = async (page: number = 1) => {
    try {
      const response = await get<AvatarsResponse>("/api/avatars", { page });
      setAvatars((prev) =>
        page === 1 ? response.avatars : [...prev, ...response.avatars]
      );
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching avatars:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      setLoadingMore(true);
      fetchAvatars(currentPage + 1);
    }
  };

  const debouncedCheckHandle = useCallback(
    debounce(async (handleText: string) => {
      if (!handleText) {
        setIsHandleAvailable(null);
        setHandleError(null);
        return;
      }

      try {
        setIsCheckingHandle(true);
        const isAvailable = await HandleService.checkAvailability(handleText);
        setIsHandleAvailable(isAvailable);
        setHandleError(isAvailable ? null : "This handle is already taken");
      } catch (error) {
        console.error("Error checking handle availability:", error);
        setHandleError("Error checking handle availability");
      } finally {
        setIsCheckingHandle(false);
      }
    }, 500),
    []
  );

  // Handle text change with debouncing
  const handleHandleChange = (text: string) => {
    setHandle(text);
    debouncedCheckHandle(text);
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);

      // If handle has changed and is available, create it first
      let handleId = profile?.user.handle;
      if (handle && handle !== profile?.user.handle && isHandleAvailable) {
        const newHandle = await HandleService.createHandle(handle);
        handleId = newHandle.id;
      }

      await ProfileService.updateProfile({
        name,
        handle: handleId,
        profileUrl: selectedAvatar || undefined,
      });
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectAvatar = (avatarUrl: string) => {
    setPreviewAvatar(avatarUrl);
    setShowPreview(true);
  };

  const handleDone = () => {
    setSelectedAvatar(previewAvatar);
    setSelectedBase64(null);
    setShowPreview(false);
    setShowAvatarSelector(false);
  };

  const handleEdit = async () => {
    setShowPreview(false);

    try {
      const image = await ImageCropPicker.openCropper({
        path: previewAvatar!,
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: "photo",
      });
      setSelectedAvatar(image.path);
      setSelectedBase64(image.data);
      setShowAvatarSelector(false);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Edit Profile</Text>
        <TouchableOpacity
          className="ml-auto"
          onPress={handleUpdateProfile}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <View className="items-center p-4">
          <TouchableOpacity
            onPress={() => {
              setShowAvatarSelector(true);
              fetchAvatars(1);
            }}
          >
            <View className="w-24 h-24 rounded-full bg-gray-700 items-center justify-center overflow-hidden">
              {selectedAvatar ? (
                <Image
                  source={{ uri: selectedAvatar }}
                  className="w-full h-full"
                />
              ) : (
                <Ionicons name="person" size={48} color="white" />
              )}
            </View>
          </TouchableOpacity>
          <Text className="text-white mt-2">Change Profile Picture</Text>
        </View>

        <View className="px-4">
          <View className="mb-4">
            <Text className="text-gray-400 mb-2">Name</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#666"
            />
          </View>
          <View className="mb-4">
            <Text className="text-gray-400 mb-2">Handle</Text>
            <View className="relative">
              <TextInput
                className={`bg-gray-800 text-white p-3 rounded-lg ${
                  handleError
                    ? "border-red-500"
                    : isHandleAvailable
                    ? "border-green-500"
                    : ""
                }`}
                value={handle}
                onChangeText={handleHandleChange}
                placeholder="Enter your handle"
                placeholderTextColor="#666"
              />
              {isCheckingHandle && (
                <View className="absolute right-3 top-3">
                  <ActivityIndicator size="small" color="white" />
                </View>
              )}
              {!isCheckingHandle && handle && (
                <View className="absolute right-3 top-3">
                  {isHandleAvailable ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#22c55e"
                    />
                  ) : (
                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                  )}
                </View>
              )}
            </View>
            {handleError && (
              <Text className="text-red-500 text-sm mt-1">{handleError}</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Avatar Selector Bottom Sheet */}
      {showAvatarSelector && (
        <View className="absolute inset-0 bg-black/50">
          <TouchableOpacity
            className="flex-1"
            onPress={() => setShowAvatarSelector(false)}
          />
          <Animated.View
            className="bg-gray-900 rounded-t-3xl"
            style={{
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [400, 0],
                  }),
                },
              ],
            }}
          >
            <View className="flex-row items-center p-4 border-b border-gray-800">
              <Text className="text-white text-xl font-bold">
                Choose Avatar
              </Text>
              <TouchableOpacity
                className="ml-auto"
                onPress={() => setShowAvatarSelector(false)}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={avatars}
              numColumns={3}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="w-1/3 p-2"
                  onPress={() => handleSelectAvatar(item.imageUrl)}
                >
                  <View className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      source={{ uri: item.imageUrl }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                currentPage < totalPages ? (
                  <TouchableOpacity
                    className="items-center py-4"
                    onPress={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text className="text-white">Load More</Text>
                    )}
                  </TouchableOpacity>
                ) : null
              }
            />
          </Animated.View>
        </View>
      )}

      <Modal visible={showPreview} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/90 items-center justify-center">
          <View className="w-64 h-64 rounded-lg overflow-hidden mb-4">
            {previewAvatar && (
              <Image
                source={{ uri: previewAvatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
          </View>
          <View className="flex-row space-x-4 gap-4">
            <TouchableOpacity
              className="bg-white px-6 py-3 rounded-lg"
              onPress={handleDone}
            >
              <Text className="text-black font-bold">Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-800 px-6 py-3 rounded-lg"
              onPress={handleEdit}
            >
              <Text className="text-white font-bold">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
