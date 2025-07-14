import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { Text } from "react-native-elements";
import { SafeAreaView, View, ScrollView, RefreshControl } from "react-native";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { ProdutoCard } from "../../components/produtoCard/ProdutoCard";
import { styles } from "./ProdutosLojaStyles";
import { StatusBar } from "react-native";
import { API_URL } from "../../const/apiUrl";

export default function ProdutosLoja({ route, navigation }) {
  const [getData, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();
  const { id } = route?.params;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${API_URL.base}/lojas/${id}/`)
        .then((res) => {
          setData([res?.data]);
        })
        .catch((error) => {
          console.error("Erro na promise da TelaLoja", error);
        });
    };
    fetchData();
  }, [isFocused, refreshing]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <Header
        title={"FIDELIZE PE"}
        icon={true}
        onPress={() => navigation.goBack()}
      />
      <View
        style={[
          styles.mainContainer,
          {
            height: "92%",
            bottom: 66,
          },
        ]}
      >
        <ScrollView
          style={styles.mainUsers}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text
            style={{
              paddingLeft: 16,
              fontSize: 24,
              fontWeight: "700",
              height: 32,
              marginTop: 8,
            }}
          >
            Produtos Cadastrados
          </Text>

          {getData?.map((loja) => (
            <View key={loja?.categoria?.id}>
              {loja?.produtos?.map((produto) => (
                <ProdutoCard
                  produto={produto}
                  key={produto?.id}
                  onPress={() =>
                    navigation.navigate("EditarProduto", {
                      id: produto.id,
                      nomeProduto: produto.nome,
                      imagemProduto: produto.imagem,
                      pontosConsumacao: produto.pontosConsumacao,
                      pontosResgate: produto.pontosResgate,
                      descricaoProduto: produto.descricao,
                      tiposPontos: produto.tiposPontos,
                      permiteResgate: produto.permiteResgate,
                      lojaId: id,
                    })
                  }
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
      <Nav />
    </SafeAreaView>
  );
}
