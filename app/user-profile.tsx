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
import { router, useLocalSearchParams } from "expo-router";
import { get } from "../utils/api";
import { format, isValid } from "date-fns";
import CreationDialog from "../components/CreationDialog";

interface UserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    handle?: string;
    profileUrl?: string;
    createdAt: string;
  };
  creations: {
    id: string;
    displayImage: string;
    createdAt: string;
    image: {
      id: string;
      url: string;
      isPremium: boolean;
      prompt: string;
    };
    createdBy: {
      id: string;
      name: string;
      profileUrl?: string;
    };
  }[];
}

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCreation, setSelectedCreation] = useState<{
    imageUrl: string;
    prompt: string;
    isPremium: boolean;
    user: {
      id: string;
      name: string;
      profileUrl?: string;
    };
  } | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await get<UserProfile>(`/api/auth/${userId}/profile`);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy") : "";
  };

  const formatJoinDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMMM yyyy") : "";
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
      <TouchableOpacity
        className="absolute top-4 left-4 z-10"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View className="items-center pt-16 pb-8">
        <View className="w-24 h-24 rounded-full bg-gray-700 items-center justify-center overflow-hidden">
          {profile?.user.profileUrl ? (
            <Image
              source={{ uri: profile.user.profileUrl }}
              className="w-full h-full"
            />
          ) : (
            <Ionicons name="person" size={48} color="white" />
          )}
        </View>
        <Text className="text-white text-xl font-bold mt-4">
          {profile?.user.name}
        </Text>
        <Text className="text-gray-400 text-sm">{profile?.user.email}</Text>
        <Text className="text-gray-500 text-xs mt-1">
          Joined {formatJoinDate(profile?.user.createdAt)}
        </Text>
      </View>

      {/* Creations Grid */}
      <View className="flex-1 px-4">
        <Text className="text-white text-lg font-bold mb-4">Creations</Text>
        <FlatList
          data={profile?.creations}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="w-1/2 p-2"
              onPress={() => {
                setSelectedCreation({
                  imageUrl: item.displayImage,
                  prompt: item.image.prompt,
                  isPremium: item.image.isPremium,
                  user: item.createdBy,
                });
              }}
            >
              <View className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  source={{ uri: item.displayImage }}
                  className="w-full h-full"
                />
              </View>
              <Text className="text-gray-400 text-xs mt-2">
                {formatDate(item.createdAt)}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-400">No creations yet</Text>
            </View>
          }
        />
      </View>

      {selectedCreation && (
        <CreationDialog
          visible={!!selectedCreation}
          onClose={() => setSelectedCreation(null)}
          imageUrl={selectedCreation.imageUrl}
          prompt={selectedCreation.prompt}
          isPremium={selectedCreation.isPremium}
          user={selectedCreation.user}
        />
      )}
    </View>
  );
}
