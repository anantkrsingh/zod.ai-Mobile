import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { useEffect, useRef } from "react";

const { width } = Dimensions.get("window");
const numColumns = 3;
const gap = 2;

export default function SearchSkeleton() {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
    return () => fadeAnim.stopAnimation();
  }, []);

  const renderUserSkeleton = () => (
    <View style={styles.userSkeleton}>
      <Animated.View
        style={[
          styles.avatarSkeleton,
          { opacity: fadeAnim },
        ]}
      />
      <View style={styles.userInfoSkeleton}>
        <Animated.View
          style={[
            styles.nameSkeleton,
            { opacity: fadeAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.handleSkeleton,
            { opacity: fadeAnim },
          ]}
        />
      </View>
    </View>
  );

  const renderCreationSkeleton = () => (
    <Animated.View
      style={[
        styles.creationSkeleton,
        { opacity: fadeAnim },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionTitle} />
        {[1, 2, 3].map((i) => (
          <View key={`user-${i}`}>{renderUserSkeleton()}</View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitle} />
        <View style={styles.gridContainer}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={`creation-${i}`} style={styles.gridItem}>
              {renderCreationSkeleton()}
            </View>
          ))}
        </View>
      </View>
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
    height: 24,
    width: 100,
    backgroundColor: "#333",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 4,
  },
  userSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatarSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 12,
  },
  userInfoSkeleton: {
    flex: 1,
  },
  nameSkeleton: {
    height: 16,
    width: 120,
    backgroundColor: "#333",
    borderRadius: 4,
    marginBottom: 8,
  },
  handleSkeleton: {
    height: 14,
    width: 80,
    backgroundColor: "#333",
    borderRadius: 4,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  gridItem: {
    width: (width - (numColumns + 1) * gap) / numColumns,
    aspectRatio: 1,
    margin: gap / 2,
  },
  creationSkeleton: {
    width: "100%",
    height: "100%",
    backgroundColor: "#333",
    borderRadius: 8,
  },
}); 