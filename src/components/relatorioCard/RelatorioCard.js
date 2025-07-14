import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "react-native-elements";

export function RelatorioCardComponent({ onPress, title, source, disabled }) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: disabled ? "darkgrey" : "#005098",
        borderWidth: 1,
        width: 150,
        height: 150,
        marginHorizontal: 10,
        elevation: 4,
        borderRadius: 12,
        flexDirection: "column",
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={{
          height: "50%",
          flexDirection: "row-reverse",
        }}
      >
        <Image style={{
          margin: 12, width: 40, height: 40,
          tintColor: disabled ? "darkgrey" : null
        }} source={source} />
      </View>
      <View
        style={{
          height: "50%",
          flexDirection: "column-reverse",
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            margin: 16,
            fontWeight: "600",
            color: disabled ? "darkgrey" : "#005098",
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export const RelatorioCard = memo(RelatorioCardComponent);
