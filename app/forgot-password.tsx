import { View, Text, TextInput, TouchableOpacity, Platform, StatusBar, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  // Animation values
  const cardRotation = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.8)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const inputFocus = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations with staggered timing
    Animated.stagger(200, [
      Animated.parallel([
        Animated.spring(cardRotation, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(formTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleResetPassword = () => {
    // Button press animation with spring
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log("Reset password for:", email);
    });
  };

  const handleInputFocus = () => {
    Animated.spring(inputFocus, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = () => {
    Animated.spring(inputFocus, {
      toValue: 0,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const cardRotationInterpolate = cardRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-20deg', '0deg'],
  });

  const inputScale = inputFocus.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      {/* Top half with card stack */}
      <View className="flex-1 justify-center items-center" style={{ marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <Animated.View className="relative" style={{
          transform: [
            { rotate: cardRotationInterpolate },
            { scale: cardScale }
          ],
        }}>
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

      {/* Bottom half with reset form */}
      <Animated.View 
        className="min-h-[50%] bg-black rounded-t-[40px] p-6"
        style={{
          opacity: formOpacity,
          transform: [{ translateY: formTranslateY }],
        }}
      >
        <Text className="text-white text-3xl font-bold text-center mb-4">
          Reset Password
        </Text>
        <Text className="text-gray-400 text-center mb-8">
          Enter your email address and we'll send you a link to reset your password
        </Text>

        <Animated.View style={{ transform: [{ scale: inputScale }] }}>
          <TextInput
            className="bg-gray-800 text-white rounded-xl px-4 h-14 mb-6"
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            className="bg-white rounded-xl h-14 mb-4 justify-center"
            onPress={handleResetPassword}
          >
            <Text className="text-black text-center font-semibold text-lg">
              Send Reset Link
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          className="mt-4 mb-4"
          onPress={() => router.back()}
        >
          <Text className="text-gray-400 text-center">
            Back to Login
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
} 