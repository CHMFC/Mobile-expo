import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, Text } from "react-native";
import { Avatar } from "@rneui/themed";
import Header from "../../components/header/Header";

const HistoricoPontos = ({ navigation, route }) => {
  const [loja, setLoja] = useState([]);
  const { lojas } = route.params;
  const { manuais } = route.params;

  useEffect(() => {
    try {
      lojas?.map((loja) => {
        setLoja(loja.lojas);
        return true;
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <SafeAreaView
      style={{ backgroundColor: "white", paddingTop: StatusBar.currentHeight }}
    >
      <Header
        icon={true}
        onPress={() => navigation.goBack()}
        title={"FIDELIZE PE"}
      />
      <SafeAreaView>
        <Text
          style={{
            textAlign: "center",
            fontSize: 26,
            color: "#000000",
            marginTop: 8,
          }}
        >
          Histórico de pontos
        </Text>

        <Text style={{ textAlign: "center", fontSize: 16, color: "#000000" }}>
          Acompanhe os pontos obtidos nas lojas!
        </Text>
        <SafeAreaView
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            marginTop: "4%",
          }}
        >
          {loja?.map((item) => (
            <SafeAreaView
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
                {item?.razaoSocial}
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
                  {item?.pontosProduto} pontos
                </Text>
              )}
            </SafeAreaView>
          ))}
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default HistoricoPontos;
