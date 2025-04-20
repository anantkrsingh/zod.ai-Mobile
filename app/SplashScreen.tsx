import React, { useEffect, useRef } from "react";
import { checkSession } from "@/utils/auth";
import { router } from "expo-router";
import { Animated, Platform, StatusBar, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
function SplashScreen() {
  const cardRotation = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    checkSession().then((token) => {
      if (token) {
        router.replace("/home");
      } else {
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      }
    });
  }, []);

  const cardRotationInterpolate = cardRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["-20deg", "0deg"],
  });

  return (
    <View style={{ flex: 1 }}>
      <View
        className="flex-1 justify-center items-center"
        style={{
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <Animated.View
          className="relative"
          style={{
            transform: [
              { rotate: cardRotationInterpolate },
              { scale: cardScale },
            ],
          }}
        >
          <View
            className="rounded-3xl shadow-2xl overflow-hidden bg-white absolute"
            style={{
              transform: [
                { translateX: -104 },
                { rotate: "12deg" },
                { translateX: 110 },
              ],
            }}
          >
            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={["#080819", "#6d6d75"]}
              style={{ width: 150, height: 150 }}
            />
          </View>

          <View
            className="rounded-3xl shadow-xl overflow-hidden"
            style={{
              transform: [
                { translateX: -130 },
                { rotate: "-15deg" },
                { translateX: 100 },
                { translateY: 30 },
              ],
            }}
          >
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              tint="light"
              intensity={90}
              style={{
                width: 150,
                height: 150,
                borderRadius: 24,
              }}
              className="shadow-lg"
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

export default SplashScreen;
