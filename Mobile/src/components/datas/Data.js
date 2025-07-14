import React, { memo } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Icon } from "react-native-elements";

export default function DataComponent({ data, periodo, onPress }) {
  return (
    <TouchableOpacity
      style={{
        height: 40,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <View style={{ flexDirection: "column", marginHorizontal: 8 }}>
        <Text style={{ color: "black", fontSize: 14, fontWeight: "600" }}>
          Data {periodo}
        </Text>
        <Text style={{ color: "black", fontWeight: "500" }}>{data}</Text>
      </View>
      <Icon name="calendar" color="black" type="ionicon" size={24} />
    </TouchableOpacity>
  );
}

export const Data = memo(DataComponent);
