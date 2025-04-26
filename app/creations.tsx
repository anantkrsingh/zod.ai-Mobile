import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import ContentService from "../services/ContentService";
import { format } from "date-fns";
import CreationItem from "../components/CreationItem";

interface Creation {
  id: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  displayImage: string | null;
  image: {
    id: string;
    url: string;
  };
  imageId: string;
  userId: string;
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
  const router = useRouter();

  const contentService = ContentService.getInstance();

  const fetchCreations = async (
    pageNum: number,
    isRefreshing: boolean = false
  ) => {
    try {
      setLoading(true);
      const response = await contentService.getCreations(pageNum);
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

  const renderItem = ({ item }: { item: Creation }) => (
    <View className="p-5">
      <CreationItem
        imageUrl={item.displayImage || item.image.url}
        onComment={() => console.log("Comment pressed")}
        onShare={() => console.log("Share pressed")}
      />
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View className="py-4">
        <ActivityIndicator color="white" />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
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
    </View>
  );
}
