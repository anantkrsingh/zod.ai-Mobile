import { View, Text } from "react-native";
import "./globals.css";
import { verifyInstallation } from "nativewind";
import LoginScreen from "./login";

export default function Index() {
  verifyInstallation();
  return <LoginScreen />;
}
