import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { styles } from "./ConfirmarResgateStyles";
import usePersist from "../../hooks/usePersist";
import Button from "../../components/button/Button";
import axios from "axios";
import FlashMessage, { showMessage } from "react-native-flash-message";
import useNotification from "../../hooks/useNotification";
import { API_URL } from "../../const/apiUrl";

export default function ConfirmarResgate({ route, navigation }) {
  const [data, setData] = useState([]);
  const { tokenStored } = usePersist();
  const { produto } = route.params;
  const { id } = route?.params;
  const { setNotification, allNotifications } = useNotification();
  const [tokenCelular, setTokenCelular] = useState("");

  const ResgateNotification = async () => {
    try {
      await axios.post(
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
        justifyContent: "center",
        marginTop: "auto",
        alignSelf: "center",
        textAlign: "center",
      },
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
        setTimeout(
          () => navigation.navigate("RecompensaSelect", { id: id }),
          1700
        );
        ResgateNotification();
      })
      .catch((error) => {
        mostrarMensagem("Falha!", "Erro ao solicitar resgate", "danger");
        const errResponse =
          (error && error.response && error.response.data) ||
          (error && error.message);

      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon={true}
        title="FIDELIZE PE"
        onPress={() => navigation.goBack()}
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
      {data?.map((loja) => (
        <View style={{ backgroundColor: "#FFFFFF", flex: 1, paddingTop: 16 }} key={loja?.categoria?.id}>
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
                    {
                      <Text style={styles.card.reward}>
                        Resgatar por{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {produto?.pontosResgate} pontos.
                        </Text>
                      </Text>
                    }
                  </View>
                </View>

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
                    fontSize={16}
                    borderRadius={32}
                    fontWeight={"bold"}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}
      <Nav />
    </SafeAreaView>
  );
}
