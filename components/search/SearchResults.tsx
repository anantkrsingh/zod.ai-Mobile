import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import CreationDialog from "../CreationDialog";
interface User {
  id: string;
  name: string;
  handles: { handle: string }[];
  profileUrl: string;
  createdAt: string;
}

interface Creation {
  id: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    handles?: { handle: string }[];
    profileUrl?: string;
  };
  displayImage: string | null;
  image: {
    id: string;
    url: string;
    isPremium: boolean;
    prompt: string;
  };
  imageId: string;
  userId: string;
  isLiked: boolean;
}

interface SearchResultsProps {
  results: {
    message: string;
    data: {
      users: User[];
      creations: Creation[];
    };
  } | null;
}

const { width } = Dimensions.get("window");
const numColumns = 3;
const gap = 2;

export default function SearchResults({ results }: SearchResultsProps) {
  const router = useRouter();
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

  if (!results) return null;

  const renderUser = ({ item: user }: { item: User }) => (
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
  );

  const renderCreation = ({ item: creation }: { item: Creation }) => (
    <TouchableOpacity
      style={styles.creationItem}
      onPress={() => {
        setSelectedCreation({
          imageUrl: creation.displayImage || creation.image.url,
          prompt: creation.image.prompt,
          isPremium: creation.image.isPremium,
          user: creation.createdBy,
        });
      }}
    >
      <Image
        source={{ uri: creation.displayImage || creation.image.url }}
        style={styles.creationImage}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {results.data.users.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Users</Text>
          <FlatList
            data={results.data.users}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      )}

      {results.data.creations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creations</Text>
          <FlatList
            data={results.data.creations}
            renderItem={renderCreation}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
          />
        </View>
      )}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  creationItem: {
    width: (width - (numColumns + 1) * gap) / numColumns,
    aspectRatio: 1,
    margin: gap / 2,
  },
  creationImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
}); 