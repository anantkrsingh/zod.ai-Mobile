import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { debounce } from "../utils/debounce";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onBack?: () => void;
  autoFocus?: boolean;
  initialQuery?: string;
}

const searchSuggestions = [
  "Search for @user",
  "Search for image",
  "Search in creations",
];

export default function SearchBar({ 
  onSearch, 
  onBack,
  autoFocus = false,
  initialQuery = "",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(autoFocus);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);

  const debouncedSearch = useRef(
    debounce((query: string) => {
      if (onSearch) {
        onSearch(query);
      }
    }, 500)
  ).current;

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      debouncedSearch(text);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleContainerPress = () => {
    if (!isFocused) {
      inputRef.current?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.searchContainer,
          {
            transform: [{ scale: scaleAnim }],
            borderColor: isFocused ? "#4a90e2" : "#2a2a2a",
          },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.inputContainer} 
          onPress={() => {
            if (!isFocused) {
              onSearch?.("");
            }
          }}
          activeOpacity={1}
        >
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=""
            autoFocus={autoFocus}
          />
          {!isFocused && searchQuery === "" && (
            <Animated.View
              style={[
                styles.placeholderContainer,
                {
                  transform: [{ translateY: slideAnim }],
                  opacity: fadeAnim,
                },
              ]}
            >
              <Text style={styles.placeholderText}>
                {searchSuggestions[currentSuggestionIndex]}
              </Text>
            </Animated.View>
          )}
        </TouchableOpacity>
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearch("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: "#000",
  },
  searchContainer: {
    position: "relative",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    height: 40,
  },
  input: {
    color: "#fff",
    fontSize: 16,
    paddingRight: 8,
    height: "100%",
    textAlign: "left",
  },
  placeholderContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
    textAlign: "left",
    paddingLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
});
