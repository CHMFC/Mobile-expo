import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Icon, Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

const OpcoesLojaButton = ({ label, onPress, disabled }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        width: "100%",
        paddingHorizontal: 22,
        paddingTop: 32,
        paddingBottom: 16,
        backgroundColor: "#ffffff",
        borderBottomWidth: 0.5,
        borderBottomColor: disabled ? "darkgrey" : "#005098",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", color: disabled ? "darkgrey" : "#005098" }}>
          {label}
        </Text>
        <Icon type="ionicon" name="chevron-forward-outline" color={disabled ? "darkgrey" : "#005098"} />
      </View>
    </TouchableOpacity>
  );
};

export default OpcoesLojaButton;
