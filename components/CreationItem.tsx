import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useRef } from "react";
import { TapGestureHandler, State } from "react-native-gesture-handler";

interface CreationItemProps {
  imageUrl: string;
  onComment?: () => void;
  onShare?: () => void;
}

const CreationItem = ({ imageUrl, onComment, onShare }: CreationItemProps) => {
  const screenWidth = Dimensions.get("window").width;
  const [isLiked, setIsLiked] = useState(false);
  const doubleTapRef = useRef();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  const onDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
    }

    const randomRotation = Math.random() * 60 - 30;
    rotation.setValue(randomRotation);

    const targetScale = isAnimating ? 1.5 : 1;

    scale.setValue(0);
    opacity.setValue(0);
    setIsAnimating(true);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: targetScale,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setIsAnimating(false);
        });
      }, 500);
    });
  };

  return (
    <View className="mb-4  rounded-[30px] overflow-hidden shadow-xl justify-center items-center flex shadow-black/50">
      <TapGestureHandler
        ref={doubleTapRef}
        numberOfTaps={2}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            onDoubleTap();
          }
        }}
      >
        <Animated.View>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: screenWidth - 40, height: screenWidth - 40 }}
            className="rounded-[30px]"
            resizeMode="cover"
          />
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              transform: [
                { scale },
                {
                  rotate: rotation.interpolate({
                    inputRange: [-30, 30],
                    outputRange: ["-30deg", "30deg"],
                  }),
                },
              ],
              opacity,
            }}
          >
            <View
              style={{
                shadowColor: "#ff0000",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <Ionicons name="heart" size={100} color="#ff0000" />
            </View>
          </Animated.View>
        </Animated.View>
      </TapGestureHandler>
      <View className="absolute bottom-0 right-0 left-0 p-2">
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
          className="absolute inset-0 rounded-lg"
        />
        <View className="flex-row justify-between items-center space-x-2">
          <TouchableOpacity className="ms-2">
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "red" : "white"}
              className="p-2"
            />
          </TouchableOpacity>
          <View className="flex-row gap-1">
            <TouchableOpacity onPress={onComment} className="p-2">
              <Ionicons name="chatbubble-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} className="p-2">
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CreationItem;
