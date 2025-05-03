import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TooltipProps {
  message: string;
  onClose: () => void;
  buttonName?: string;
  onButtonPress?: () => void;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  message, 
  onClose, 
  buttonName,
  onButtonPress 
}) => {
  return (
    <View className="absolute -top-28 left-0 z-50 w-64">
      <View className="bg-[#1E1E1E] p-3 rounded-lg border border-white/10 shadow-lg">
        <View className="flex-row items-center mb-2">
          <Ionicons name="information-circle" size={16} color="#FFD700" />
          <Text className="text-white text-xs ml-2 flex-1" numberOfLines={3}>{message}</Text>
          <TouchableOpacity onPress={onClose} className="ml-2">
            <Ionicons name="close" size={16} color="white" />
          </TouchableOpacity>
        </View>
        {buttonName && onButtonPress && (
          <TouchableOpacity
            onPress={onButtonPress}
            className="bg-[#FFD700] py-1 px-3 rounded-full items-center"
          >
            <Text className="text-black text-xs font-bold">{buttonName}</Text>
          </TouchableOpacity>
        )}
        <View className="absolute -bottom-2 left-4 w-3 h-3 bg-[#1E1E1E] border-r border-b border-white/10 transform rotate-45" />
      </View>
    </View>
  );
}; 