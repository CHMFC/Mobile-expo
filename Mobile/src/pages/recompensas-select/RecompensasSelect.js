import { useEffect, useState, useCallback } from "react";
import {
  TextInput,
  View,
  RefreshControl,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../../components/header/Header";
import { styles } from "./recompensasSelectStyles";
import Nav from "../../components/nav/Nav";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import { ProdutoCard } from "../../components/produtoCard/ProdutoCard";
import { Text } from "react-native-elements";
import { API_URL } from "../../const/apiUrl";
import ScreenContainer from "../../components/screenContainer/ScreenContainer";

export default function RecompensasSelect({ navigation }) {
  const { tokenStored } = usePersist();
  const [getData, setGetData] = useState([]);
  const [filter, setFilter] = useState(null);
  const [nome, setNome] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    async function getRecompensa() {
      await axios
        .get(
          `${API_URL.base}/usuarios/recompensas`,
          {
            headers: {
              Authorization: `Bearer ${tokenStored}`,
            },
          }
        )
        .then((res) => {
          setGetData(res?.data);
        })
        .catch((error) => {
          setError(true);
        });
    }
    getRecompensa();
  }, [refreshing]);

  const converterNomeBusca = (e) => {
    let value = e.nativeEvent.text;
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
    setNome(value);
  };

  const pesquisarRecompensa = () => {
    const recompensaFiltrada = getData.filter((recompensa) =>
      recompensa.nome.includes(nome)
    );
    setFilter(recompensaFiltrada);
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header
          icon={true}
          title="FIDELIZE PE"
          onPress={() => navigation.navigate("Home")}
        />
        <View style={[styles.search.container, { flexDirection: "row" }]}>
          <TextInput
            placeholder="Buscar"
            style={styles.search.input}
            placeholderTextColor="grey"
            onChange={converterNomeBusca}
            returnKeyType={"search"}
            onSubmitEditing={pesquisarRecompensa}
          />
          <Icon
            name="search"
            color="#878383"
            size={24}
            onPress={pesquisarRecompensa}
          />
        </View>
        <View>
          {filter
            ? filter.map((produto) => (
              <ProdutoCard
                produto={produto}
                recompensa={true}
                key={produto.id}
                onPress={() =>
                  navigation.navigate("ConfirmarResgate", {
                    produto: [
                      {
                        id: produto.id,
                        nome: produto.nome,
                        imagem: produto.imagem,
                        pontosResgate: produto.pontosResgate,
                        descricao: produto.descricao,
                        tiposPontos: produto.tiposPontos,
                        permiteResgate: produto.permiteResgate,
                      },
                    ],
                    id: produto.loja.id,
                  })
                }
              />
            ))
            : getData?.map((produto) => (
              <ProdutoCard
                produto={produto}
                recompensa={true}
                resgate={false}
                key={produto.id}
                onPress={() =>
                  navigation.navigate("ConfirmarResgate", {
                    produto: [
                      {
                        id: produto.id,
                        nome: produto.nome,
                        imagem: produto.imagem,
                        descricao: produto.descricao,
                        pontosResgate: produto.pontosResgate,
                        tiposPontos: produto.tiposPontos,
                      },
                    ],
                    id: produto.loja.id,
                  })
                }
              />
            ))}
          {error && (
            <Text style={{ textAlign: "center", padding: 16, fontSize: 22 }}>
              Nenhuma recompensa disponível!
            </Text>
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <Nav RecompensaSelect={true} />
    </ScreenContainer>
  );
}
