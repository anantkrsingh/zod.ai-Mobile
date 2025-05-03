import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import {
  Notification,
  fetchNotifications,
  updateNotification,
  NotificationsResponse,
} from "../services/notifications";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadNotifications = async (
    pageNum: number = 1,
    shouldRefresh: boolean = false
  ) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetchNotifications(pageNum);
      setTotalPages(response.totalPages);

      if (shouldRefresh) {
        setNotifications(response.notifications);
      } else {
        setNotifications((prev) => [...prev, ...response.notifications]);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    loadNotifications(1, true);
  }, []);

  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNotifications(nextPage);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await updateNotification(notificationId, {
        isRead: true,
        dismissed: false,
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDismiss = async (notificationId: string) => {
    try {
      await updateNotification(notificationId, {
        isRead: true,
        dismissed: true,
      });
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case "heart":
        return <Ionicons name="heart" size={24} color="black" />;
      case "comment":
        return <Ionicons name="chatbubble" size={24} color="black" />;
      case "follow":
        return <Ionicons name="person-add" size={24} color="black" />;
      default:
        return <Ionicons name="notifications" size={24} color="black" />;
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <View
      className={`mb-4 p-4 rounded-2xl ${
        item.isRead ? "bg-white" : "bg-gray-100"
      } shadow-sm border border-gray-200`}
    >
      <View className="flex-row items-start">
        <View className="w-12 h-12 rounded-full bg-white border border-gray-200 items-center justify-center mr-4">
          {getIconComponent(item.icon)}
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-black mb-1">
            {item.title}
          </Text>
          <Text className="text-gray-700 mb-2">{item.message}</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-500 text-xs">
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
              })}
            </Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => handleMarkAsRead(item.id)}
                className="p-2 rounded-full bg-gray-800"
              >
                <Ionicons name="checkmark" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDismiss(item.id)}
                className="p-2 rounded-full bg-gray-800"
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="black" />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["black"]}
            tintColor="black"
          />
        }
      />
    </View>
  );
}
