import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon, Image, Text } from "react-native-elements";

export const PontosContaComponent = ({
  data,
  onPress,
  tipoPontos,
  color,
  marginBottom,
  width,
  info,
}) => {
  return (
    <TouchableOpacity
      style={{
        marginBottom: marginBottom,
        width: "90%",
        elevation: 2,
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: color,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
      }}
      onPress={onPress}
    >
      <View style={{ width: width, flexDirection: "row" }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginRight: 8,
          }}
        >
          {tipoPontos === "Pontos" ? (
            <Image
              source={require("../../assets/cards/teste-consumo.png")}
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <Image
              source={require("../../assets/cards/teste-produto.png")}
              style={{ width: 40, height: 40 }}
            />
          )}
        </View>
        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "white" }}>{tipoPontos}</Text>
            <TouchableOpacity
              style={{ paddingHorizontal: 4, paddingVertical: 2 }}
              onPress={info}
            >
              <Icon
                name="information-circle"
                type="ionicon"
                size={18}
                color={"#ffffff"}
              />
            </TouchableOpacity>
          </View>

          {tipoPontos === "Pontos" ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontWeight: "bold",
                  width: "90%",
                  paddingRight: 4,
                }}
              >
                {data?.pontosManuais?.totalPontos
                  ? data?.pontosManuais?.totalPontos
                  : 0}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 20,
                  color: "white",
                  fontWeight: "bold",
                  width: "90%",
                  paddingRight: 4,
                }}
              >
                {data?.pontosProduto?.totalPontos
                  ? data?.pontosProduto?.totalPontos
                  : 0}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Icon
        name="chevron-forward-sharp"
        size={32}
        type="ionicon"
        color={"#ffffff"}
      />
    </TouchableOpacity>
  );
};

export const PontosConta = memo(PontosContaComponent);
