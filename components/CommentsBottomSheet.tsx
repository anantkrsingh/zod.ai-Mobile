import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetFlashList,
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import ContentService from "../services/ContentService";
import { Comment as CommentType } from "../types/comment";

interface CommentsBottomSheetProps {
  creationId: string;
  isVisible: boolean;
  snapPoints: string[];
  onClose: () => void;
}

const CommentsBottomSheet: React.FC<CommentsBottomSheetProps> = ({
  creationId,
  isVisible,
  onClose,
  snapPoints,
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const flatListRef = useRef<BottomSheetFlatListMethods>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const commentsCache = useRef<
    Record<string, { comments: CommentType[]; page: number; hasMore: boolean }>
  >({});

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      fetchComments(1);

      console.log(creationId);
    }
  }, [isVisible, creationId]);

  const fetchComments = useCallback(
    async (pageNum: number = 1, shouldAppend: boolean = false) => {
      try {
        setError(null);
        if (pageNum === 1) setIsLoading(true);
        else setIsLoadingMore(true);

        const response = await ContentService.getInstance().getComments(
          creationId,
          pageNum
        );
        console.log(response);

        if (shouldAppend) {
          setComments((prev) => [...prev, ...response.comments]);
        } else {
          setComments(response.comments);
        }

        setHasMore(response.currentPage < response.totalPages);
        setPage(pageNum);

        commentsCache.current[creationId] = {
          comments: shouldAppend
            ? [...comments, ...response.comments]
            : response.comments,
          page: pageNum,
          hasMore: response.currentPage < response.totalPages,
        };
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to load comments. Please try again.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [creationId]
  );

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setError(null);
      setIsSubmitting(true);
      const comment = await ContentService.getInstance().addComment(
        creationId,
        newComment
      );
      setComments((prev) => [comment.comment, ...prev]);
      setNewComment("");
      Keyboard.dismiss();
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchComments(page + 1, true);
    }
  };

  const renderComment = ({ item }: { item: CommentType }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Text style={styles.userName}>{item?.user?.name}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleDateString() +
            " " +
            new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </Text>
      </View>
      <Text style={styles.commentText}>{item.comment}</Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{error || "No comments yet"}</Text>
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      enableDynamicSizing={false}
      snapPoints={snapPoints}
      backdropComponent={BottomSheetBackdrop}
      onDismiss={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {isLoading && page === 1 ? (
            <View style={styles.skeletonContainer}>
              {[...Array(3)].map((_, index) => (
                <View key={index} style={styles.skeletonComment}>
                  <View style={styles.skeletonHeader} />
                  <View style={styles.skeletonText} />
                </View>
              ))}
            </View>
          ) : (
            <BottomSheetFlatList
              ref={flatListRef}
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={renderEmpty}
              contentContainerStyle={styles.listContent}
              style={styles.list}
              showsVerticalScrollIndicator={true}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            defaultValue={newComment}
            onChangeText={(text) => setNewComment(text)}
            placeholder="Add a comment..."
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Ionicons
                name="send"
                size={24}
                color={newComment.trim() ? "#007AFF" : "#999"}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  commentContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userName: {
    fontWeight: "bold",
  },
  timestamp: {
    color: "#666",
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonComment: {
    marginBottom: 16,
  },
  skeletonHeader: {
    height: 20,
    width: "40%",
    backgroundColor: "#eee",
    marginBottom: 8,
    borderRadius: 20,
  },
  skeletonText: {
    height: 16,
    width: "80%",
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});

export default CommentsBottomSheet;
