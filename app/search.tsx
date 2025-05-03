import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/search/SearchResults";
import SearchSkeleton from "../components/search/SearchSkeleton";
import { searchCreations } from "../services/searchService";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsLoading(true);
      try {
        const results = await searchCreations(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults(null);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SearchBar
        onSearch={handleSearch}
        onBack={handleBack}
        autoFocus
        initialQuery={searchQuery}
      />
      {isLoading ? (
        <SearchSkeleton />
      ) : (
        <SearchResults results={searchResults} />
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