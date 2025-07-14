import React, { memo } from "react";
import { Dimensions } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { Badge, Icon } from "react-native-elements";

const screenWidth = Dimensions.get("window").width;

export default function FuncionalidadeCardComponent({
  tipoResgate,
  quantidadeExtrato,
  validacaoOnPress,
  relatorioOnPress,
  badge,
  disabled
}) {
  return (
    <View
      style={{
        width: screenWidth * 0.8 - 20,
        height: screenWidth / 2.8,
        borderRadius: 12,
        marginHorizontal: 10,
        backgroundColor: "white",
        elevation: 1,
      }}
    >
      <View
        style={{
          height: "60%",
          backgroundColor: disabled ? "darkgrey" : "#1F5A9E",
          borderTopRightRadius: 12,
          borderTopLeftRadius: 12,
        }}
      >
        <TouchableOpacity style={{ width: "90%" }}
          disabled={disabled}
          onPress={relatorioOnPress}>
          <Text
            style={{
              paddingHorizontal: "5%",
              paddingTop: "5%",
              color: "white",
              fontSize: 14,
            }}
          >
            {tipoResgate} do dia
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                paddingHorizontal: "6%",
                paddingTop: 8,
                color: "white",
                fontWeight: "bold",
                fontSize: 20,
                width: "100%",
              }}
            >
              {quantidadeExtrato}
            </Text>
            <Icon
              name="chevron-forward-sharp"
              size={24}
              type="ionicon"
              style={{ marginTop: 8 }}
              color={"#ffffff"}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ height: 1, backgroundColor: "white" }} />
      <TouchableOpacity
        disabled={disabled}
        style={{
          height: "40%",
          backgroundColor: disabled ? "darkgrey" : "#1F5A9E",
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={validacaoOnPress}
      >
        <View style={{ width: "90%", flexDirection: "row" }}>
          <Text
            style={{
              color: "white",
              paddingHorizontal: 16,
              fontSize: 14,
            }}
          >
            Validar {tipoResgate.toLowerCase()}
          </Text>
          {badge ? (
            <Badge status={"error"} containerStyle={{ left: -12 }} />
          ) : null}
        </View>
        <Icon
          name="chevron-forward-sharp"
          size={24}
          style={{ marginTop: 4 }}
          type="ionicon"
          color={"#ffffff"}
        />
      </TouchableOpacity>
    </View>
  );
}

export const FuncionalidadeCard = memo(FuncionalidadeCardComponent);
