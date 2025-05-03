import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Tooltip } from "./Tooltip";

interface GradientButtonProps {
  text: string;
  onPress: () => void;
  isSelected?: boolean;
  colors?: string[];
  textColor?: string;
  className?: string;
  showTooltip?: boolean;
  tooltipMessage?: string;
  tooltipButtonName?: string;
  onTooltipButtonPress?: () => void;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  text,
  onPress,
  isSelected = false,
  colors = ["#FFD700", "#FFA500"],
  textColor = "black",
  className = "",
  showTooltip = false,
  tooltipMessage = "",
  tooltipButtonName,
  onTooltipButtonPress,
}) => {
  const [showTooltipState, setShowTooltipState] = useState(showTooltip);

  useEffect(() => {
    setShowTooltipState(showTooltip);
  }, [showTooltip]);

  const handlePress = () => {
    if (showTooltip) {
      setShowTooltipState(true);
    } else {
      onPress();
    }
  };

  if (isSelected) {
    return (
      <View className="relative">
        {showTooltipState && (
          <Tooltip
            message={tooltipMessage}
            onClose={() => setShowTooltipState(false)}
            buttonName={tooltipButtonName}
            onButtonPress={onTooltipButtonPress}
          />
        )}
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className={`py-0.5 px-2 ${className}`}
          style={{ borderRadius: 9999 }}
        >
          <Text className={`text-xs font-bold text-${textColor}`}>{text}</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="relative">
      {showTooltipState && (
        <Tooltip
          message={tooltipMessage}
          onClose={() => setShowTooltipState(false)}
          buttonName={tooltipButtonName}
          onButtonPress={onTooltipButtonPress}
        />
      )}
      <TouchableOpacity
        onPress={handlePress}
        className={`py-0.5 px-2 rounded-full items-center bg-white/10 ${className}`}
      >
        <Text className="text-xs font-bold text-white">{text}</Text>
      </TouchableOpacity>
    </View>
  );
};
