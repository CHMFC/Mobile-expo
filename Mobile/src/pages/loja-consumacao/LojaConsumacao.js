import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { styles } from "./lojaConsumacaoStyle";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import { Skelleton } from "../../components/skelleton/Skelleton";
import { SkelletonItens } from "../../const/skelletonItens";
import { ConfirmarPedidoCard } from "../../components/confirmarPedidoCard/ConfirmarPedidoCard";
import FlashMessage, { showMessage } from "react-native-flash-message";
import useNotification from "../../hooks/useNotification";
import { API_URL } from "../../const/apiUrl";

export default function LojaConsumacao({ navigation, route }) {
  const { id } = route.params;
  const { tokenStored } = usePersist();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const [clienteIds, setClienteIds] = useState([]);
  const [tokenCelular, setTokenCelular] = useState(null);
  const { setNotification, allNotifications } = useNotification();

  const removerPedido = async (id) => {
    await axios
      .delete(`${API_URL.base}/pedidos/${id}/`, {
        headers: { Authorization: `Bearer ${tokenStored}` },
      })
      .then(() => {
        mostrarMensagem("Sucesso!", "Pedido removido", "success");
        setIsValidated(!isValidated);
      });
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${API_URL.base}/loja/${id}/pedidos/consumo`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
          }
        );
        setData(response.data);

        // Extrair os clienteIds e armazená-los no estado
        const ids = response.data.map((pedido) => pedido.clienteId);
        setClienteIds(ids);

        setIsLoading(false);
      } catch (error) {
      }
    }
    fetchData();
  }, [isValidated]);
  const RecompensaNotification = async (pedidoId, lojaId, pontos) => {
    try {
      const response = await axios.post(
        `${API_URL.base}/pushnotification`,
        {
          tokenCelular: tokenCelular,
          title: `Você recebeu novos tickets!`,
          body: `Você recebeu ${pontos} ticket${pontos > 1 ? "s" : ""
            } como recompensa!`,
          data: {
            pedidoValidado: true,
            lojaId: lojaId,
            pontos: pontos,
            tipo: "consumo",
            pedidoId: pedidoId,
          },
        }
      );
    } catch (err) {
      return null;
    }
  };

  const getToken = async (clienteId) => {
    if (!clienteId) {
      return;
    }
    try {
      const res = await axios.get(
        `${API_URL.base}/usuarios/${clienteId}/tokenCelular`
      );
      setTokenCelular(res.data);
      return res.data;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      for (const clienteId of clienteIds) {
        await getToken(clienteId);
      }
    };

    if (clienteIds.length > 0) {
      fetchTokens();
    }
  }, [clienteIds]);

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

  const validarPedido = async (pedidoId, pontos) => {
    try {
      await axios
        .put(
          `${API_URL.base}/pedidos/${pedidoId}`,
          {},
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
          }
        )
        .then(() => {
          mostrarMensagem("Sucesso!", "Pedido Validado", "success");
          setIsValidated(!isValidated);
          RecompensaNotification(pedidoId, id, pontos);
        });
    } catch (error) {
      mostrarMensagem("Falha!", "Erro ao validar pedido", "danger");
      return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#005098" }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <Header
          title={"FIDELIZE PE"}
          icon={true}
          onPress={() => navigation.goBack()}
        />
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
        {isLoading ? (
          <SafeAreaView
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            {SkelletonItens.map((item, index) => (
              <Skelleton
                key={index}
                width={"90%"}
                marginBottom={12}
                round={16}
                height={72}
              />
            ))}
          </SafeAreaView>
        ) : (
          <SafeAreaView style={styles.containerProdutos}>
            {data?.map((pedido) => (
              <ConfirmarPedidoCard
                pedido={pedido}
                onPressDelete={() => removerPedido(pedido?.id)}
                key={pedido?.id}
                onPress={() => validarPedido(pedido.id, pedido.pontos)}
              />
            ))}
          </SafeAreaView>
        )}
      </ScrollView>
      </View>
      <Nav />
    </SafeAreaView>
  );
}
