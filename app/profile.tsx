import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import ProfileService, { UserProfile } from "../services/ProfileService";
import AuthService from "../services/AuthService";
import { format, isValid } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { PurchaseBottomSheet } from "../components/PurchaseBottomSheet";
import CreationDialog from "../components/CreationDialog";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseSheet, setShowPurchaseSheet] = useState(false);
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

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await ProfileService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
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
      {/* Logout Button */}
      <TouchableOpacity
        className="absolute top-4 right-4 z-10"
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Profile Header */}
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

        {/* Token Chips */}
        <View className="flex-row mt-4 space-x-2 gap-2">
          <TouchableOpacity onPress={() => setShowPurchaseSheet(true)}>
            <LinearGradient
              colors={["rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="px-4 py-2 rounded-full border border-blue-500/30 overflow-hidden"
            >
              <Text className="text-blue-400 text-sm">
                {profile?.user.tokens || 0} Regular Tokens
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowPurchaseSheet(true)}>
            <LinearGradient
              colors={["rgba(234, 179, 8, 0.2)", "rgba(234, 179, 8, 0.1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="px-4 py-2 rounded-full border border-yellow-800 overflow-hidden"
            >
              <Text className="text-yellow-600 text-sm">
                {profile?.user.premiumTokens || 0} Premium Tokens
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="flex-row items-center mt-4 px-6 py-2 bg-white/10 rounded-full"
          onPress={() => router.push("/update-profile")}
        >
          <Ionicons name="create-outline" size={16} color="white" />
          <Text className="text-white ml-2">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Creations Grid */}
      <View className="flex-1 px-4">
        <Text className="text-white text-lg font-bold mb-4">My Creations</Text>
        <FlatList
          data={profile?.user?.creations}
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
                  user: {
                    id: profile?.user.id || "",
                    name: profile?.user.name || "",
                    profileUrl: profile?.user.profileUrl,
                  },
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

      <PurchaseBottomSheet
        visible={showPurchaseSheet}
        onClose={() => setShowPurchaseSheet(false)}
      />

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
