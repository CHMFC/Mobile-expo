import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import axios from "axios";
import { styles } from "./TelaLojaStyles";
import { LojaInfo } from "../../components/lojaInfo/LojaInfo";
import { MapaLoja } from "../../components/mapaLoja/MapaLoja";
import { ProdutoCard } from "../../components/produtoCard/ProdutoCard";
import { Image, Overlay, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../../const/apiUrl";
import ScreenContainer from "../../components/screenContainer/ScreenContainer";

const screenWidth = Dimensions.get("window").width;

export default function TelaLoja({ route, navigation }) {
  const [data, setData] = useState([]);
  const { id, pontosManuais, pontosProdutos } = route?.params;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${API_URL.base}/lojas/${id}/`)
        .then((res) => {
          setData([res?.data]);
        })
        .catch((error) => {
        });
    };
    fetchData();
  }, []);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <ScreenContainer style={styles.container}>
      <Header
        title="FIDELIZE PE"
        icon={true}
        onPress={() => navigation.goBack()}
        iconNotifications={false}
      />
      <ScrollView>
        {data?.map((loja) => (
          <View key={loja?.categoria?.id}>
            <LojaInfo
              loja={loja}
              onPress={toggleOverlay}
              regulamento={true}
            />

            <Overlay
              isVisible={visible}
              onBackdropPress={toggleOverlay}
              fullScreen={true}
              overlayStyle={{
                padding: 20,
                paddingTop: 40
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  height: 60,
                  alignItems: "center",
                  marginBottom: 20
                }}
              >
                <TouchableOpacity
                  onPress={toggleOverlay}
                  style={{
                    width: "20%",
                  }}
                >
                  <Icon name="close" color="black" size={28} />
                </TouchableOpacity>

                <View
                  style={{
                    width: "60%",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "700",
                      fontSize: 18,
                    }}
                  >
                    Regulamento de pontos
                  </Text>
                </View>
              </View>
              <View style={{ padding: 10 }}>
                <Text
                  style={{ 
                    fontSize: 16, 
                    fontWeight: "bold", 
                    color: "black",
                    marginBottom: 10
                  }}
                >
                  Como funciona a regra de pontos dessa loja?
                </Text>
                <Text style={{ 
                  color: "black",
                  fontSize: 14,
                  lineHeight: 20
                }}>
                  {data[0]?.regulamento
                    ? data[0]?.regulamento
                    : "Regulamento de pontos não definido"}
                </Text>
              </View>
            </Overlay>

            <View style={{ marginBottom: 12 }}>
              <MapaLoja loja={loja} />
            </View>
            <View>
              <Text
                style={{
                  color: "black",
                  marginLeft: 16,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Produtos
              </Text>
              <View style={{ marginTop: 8, marginBottom: 80 }}>
                {loja?.produtos?.map((produto) => (
                  <ProdutoCard
                    produto={produto}
                    key={produto?.id}
                    onPress={() =>
                      navigation.navigate("ConfirmarConsumacao", {
                        produto: [
                          {
                            id: produto.id,
                            nome: produto.nome,
                            imagem: produto.imagem,
                            pontosConsumacao: produto.pontosConsumacao,
                            pontosResgate: produto.pontosResgate,
                            descricao: produto.descricao,
                            tiposPontos: produto.tiposPontos,
                            permiteResgate: produto.permiteResgate,
                          },
                        ],
                        id: id,
                        pontosProdutos: pontosProdutos,
                        pontosManuais: pontosManuais,
                      })
                    }
                  />
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <Nav />
    </ScreenContainer>
  );
}
