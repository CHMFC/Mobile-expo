import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";
import { Avatar, Image, Text } from "react-native-elements";

const ProdutoCardComponent = ({ produto, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor:
          produto?.tiposPontos === "produto" ? "white" : "#C8E9FF",
        width: "100%",
        height: 80,
        paddingTop: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#005098",
      }}
      activeOpacity={0.6}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {produto?.imagem ? (
            <Avatar
              source={{ uri: produto?.imagem }}
              rounded
              size="medium"
              containerStyle={{ marginHorizontal: 8, marginLeft: 16 }}
            />
          ) : (
            <Avatar
              source={require("../../assets/mapavazio.png")}
              rounded
              size="medium"
              containerStyle={{ marginHorizontal: 8, marginLeft: 16 }}
            />
          )}
        </View>
        <View
          style={{
            flex: 3,
          }}
        >
          <View style={{ marginLeft: 6 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                maxWidth: "100%",
                color: "#005098",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {produto?.nome}
            </Text>

            {produto?.pontosConsumacao !== 0 && (
              <Text style={{ color: "black", fontWeight: "300" }}>
                Adquira e ganhe{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {produto?.pontosConsumacao}{" "}
                  {produto?.tiposPontos === "manuais" ? "pontos" : "tickets"}
                </Text>
              </Text>
            )}

            {produto?.pontosResgate !== 0 && (
              <Text style={{ color: "black", fontWeight: "300" }}>
                Resgatar por{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {produto?.pontosResgate}{" "}
                  {produto?.tiposPontos === "manuais" ? "pontos" : "tickets"}
                </Text>
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {produto?.tiposPontos === "produto" ? (
            <Image
              source={require("../../assets/cards/pontos-produto.png")}
              style={{ width: 32, height: 32 }}
            />
          ) : (
            <Image
              source={require("../../assets/cards/pontos-consumo.png")}
              style={{ width: 32, height: 32 }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ProdutoCard = memo(ProdutoCardComponent);
