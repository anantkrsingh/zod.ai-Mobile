import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { get } from "../utils/api";
import ProfileService from "../services/ProfileService";

interface Avatar {
  id: string;
  url: string;
}

interface AvatarsResponse {
  avatars: Avatar[];
  currentPage: number;
  totalAvatars: number;
  totalPages: number;
}

export default function UpdateProfileImageScreen() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAvatars();
  }, []);

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
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      setLoadingMore(true);
      fetchAvatars(currentPage + 1);
    }
  };

  const handleSelectAvatar = async (avatarUrl: string) => {
    try {
      await ProfileService.updateProfileImage(avatarUrl);
      router.back();
    } catch (error) {
      console.error("Error updating profile image:", error);
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
        <Text className="text-white text-xl font-bold ml-4">Choose Avatar</Text>
      </View>

      <FlatList
        data={avatars}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="w-1/3 p-2"
            onPress={() => handleSelectAvatar(item.url)}
          >
            <View className="aspect-square rounded-lg overflow-hidden">
              <Image
                source={{ uri: item.url }}
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
    </View>
  );
}
