import React, { useMemo } from "react";
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
import LottieView from "lottie-react-native";
import { GradientButton } from "./GradientButton";
import CreationDialog from "./CreationDialog";
import CommentsBottomSheet from "./CommentsBottomSheet";
import ContentService from "../services/ContentService";

interface CreationItemProps {
  imageUrl: string;
  onComment?: () => void;
  onShare?: () => void;
  isPremium?: boolean;
  prompt?: string;
  liked?: boolean;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  creationId: string;
  className?: string;
}

const CreationItem = ({
  imageUrl,
  onComment,
  onShare,
  isPremium,
  prompt,
  user,
  creationId,
  liked,
  className = "",
}: CreationItemProps) => {
  const screenWidth = Dimensions.get("window").width;
  const [isLiked, setIsLiked] = useState(liked);
  const [showDialog, setShowDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const doubleTapRef = useRef();
  const lottieRef = useRef<LottieView>(null);
  const [showLottie, setShowLottie] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const snapPoints = useMemo(() => ["90%", "75%", "90%"], []);

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      if (!isLiked) {
        setShowLottie(true);
        lottieRef.current?.play();
        setTimeout(() => {
          setShowLottie(false);
        }, 2000);
      }
      await ContentService.getInstance().likeCreation(creationId);
    } catch (error) {
      setIsLiked(liked);
      console.error("Error liking creation:", error);
    }
  };

  const onDoubleTap = () => {
    if (!isLiked) {
      handleLike();
    }
  };

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => {
          console.log("Opening dialog");
          setShowDialog(true);
        }}
        activeOpacity={0.7}
      >
        <View
          className={`mb-4 overflow-hidden justify-center items-center flex ${className}`}
          style={{}}
        >
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
                resizeMode="cover"
              />
              {isPremium && (
                <TouchableOpacity
                  className="absolute top-3 left-3 z-10"
                  onPress={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <GradientButton
                    text="Premium"
                    onPress={() => {}}
                    isSelected={true}
                    className="py-0.5 px-2"
                    tooltipMessage="This is a premium image. You can purchase it for 100 tokens."
                    tooltipButtonName="Purchase"
                    showTooltip={showTooltip}
                    onTooltipButtonPress={() => {
                      console.log("Purchase clicked");
                    }}
                  />
                </TouchableOpacity>
              )}
              {showLottie && (
                <View className="absolute inset-0 justify-center items-center">
                  <LottieView
                    ref={lottieRef}
                    source={require("../assets/lottie/heart.json")}
                    autoPlay={false}
                    loop={false}
                    style={{ width: 200, height: 200 }}
                  />
                </View>
              )}
            </Animated.View>
          </TapGestureHandler>
          <View className="absolute bottom-0 right-0 left-0 p-2">
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
              className="absolute inset-0"
            />
            <View className="flex-row justify-between items-center space-x-2">
              <TouchableOpacity
                className="ms-2"
                onPress={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={24}
                  color={isLiked ? "red" : "white"}
                  className="p-2"
                />
              </TouchableOpacity>
              <View className="flex-row gap-1">
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setShowComments(true);
                  }}
                  className="p-2"
                >
                  <Ionicons name="chatbubble-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onShare?.();
                  }}
                  className="p-2"
                >
                  <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <CreationDialog
        visible={showDialog}
        onClose={() => {
          console.log("Closing dialog");
          setShowDialog(false);
        }}
        imageUrl={imageUrl}
        prompt={prompt || ""}
        isPremium={isPremium || false}
        user={user || { id: "", name: "", avatarUrl: "" }}
      />
      <CommentsBottomSheet
        creationId={creationId}
        isVisible={showComments}
        snapPoints={snapPoints}
        onClose={() => {
          setShowComments(false);
        }}
      />
    </React.Fragment>
  );
};

export default CreationItem;
