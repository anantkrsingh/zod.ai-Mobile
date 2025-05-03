import React, { useEffect, useRef } from "react";
import { checkSession } from "@/utils/auth";
import { router } from "expo-router";
import { Animated, Platform, StatusBar, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start the animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    checkSession().then((token) => {
      if (token) {
        // Fade out before navigation
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          router.replace("/home");
        });
      } else {
        setTimeout(() => {
          // Fade out before navigation
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            router.replace("/login");
          });
        }, 5000);
      }
    });
  }, []);

  return (
    <Animated.View 
      style={{ 
        flex: 1, 
        backgroundColor: '#080819', 
        opacity: fadeAnim 
      }}
    >
      <View
        className="flex-1 justify-center items-center"
        style={{
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          <View className="rounded-3xl overflow-hidden shadow-2xl">
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={["#080819", "#6d6d75", "#080819"]}
              style={{ width: 200, height: 200 }}
            />
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export default SplashScreen;
