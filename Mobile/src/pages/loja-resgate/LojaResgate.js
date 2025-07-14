import { Text } from "@rneui/base";
import { View, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { styles } from "./lojaResgateStyle";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import Card from "../../components/card/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { ConfirmarPedidoCard } from "../../components/confirmarPedidoCard/ConfirmarPedidoCard";
import useNotification from "../../hooks/useNotification";
import { StatusBar } from "react-native";
import { API_URL } from "../../const/apiUrl";

export default function LojaResgate({ navigation, route }) {
  const { id, endereco, razaoSocial } = route.params;
  const { tokenStored } = usePersist();
  const [pedidos, setPedidos] = useState([]);
  const [clienteIds, setClienteIds] = useState([]);
  const [isValidated, setIsValidated] = useState(false);
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
    const resgatarPedidos = async () => {
      await axios
        .get(
          `${API_URL.base}/loja/${id}/pedidos/resgate`,
          {
            headers: {
              Authorization: `Bearer ${tokenStored}`,
            },
          }
        )
        .then((response) => {
          setPedidos(response?.data);

          // Extrair os clienteIds e armazená-los no estado
          const ids = response.data.map((pedido) => pedido.clienteId);
          setClienteIds(ids);
        })
            .catch((err) => {
              return null;
        });
    };
    resgatarPedidos();
  }, [isValidated]);

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

  const ResgateLojaNotification = async (produto, pedidoId) => {
    try {
      const response = await axios.post(
        `${API_URL.base}/pushnotification`,
        {
          tokenCelular: tokenCelular,
          title: "Um produto foi resgatado!",
          body: `O resgate do ${produto} foi aceito`,
          data: {
            pedidoValidado: true,
            lojaId: id,
            tipo: "resgate",
            pedidoId: pedidoId,
          },
        }
      );
    } catch (err) {
      return null;
    }
  };

  const validarResgate = async (item) => {
    await axios
      .put(
        `${API_URL.base}/pedidos/${item?.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenStored}`,
          },
        }
      )
      .then(() => {
        mostrarMensagem("Sucesso!", "Pedido Validado", "success");
        setIsValidated(!isValidated);
        ResgateLojaNotification(item?.nomeProduto, item?.id); // Passar o nome do produto resgatado
      })
      .catch((err) => {
        mostrarMensagem("Falha!", "Erro ao validar pedido", "danger");
        return null;
      });
  };

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#005098",
        paddingTop: StatusBar.currentHeight,
      }}
    >
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
      <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header icon={true} onPress={() => navigation.goBack()} />

        <View style={{ marginBottom: 80 }}>
          {pedidos.map((item) => (
            <ConfirmarPedidoCard
              pedido={item}
              key={item?.id}
              onPress={() => validarResgate(item)}
              onPressDelete={() => removerPedido(item?.id)}
            />
          ))}
        </View>
      </ScrollView>
      </View>
      <Nav />
    </SafeAreaView>
  );
}
