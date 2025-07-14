import React, { memo } from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView, View, Dimensions } from "react-native";
import { Avatar, Icon, Image, Text } from "react-native-elements";
const screenWidth = Dimensions.get("window").width;
export const LojaInfoComponent = ({ loja, onPress, regulamento }) => {
  return (
    <View
      style={{
        width: screenWidth,
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 12,
        paddingTop: 8,
      }}
    >
      <View
        style={{
          width: "15%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        {loja?.imagem !== null ? (
          <View style={{ marginLeft: 12 }}>
            <Avatar source={{ uri: loja?.imagem }} rounded size="medium" />
          </View>
        ) : (
          <View style={{ marginLeft: 12 }}>
            <Avatar icon={{ name: "home" }} rounded size="medium" />
          </View>
        )}
      </View>
      <View
        style={{
          width: "72%",
          paddingLeft: 12,
          paddingRight: 8,
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ fontSize: 18, fontWeight: "700" }}
        >
          {loja?.nomeFantasia}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: "#444444",
          }}
        >
          {loja?.endereco?.logradouro}, {loja?.endereco?.bairro},{" "}
          {loja?.endereco?.uf}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: "13%",
          height: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {regulamento ? (
          <Image
            source={require("../../assets/cards/regulamento.png")}
            style={{
              width: 40,
              height: 40,
              marginRight: 24,
            }}
          />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export const LojaInfo = memo(LojaInfoComponent);
