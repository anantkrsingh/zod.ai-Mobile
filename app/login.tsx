import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import { loginGoogle } from "@/utils/auth";
import AuthService from "@/services/AuthService";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const cardRotation = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.8)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const inputFocus = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "670526577063-lt72on2ejdi12ffkrq4cjorc4bskc9jg.apps.googleusercontent.com",
    });
  }, []);

  useEffect(() => {
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

  const handleGoogleLogin = async () => {
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
    ]).start();

    try {
      setError("");
      setIsLoading(true);
      await loginGoogle();
      router.replace("/home");
    } catch (error: any) {
      setError(error.message || "Failed to login with Google");
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (isLogin: boolean) => {
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
    ]).start(async () => {});
    try {
      setError("");
      setIsLoading(true);
      if (isLogin) {
        await AuthService.login({ email, password });
        console.log("Login successful");
        router.replace("/home");
      } else {
        await AuthService.signup({ email, password, name });
        console.log("Signup successful");
        router.replace("/home");
      }
    } catch (error: any) {
      setError(error.message || "Failed to login");
      console.log(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(formTranslateY, {
          toValue: 20,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsLogin(!isLogin);
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(formTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
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
    outputRange: ["-20deg", "0deg"],
  });

  const inputScale = inputFocus.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" />
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

      <Animated.View
        className="min-h-[60%] bg-black rounded-t-[40px] p-6"
        style={{
          opacity: formOpacity,
          transform: [{ translateY: formTranslateY }],
        }}
      >
        <Text className="text-white text-3xl font-bold text-center mb-8">
          {isLogin ? "Welcome Back" : "Create Account"}
        </Text>

        {error ? (
          <View className="bg-red-500/20 p-3 rounded-lg mb-4">
            <Text className="text-red-400 text-center">{error}</Text>
          </View>
        ) : null}

        <View className="space-y-4 mb-6 gap-4">
          {!isLogin && (
            <Animated.View
              style={{
                opacity: formOpacity,
                transform: [{ translateY: formTranslateY }],
              }}
            >
              <Animated.View style={{ transform: [{ scale: inputScale }] }}>
                <TextInput
                  className="bg-gray-800 text-white rounded-xl px-4 h-14"
                  placeholder="Full Name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </Animated.View>
            </Animated.View>
          )}
          <Animated.View style={{ transform: [{ scale: inputScale }] }}>
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 h-14"
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
          <Animated.View style={{ transform: [{ scale: inputScale }] }}>
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 h-14"
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </Animated.View>
        </View>

        {isLogin && (
          <TouchableOpacity
            className="mb-4"
            onPress={() => router.push("/forgot-password")}
          >
            <Text className="text-gray-400 text-right">Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            className="bg-white rounded-xl h-14 mb-4 justify-center"
            onPress={() => handleEmailLogin(isLogin)}
          >
            <Text className="text-black text-center font-semibold text-lg">
              {isLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            className="bg-gray-800 rounded-xl h-14 flex-row items-center justify-center"
            onPress={handleGoogleLogin}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg ml-2">
                Continue with Google
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Toggle between Login and Signup */}
        <TouchableOpacity className="mt-4 mb-4" onPress={handleToggleMode}>
          <Text className="text-gray-400 text-center">
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
