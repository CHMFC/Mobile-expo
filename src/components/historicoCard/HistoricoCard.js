import React from "react";
import { memo } from "react";
import { View, Text } from "react-native";
import { Avatar } from "react-native-elements";

export default function HistoricoCardComponent({ item }) {
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#005098",
        paddingVertical: 2,
      }}
    >
      <View
        key={item?.id}
        style={{
          width: "95%",
          paddingTop: 16,
          paddingBottom: 16,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        {item?.imagemProduto ? (
          <Avatar
            source={{ uri: item?.imagemProduto }}
            rounded
            size="medium"
            containerStyle={{ marginHorizontal: 8 }}
          />
        ) : (
          <Avatar
            icon={{ name: "home", color: "#FFFFFF", type: "font-awesome" }}
            overlayContainerStyle={{ backgroundColor: "#005098" }}
            rounded
            size="medium"
            containerStyle={{ marginHorizontal: 8 }}
          />
        )}
        <View>
          {item?.tipo === "manual" ? (
            <Text
              style={{
                maxWidth: "95%",
                color: "#000000",
                marginHorizontal: 16,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Pontos
            </Text>
          ) : (
            <Text
              style={{
                maxWidth: "95%",
                color: "#000000",
                marginHorizontal: 16,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {item?.nomeProduto}
            </Text>
          )}
          <Text
            style={{
              maxWidth: "95%",
              color: "#000000",
              marginHorizontal: 16,
              fontSize: 14,
            }}
          >
            {item?.pontos} {item?.tipo === "manual" ? "pontos" : "tickets"}
          </Text>
          <Text
            style={{
              maxWidth: "95%",
              color: "#000000",
              marginHorizontal: 16,
              fontSize: 14,
            }}
          >
            {item?.dataValidacao}
          </Text>
        </View>
      </View>
    </View>
  );
}

export const HistoricoCard = memo(HistoricoCardComponent);
