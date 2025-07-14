import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Avatar, Button } from "@rneui/themed";
import Header from "../../components/header/Header";
import ScreenContainer from "../../components/screenContainer/ScreenContainer";

const HistoricoPontos = ({ navigation, route }) => {
  const [loja, setLoja] = useState([]);
  const { lojas } = route.params;
  const { manuais } = route.params;

  

  useEffect(() => {
    try {
      lojas?.map((loja, index) => {
        setLoja(loja.lojas);
        return true;
      });
    } catch (error) {
    }
  }, []);

  return (
    <ScreenContainer>
      <Header
        icon={true}
        onPress={() => navigation.goBack()}
        title={"FIDELIZE PE"}
      />
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 }}>
        <View >
        <Text
          style={{
            fontSize: 26,
            color: "#000000",
            marginTop: 8,
          }}
        >
          {manuais ? ( "Histórico de pontos"):("Histórico de Tickets")}
        </Text>

        <Text style={{ textAlign: "center", fontSize: 16, color: "#000000" }}>
        {manuais ? ( "Acompanhe os pontos obtidos nas lojas!"):("Acompanhe os tickets obtidos nas lojas!")}
        </Text>
        </View>

        <View style={{ alignItems: "center", marginTop: 16 }}>
          <Button
            icon={{
              name: "trophy",
              type: "font-awesome",
              size: 20,
              color: "white",
            }}
            buttonStyle={{
              backgroundColor: "#005098",
              borderRadius: 25,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
            title=""
          />
        </View>
        </View>
        <View
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            marginTop: "4%",
          }}
        >
          {loja?.map((item) => (
            <View
              key={item?.id}
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                borderRadius: 16,
                padding: 16,
                borderBottomWidth: 0.5,
                borderBottomColor: "#005098",
                marginTop: 8,
              }}
            >
              {item?.imagem ? (
                <Avatar source={{ uri: item?.imagem }} rounded size="medium" />
              ) : (
                <Avatar
                  containerStyle={{ backgroundColor: "#005098" }}
                  icon={{ name: "home", type: "font-awesome" }}
                  rounded
                  size="medium"
                />
              )}

              <Text
                style={{
                  marginHorizontal: 16,
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginVertical: 4,
                }}
              >
                {item?.nomeFantasia}
              </Text>
              {manuais ? (
                <Text
                  style={{
                    marginHorizontal: 16,
                    color: "black",
                    fontWeight: "500",
                    fontSize: 16,
                    marginVertical: 4,
                  }}
                >
                  {item?.pontosManuais} pontos
                </Text>
              ) : (
                <Text
                  style={{
                    marginHorizontal: 16,
                    color: "black",
                    fontWeight: "500",
                    fontSize: 16,
                    marginVertical: 4,
                  }}
                >
                  {item?.pontosProduto} ticket(s)
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
};

export default HistoricoPontos;
