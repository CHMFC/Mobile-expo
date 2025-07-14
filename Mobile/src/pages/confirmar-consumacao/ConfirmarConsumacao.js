import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Avatar, Overlay } from "react-native-elements";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { styles } from "./ConfirmarConsumacaoStyles";
import usePersist from "../../hooks/usePersist";
import Button from "../../components/button/Button";
import axios from "axios";
import FlashMessage, { showMessage } from "react-native-flash-message";
import useNotification from "../../hooks/useNotification";
import { API_URL } from "../../const/apiUrl";
import ScreenContainer from "../../components/screenContainer/ScreenContainer";

export default function ConfirmarConsumacao({ route, navigation }) {
  const [data, setData] = useState([]);
  const { tokenStored } = usePersist();
  const { produto, id, pontosProdutos, pontosManuais, tiposPontos } =
    route.params;
  const [tokenCelular, setTokenCelular] = useState("");
  const { setNotification, allNotifications } = useNotification();

  const getToken = async () => {
    try {
      const res = await axios.get(
        `${API_URL.base}/lojas/${id}/tokenCelular`
      );
      setTokenCelular(res.data);
    } catch (error) {
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  const RecompensaNotification = async () => {
    try {
      const response = await axios.post(
        `${API_URL.base}/pushnotification`,
        {
          tokenCelular: tokenCelular,
          title: "Recompensa solicitada",
          body: `Um produto foi solicitado como recompensa!`,
        }
      );
    } catch (err) {
    }
  };

  const ResgateNotification = async () => {
    try {
      const response = await axios.post(
        `${API_URL.base}/pushnotification`,
        {
          tokenCelular: tokenCelular,
          title: "Recompensa solicitada",
          body: `Um produto foi solicitado para resgate!`,
        }
      );
    } catch (err) {
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${API_URL.base}/lojas/${id}/`, {
          headers: {
            Authorization: `Bearer ${tokenStored}`,
          },
        })
        .then((res) => {
          setData([res?.data]);
        })
        .catch((error) => {
        });
    };
    fetchData();
  }, []);

  const mostrarMensagem = (title, mensagem, type) => {
    showMessage({
      message: title,
      description: mensagem,
      type: type,
      style: { height: "100%" },
      titleStyle: {
        fontWeight: "bold",
        fontSize: 20,
        lineHeight: 20,
        justifyContent: "center",
        marginTop: "auto",
        alignSelf: "center",
        textAlign: "center",
      },
      textStyle: {
        fontSize: 18,
        lineHeight: 18,
        marginTop: "auto",
        textAlign: "center",
        paddingHorizontal: 20,
      },
    });
  };

  const solicitarRecompensa = async (
    produtoId,
    produtoImagem,
    produtoNome,
    pontosConsumacao
  ) => {
    const consumo = {
      produtoId: produtoId,
      usuarioLojaId: data[0].usuario.id,
      lojaId: id,
      nomeProduto: produtoNome,
      imagemProduto: produtoImagem,
      pontos: pontosConsumacao,
      tipo: "consumo",
    };
    await axios
      .post(`${API_URL.base}/pedidos/`, consumo, {
        headers: {
          Authorization: `Bearer ${tokenStored}`,
        },
      })
      .then(() => {
        mostrarMensagem(
          "Sucesso!",
          "Recompensa solicitada\nRedirecionando...",
          "success"
        );
        setTimeout(() => navigation.navigate("TelaLoja", { id: id }), 1700);
        RecompensaNotification();
      })
      .catch((error) => {
        if (
          error.response.data.message ==
          "Você já tem dois pedidos em análise nesta loja!"
        ) {
          mostrarMensagem(
            "Atenção",
            "Você já tem dois pedidos em análise nesta loja!",
            "warning"
          );
        } else {
          mostrarMensagem("Falha!", "Erro ao solicitar recompensa", "warning");
        }
      });
  };

  const solicitarResgate = async (
    produtoId,
    produtoImagem,
    produtoNome,
    produtoResgate
  ) => {
    const resgate = {
      produtoId: produtoId,
      lojaId: id,
      usuarioLojaId: data[0].usuario.id,
      nomeProduto: produtoNome,
      imagemProduto: produtoImagem,
      pontos: produtoResgate,
      tipo: produto[0].tiposPontos == "manual" ? "manualResgate" : "resgate",
    };

    await axios
      .post(`${API_URL.base}/pedidos`, resgate, {
        headers: {
          Authorization: `Bearer ${tokenStored}`,
        },
      })
      .then(() => {
        mostrarMensagem(
          "Sucesso!",
          "Resgate solicitado\nRedirecionando...",
          "success"
        );
        setTimeout(() => navigation.navigate("TelaLoja", { id: id }), 1700);
        ResgateNotification();
      })
      .catch((error) => {
        if (
          error.response.data.message ==
          "Você já tem dois pedidos em análise nesta loja!"
        ) {
          mostrarMensagem(
            "Atenção",
            "Você já tem dois pedidos em análise nesta loja!",
            "warning"
          );
        } else {
          mostrarMensagem("Falha!", "Erro ao solicitar resgate", "warning");
        }
      });
  };

  return (
    <ScreenContainer style={styles.container}>
      <Header
        icon={true}
        title="FIDELIZE PE"
        onPress={() => navigation.goBack()}
        iconNotifications={false}
      />
      <View>
        <FlashMessage
          textStyle={{
            fontSize: 20,
            justifyContent: "center",
            alignSelf: "center",
            marginTop: "auto",
            textAlign: "center",
          }}
          duration={2000}
        />
      </View>
      <View style={{ paddingTop: 16 }}>
        {data?.map((loja) => (
          <View key={loja?.categoria?.id}>
            <View>
            <Text style={styles.title}>{loja?.nomeFantasia}</Text>
            <Text style={styles.subtitle}>
              {loja?.endereco?.logradouro}, {loja?.endereco?.bairro},{" "}
              {loja?.endereco?.uf}
            </Text>
          </View>
          {produto?.map((produto) => (
            <View key={produto?.id} style={styles.card.background}>
              <View style={styles.card.container}>
                <View style={styles.card.content}>
                  {produto?.imagem ? (
                    <Avatar
                      source={{ uri: produto?.imagem }}
                      rounded
                      size="medium"
                    />
                  ) : (
                    <Avatar
                      source={require("../../assets/mapavazio.png")}
                      rounded
                      size="medium"
                    />
                  )}
                  <View style={styles.card.textContainer}>
                    <Text style={styles.card.product}>{produto?.nome}</Text>
                    {produto.tiposPontos === "produto" ? (
                      <Text style={styles.card.reward}>
                        Adquira e ganhe
                        <Text style={{ fontWeight: "bold" }}>
                          {" "}
                          {produto?.pontosConsumacao}{" "}
                          {produto.tiposPontos === "produto"
                            ? "ticket"
                            : "ponto"}
                          {produto.pontosConsumacao > 1 ? "s" : null}
                        </Text>
                      </Text>
                    ) : null}
                    {produto.permiteResgate ? (
                      <Text style={styles.card.reward}>
                        Resgatar por
                        <Text style={{ fontWeight: "bold" }}>
                          {" "}
                          {produto?.pontosResgate}{" "}
                          {produto.tiposPontos === "produto"
                            ? "ticket"
                            : "ponto"}
                          {produto.pontosResgate > 1 ? "s" : null}
                        </Text>
                      </Text>
                    ) : null}
                  </View>
                </View>

                {produto.tiposPontos === "produto" ? (
                  <View style={styles.button.container}>
                    <Button
                      label={"Solicitar recompensa"}
                      backgroundColor={"#005098"}
                      width={"90%"}
                      textColor={"#FFFFFF"}
                      padding={16}
                      fontSize={16}
                      borderRadius={32}
                      fontWeight={"bold"}
                      marginBottom={6}
                      onPress={() =>
                        solicitarRecompensa(
                          produto.id,
                          produto.imagem,
                          produto.nome,
                          produto.pontosConsumacao
                        )
                      }
                    />
                  </View>
                ) : null}

                {produto.permiteResgate ? (
                  (pontosProdutos >= produto.pontosResgate &&
                    produto.tiposPontos === "produto") ||
                    (pontosManuais >= produto.pontosResgate &&
                      produto.tiposPontos === "manuais") ? (
                    <View style={styles.button.container}>
                      <Button
                        label={"Solicitar resgate"}
                        onPress={() =>
                          solicitarResgate(
                            produto.id,
                            produto.imagem,
                            produto.nome,
                            produto.pontosResgate
                          )
                        }
                        backgroundColor={"#005098"}
                        width={"90%"}
                        textColor={"#FFFFFF"}
                        padding={16}
                        marginBottom={6}
                        fontSize={16}
                        borderRadius={32}
                        fontWeight={"bold"}
                      />
                    </View>
                  ) : (
                    <View style={styles.button.container}>
                      <Button
                        label={"Solicitar resgate"}
                        backgroundColor={"lightgrey"}
                        width={"90%"}
                        textColor={"#FFFFFF"}
                        padding={16}
                        marginBottom={6}
                        fontSize={16}
                        borderRadius={32}
                        fontWeight={"bold"}
                      />
                    </View>
                  )
                ) : (
                  ""
                )}
              </View>
            </View>
          ))}
          </View>
        ))}
      </View>
      <Nav />
    </ScreenContainer>
  );
}
