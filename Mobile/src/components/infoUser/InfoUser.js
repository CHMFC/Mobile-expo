import React, { memo } from "react";
import { Dimensions } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "react-native-elements";

const { width } = Dimensions.get("window");

export default function InfoUserComponent({
  imagem,
  nome,
  texto,
  onPress,
  widthNav,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 100,
        width: width,
        maxWidth: "90%",
      }}
    >
      {imagem ? (
        <Avatar
          rounded
          size={64}
          source={{ uri: imagem }}
          containerStyle={{ backgroundColor: "gray", marginRight: 16 }}
        />
      ) : (
        <Avatar
          rounded
          size={64}
          icon={{ name: "user", type: "font-awesome" }}
          containerStyle={{ backgroundColor: "gray", marginRight: 16 }}
        />
      )}

      <View style={{ flexDirection: "column", maxWidth: "70%" }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
          {nome}
        </Text>

        <TouchableOpacity
          onPress={onPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: widthNav,
          }}
        >
          <Text style={{ color: "white" }}>{texto}</Text>
          <Icon
            name="chevron-forward-sharp"
            size={14}
            style={{ marginTop: 4 }}
            type="ionicon"
            color={"#ffffff"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const InfoUser = memo(InfoUserComponent);
