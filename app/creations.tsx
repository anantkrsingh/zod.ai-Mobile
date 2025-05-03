import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import ContentService from "../services/ContentService";
import { format } from "date-fns";
import CreationItem from "../components/CreationItem";
import SearchBar from "../components/SearchBar";
import { searchCreations } from "../services/searchService";
import CommentsBottomSheet from "@/components/CommentsBottomSheet";

interface CreationImage {
  id: string;
  url: string;
  isPremium: boolean;
  prompt: string;
}

interface CreatedBy {
  id: string;
  name: string;
  handles?: { handle: string }[];
  profileUrl?: string;
}

interface Creation {
  id: string;
  createdAt: string;
  createdBy: CreatedBy;
  displayImage: string | null;
  image: CreationImage;
  imageId: string;
  userId: string;
  isLiked: boolean;
}

interface User {
  id: string;
  name: string;
  handles: { handle: string }[];
  profileUrl: string;
  createdAt: string;
}

interface SearchResponse {
  message: string;
  data: {
    users: User[];
    creations: Creation[];
  };
}

interface GetCreationsResponse {
  creations: Creation[];
  currentPage: number;
  totalCreations: number;
  totalPages: number;
}

export default function Creations() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCreationId, setSelectedCreationId] = useState<string | null>(
    null
  );
  const [showComments, setShowComments] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );
  const router = useRouter();

  const contentService = ContentService.getInstance();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = (await searchCreations(query)) as SearchResponse;
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      setSearchResults(null);
    }
  };

  const handleSearchFocusChange = (isFocused: boolean) => {
    setIsSearchFocused(isFocused);
    if (!isFocused) {
      setSearchResults(null);
    }
  };

  const fetchCreations = async (
    pageNum: number,
    isRefreshing: boolean = false,
    search: string = ""
  ) => {
    try {
      setLoading(true);
      const response = await contentService.getCreations(pageNum, search);
      if (isRefreshing) {
        setCreations(response.creations);
      } else {
        setCreations((prev) => [...prev, ...response.creations]);
      }

      setHasMore(response.currentPage < response.totalPages);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching creations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCreations(page);
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchCreations(1, true);
  };

  const handleSearchPress = useCallback(() => {
    router.push("/search");
  }, [router]);

  const handleCommentPress = (creationId: string) => {
    setSelectedCreationId(creationId);
    setShowComments(true);
  };

  const renderItem = ({ item }: { item: Creation }) => (
    <View className="p-5">
      <CreationItem
        imageUrl={item.displayImage || item.image.url}
        onComment={() => handleCommentPress(item.id)}
        onShare={() => console.log("Share pressed")}
        isPremium={item.image.isPremium}
        prompt={item.image.prompt}
        user={item.createdBy}
        creationId={item.id}
        liked={item.isLiked}
        className=""
      />
    </View>
  );

  const renderSearchResults = () => {
    if (!searchResults) return null;

    return (
      <View className="flex-1">
        {searchResults.data.users.length > 0 && (
          <View className="mb-4">
            <Text className="text-white text-lg font-bold px-5 py-2">
              Users
            </Text>
            {searchResults.data.users.map((user) => (
              <TouchableOpacity
                key={user.id}
                className="flex-row items-center p-5 border-b border-gray-800"
                onPress={() => router.push(`/user-profile?userId=${user.id}`)}
              >
                <Image
                  source={{ uri: user.profileUrl }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <View>
                  <Text className="text-white font-medium">{user.name}</Text>
                  <Text className="text-gray-400">
                    @{user.handles[0]?.handle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {searchResults.data.creations.length > 0 && (
          <View>
            <Text className="text-white text-lg font-bold px-5 py-2">
              Creations
            </Text>
            {searchResults.data.creations.map((creation) => (
              <View key={creation.id} className="">
                <CreationItem
                  imageUrl={creation.displayImage || creation.image.url}
                  onComment={() => handleCommentPress(creation.id)}
                  onShare={() => console.log("Share pressed")}
                  isPremium={creation.image.isPremium}
                  prompt={creation.image.prompt}
                  user={creation.createdBy}
                  creationId={creation.id}
                  liked={creation.isLiked}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View className="py-4">
        <ActivityIndicator color="white" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearchPress} />
      {isSearchFocused ? (
        renderSearchResults()
      ) : (
        <FlatList
          data={creations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="white"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
