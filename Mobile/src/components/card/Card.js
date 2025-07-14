import { memo, useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-elements";
import { getDistance } from "geolib";

export default function CardComponent({
  onPress,
  item,
  children,
  userLocation,
}) {
  let distanceInKm = item?.distance / 1000;

  return (
    <SafeAreaView
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#005098",
        paddingVertical: 2,
      }}
    >
      <TouchableOpacity
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
        onPress={onPress}
      >
        {item?.imagem ? (
          <Avatar
            source={{ uri: item?.imagem }}
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
          />
        )}
        <SafeAreaView style={{ display: "flex" }}>
          <Text
            style={{
              maxWidth: "95%",
              color: "#000000",
              marginHorizontal: 16,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {item?.nomeFantasia}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginHorizontal: 16,
            }}
          >
            <Text>{item?.categoria?.nome}</Text>
            {userLocation && distanceInKm ? (
              <>
                <Text style={{ marginHorizontal: 8 }}>•</Text>
                <Text>{distanceInKm.toFixed(2).replace(".", ",")} km</Text>
              </>
            ) : null}
          </View>
          {item.ativa || (
            item.negada ? (
              <Text style={{ color: "red", marginHorizontal: 16 }}>
                Loja negada
              </Text>
            ) : (
              <Text style={{ color: "red", marginHorizontal: 16 }}>
                Loja em análise
              </Text>
            )
          )}
        </SafeAreaView>
        {children}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export const Card = memo(CardComponent);
