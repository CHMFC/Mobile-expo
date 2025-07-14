import {
  View,
  Dimensions,
  ScrollView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { styles } from "./OpcoesLojaStyles";
import { Icon, Text } from "react-native-elements";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import usePersist from "../../hooks/usePersist";
import { InfoUser } from "../../components/infoUser/InfoUser";
import { FuncionalidadeCard } from "../../components/funcionalidadeCard/FuncionalidadeCard";
import { RelatorioCard } from "../../components/relatorioCard/RelatorioCard";
import OpcoesLojaButton from "../../components/opcoesLojaButton/OpcoesLojaButton";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../const/apiUrl";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function OpcoesLoja({ route, navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [getRecompensasDiaria, setRecompensasDiaria] = useState([]);
  const [getResgateDiaria, setResgateDiaria] = useState([]);
  const [getBadgeRecompensa, setBadgeRecompensa] = useState(false);
  const [getBadgeResgate, setBadgeResgate] = useState(false);
  const [avisoAnalise, setAvisoAnalise] = useState(false);
  const [dadosLoja, setDadosLoja] = useState();

  const { id } = route.params;
  const { tokenStored, userStored } = usePersist();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    async function resgatarDadosLoja() {
      await axios
        .get(
          `${API_URL.base}/lojas/${id}`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
          }
        )
        .then((response) => {
          setDadosLoja(response?.data);
        })
        .catch((err) => {
          if (err.response.data.message != "Nenhum pedido encontrado!") {
          }
        });
    }
    resgatarDadosLoja();

    async function resgatarRecompensasDiario() {
      await axios
        .get(
          `${API_URL.base}/lojas/${id}/extrato/consumo`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
          }
        )
        .then((response) => {
          setRecompensasDiaria(response?.data);
        })
        .catch((err) => {
          if (err.response.data.message != "Nenhum pedido encontrado!") {
          }
        });
    }
    resgatarRecompensasDiario();

    async function resgatarResgatesDiario() {
      await axios
        .get(
          `${API_URL.base}/lojas/${id}/extrato/resgate`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
          }
        )
        .then((response) => {
          setResgateDiaria(response?.data);
        })
        .catch((err) => {
          if (err.response.data.message != "Nenhum pedido encontrado!")
            return null;
        });
    }
    resgatarResgatesDiario();

    async function quantidadeRecompensa() {
      await axios
        .get(
          `${API_URL.base}/loja/${id}/pedidos/consumo`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
          }
        )
        .then((response) => {
          response.data.length > 0
            ? setBadgeRecompensa(true)
            : setBadgeRecompensa(false);
        })
        .catch((err) => {
          return null;
        });
    }
    quantidadeRecompensa();

    async function quantidadeResgate() {
      await axios
        .get(
          `${API_URL.base}/loja/${id}/pedidos/resgate`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
          }
        )
        .then((response) => {
          response.data.length > 0
            ? setBadgeResgate(true)
            : setBadgeResgate(false);
        })
        .catch((err) => {
            return null;
        });
    }
    quantidadeResgate();

    setTimeout(() => {
      !dadosLoja?.ativa && setAvisoAnalise(true);
      dadosLoja?.ativa && setAvisoAnalise(false);
    }, 1000);
  }, [refreshing, !dadosLoja]);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <StatusBar
        backgroundColor="#005098"
        barStyle="light-content"
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", flex: 1 }}
      >
        <Header icon={true} onPress={() => navigation.goBack()} />

        {avisoAnalise && (
          <View style={{
            width: '100%',
            backgroundColor: "#005098",
            alignItems: "center"
          }}>
            <View style={{
              backgroundColor: "white",
              borderRadius: 15,
              paddingVertical: 10,
              paddingHorizontal: 15,
              flexDirection: "row"
            }}>
              <Icon
                name='exclamation-triangle'
                type='font-awesome'
                color='red' />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "red",
                  marginLeft: 10
                }}
              >{dadosLoja?.negada ? 'Loja Negada' : 'Loja em Análise'}</Text>
            </View>
          </View>
        )}

        <View
          style={{
            backgroundColor: "#005098",
            height: 380,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            alignItems: "center",
          }}
        >
          <InfoUser
            nome={dadosLoja?.nomeFantasia}
            imagem={dadosLoja?.imagem}
            texto={"Minhas lojas"}
            widthNav={90}
            onPress={() => navigation.goBack()}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <FuncionalidadeCard
              disabled={(!dadosLoja?.ativa)}
              tipoResgate={"Recompensas"}
              quantidadeExtrato={getRecompensasDiaria.quantidade}
              badge={getBadgeRecompensa}
              validacaoOnPress={() =>
                navigation.navigate("LojaConsumacao", { id: id })
              }
              relatorioOnPress={() =>
                navigation.navigate("RelatorioPedidos", {
                  lojaId: id,
                  consumo: true,
                })
              }
            />

            <FuncionalidadeCard
              disabled={!dadosLoja?.ativa}
              tipoResgate={"Resgates"}
              quantidadeExtrato={getResgateDiaria.quantidade}
              badge={getBadgeResgate}
              validacaoOnPress={() =>
                navigation.navigate("lojaResgate", {
                  id: id,
                  endereco: dadosLoja?.endereco,
                  razaoSocial: dadosLoja?.razaoSocial,
                })
              }
              relatorioOnPress={() =>
                navigation.navigate("RelatorioPedidos", {
                  lojaId: id,
                })
              }
            />
          </ScrollView>
        </View>

        <View style={{ marginTop: -128, marginBottom: 12 }}>
          <Text
            style={{
              color: "white",
              paddingHorizontal: "5%",
              fontSize: 14,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            Relátorios
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <RelatorioCard
              disabled={!dadosLoja?.ativa || userStored?.id != dadosLoja?.usuario?.id}
              title={"Clientes"}
              source={require("../../assets/cards/clientes-ativos.png")}
              onPress={() =>
                navigation.navigate("RelatorioCliente", {
                  lojaId: id,
                  mensagensQuantidade: dadosLoja?.mensagensQuantidade,
                  lojaNome: dadosLoja?.nomeFantasia,
                  lojaImagem: dadosLoja?.imagem,
                })
              }
            />
            <RelatorioCard
              disabled={!dadosLoja?.ativa || userStored?.id != dadosLoja?.usuario?.id}
              title={"Faixa etária"}
              source={require("../../assets/cards/faixa-etaria.png")}
              onPress={() =>
                navigation.navigate("RelatorioFaixaEtaria", {
                  lojaId: id,
                  mensagensQuantidade: dadosLoja?.mensagensQuantidade,
                  lojaNome: dadosLoja?.nomeFantasia,
                  lojaImagem: dadosLoja?.imagem,
                })
              }
            />
            <RelatorioCard
              disabled={!dadosLoja?.ativa || userStored?.id != dadosLoja?.usuario?.id}
              title={"Gênero"}
              source={require("../../assets/cards/genero.png")}
              onPress={() =>
                navigation.navigate("RelatorioGenero", {
                  lojaId: id,
                  mensagensQuantidade: dadosLoja?.mensagensQuantidade,
                  lojaNome: dadosLoja?.nomeFantasia,
                  lojaImagem: dadosLoja?.imagem,
                })
              }
            />
            <RelatorioCard
              disabled={!dadosLoja?.ativa || userStored?.id != dadosLoja?.usuario?.id}
              title={"Localidade"}
              source={require("../../assets/cards/localidade.png")}
              onPress={() =>
                navigation.navigate("RelatorioLocalidade", {
                  lojaId: id,
                  lojaNome: dadosLoja?.nomeFantasia,
                  lojaImagem: dadosLoja?.imagem,
                })
              }
            />
            <RelatorioCard
              disabled={!dadosLoja?.ativa || userStored?.id != dadosLoja?.usuario?.id}
              title={"Curva ABC"}
              source={require("../../assets/cards/curva-abc.png")}
              onPress={() =>
                navigation.navigate("RelatorioCurvaABC", {
                  lojaId: id,
                  mensagensQuantidade: dadosLoja?.mensagensQuantidade,
                  lojaNome: dadosLoja?.nomeFantasia,
                  lojaImagem: dadosLoja?.imagem,
                  curvaA: dadosLoja?.curvaA,
                  curvaB: dadosLoja?.curvaB,
                  curvaC: dadosLoja?.curvaC,
                })
              }
            />
            <RelatorioCard
              disabled={!dadosLoja?.ativa || userStored?.id != dadosLoja?.usuario?.id}
              title={"Aniversariantes"}
              source={require("../../assets/cards/aniversariantes.png")}
              onPress={() =>
                navigation.navigate("RelatorioAniversariantes", {
                  lojaId: id,
                  mensagensQuantidade: dadosLoja?.mensagensQuantidade,
                  lojaNome: dadosLoja?.nomeFantasia,
                  lojaImagem: dadosLoja?.imagem,
                })
              }
            />
            <RelatorioCard
              disabled={!dadosLoja?.ativa || userStored?.id != dadosLoja?.usuario?.id}
              title={"Satisfação"}
              source={require("../../assets/cards/pesquisa.png")}
              onPress={() =>
                navigation.navigate("RelatorioSatisfacao", {
                  lojaId: id,
                  lojaNome: dadosLoja?.nomeFantasia,
                  lojaImagem: dadosLoja?.imagem,
                })
              }
            />
          </ScrollView>
        </View>

        <View>
          <Text
            style={{
              marginTop: 8,
              paddingHorizontal: "5%",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Opções
          </Text>
          {userStored?.id === dadosLoja?.usuario?.id ? (
            <View
              style={{
                width: screenWidth,
                marginBottom: "25%",
                alignItems: "center",
              }}
            >
              <OpcoesLojaButton
                label={"Alterar Informações"}
                onPress={() =>
                  navigation.navigate("atualizarDadosLoja", {
                    id: id,
                    imagemAtual: dadosLoja?.imagem,
                    comprovanteAtual: dadosLoja?.comprovante,
                  })
                }
              />

              <OpcoesLojaButton
                disabled={!dadosLoja?.ativa}
                onPress={() =>
                  navigation.navigate("ticketMedioDiario", { id: id })
                }
                label="Ticket Médio Diário"
              />

              <OpcoesLojaButton
                disabled={!dadosLoja?.ativa}
                label={"Cadastrar Produtos"}
                onPress={() =>
                  navigation.navigate("cadastroDeProdutos", {
                    id: id,
                    endereco: dadosLoja?.endereco,
                    razaoSocial: dadosLoja?.razaoSocial,
                  })
                }
              />

              <OpcoesLojaButton
                disabled={!dadosLoja?.ativa}
                onPress={() =>
                  navigation.navigate("ProdutosCadastrados", { id: id })
                }
                label="Produtos Cadastrados"
              />

              <OpcoesLojaButton
                disabled={!dadosLoja?.ativa}
                onPress={() =>
                  navigation.navigate("cadastroDeFuncionario", { id: id })
                }
                label="Cadastrar Funcionário"
              />

              <OpcoesLojaButton
                disabled={!dadosLoja?.ativa}
                onPress={() =>
                  navigation.navigate("FuncionarioLoja", { id: id })
                }
                label="Funcionários Cadastrados"
              />

              <OpcoesLojaButton
                disabled={!dadosLoja?.ativa}
                onPress={() =>
                  navigation.navigate("cadastrarPontosManualmente", {
                    id: id,
                    regraDePontos: dadosLoja?.regraDePontos,
                  })
                }
                label="Cadastrar Pontos"
              />
            </View>
          ) : (
            dadosLoja?.funcionarios?.filter(
              (loja) => userStored?.id === loja?.usuario?.id && loja?.ativo
            )?.map((loja) => (
              <View
                key={loja?.id}
                style={{
                  width: screenWidth,
                  height: screenHeight,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <OpcoesLojaButton
                  onPress={() =>
                    navigation.navigate("cadastrarPontosManualmente", {
                      id: id,
                      regraDePontos: dadosLoja?.regraDePontos,
                    })
                  }
                  label="Cadastrar Pontos"
                />
              </View>
            ))
          )}
        </View>

        {dadosLoja?.funcionarios?.filter(
          (loja) => userStored?.id === loja?.usuario?.id && !loja?.ativo
        )?.map((loja) => (
          <View
            key={loja?.id}
            style={{
              width: screenWidth,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Text>Funcionário Desativado!!</Text>
          </View>
        ))}
      </ScrollView>
      <Nav />
    </View>
  );
}
