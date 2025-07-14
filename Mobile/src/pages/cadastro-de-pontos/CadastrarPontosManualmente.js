import React, { useState, useEffect } from "react";
import { View, SafeAreaView, TextInput, StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { Text, Overlay } from "@rneui/themed";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { Avatar } from "react-native-elements";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useNotification from "../../hooks/useNotification";
import { API_URL } from "../../const/apiUrl";

export default function CadastrarPontosManualmente({ navigation, route }) {
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [cpf, setCpf] = useState("");
  const [valor, setValor] = useState("");
  const [pontos, setPontos] = useState(0);
  const [error, setError] = useState(false);
  const { tokenStored } = usePersist();
  const { id, regraDePontos } = route.params;
  const [tokenCelular, setTokenCelular] = useState("");
  const { setNotification, allNotifications } = useNotification();

  useEffect(() => {
    async function atualizarUser() {
      const data = await AsyncStorage.getItem("userData");
      const result = JSON.parse(data);
      setUser(result || null);
    }
    atualizarUser();
  }, []);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    setPontos(valor * regraDePontos);
  }, [valor]);

  const searchUser = async () => {
    await axios
      .get(
        `${API_URL.base}/usuarios/search/${cpf}`
      )
      .then((res) => {
        setUsuarios([res.data]);
        setCpf("");
        setTokenCelular(res.data.tokenCelular);
        setError(false);
      })
      .catch((error) => {
        setError(true);
      });
  };
  const PontosNotification = async (pedidoId) => {
    try {
      await axios
        .post(`${API_URL.base}/pushnotification`, {
          tokenCelular: [tokenCelular],
          title: `Você recebeu novos pontos!`,
          body: `Você recebeu ${pontos} ponto${pontos ? "s" : ""}!`,
          data: {
            pedidoValidado: true,
            lojaId: id,
            pontos: pontos,
            tipo: "manual",
            pedidoId: pedidoId,
          },
        })
        .then((res) => {
        });
    } catch (err) {
    }
  };
  const mostrarMensagem = (message, type, mensagem) => {
    showMessage({
      message: message,
      description: mensagem,
      type: type,
      style: { height: "100%", top: 0 },
      titleStyle: {
        fontWeight: "bold",
        fontSize: 20,
        justifyContent: "center",
        marginTop: "auto",
        alignSelf: "center",
      },
    });
  };

  const adicionarPontos = async () => {
    if (cpf === user?.cpf || pontos <= 0) {
      mostrarMensagem("Erro", "danger", "Operação inválida!");
    } else {
      await axios
        .post(
          `${API_URL.base}/pedidos`,
          {
            clienteId: usuarios?.[0].id,
            lojaId: id,
            pontos: pontos,
            tipo: "manual",
          },
          {
            headers: {
              Authorization: `Bearer ${tokenStored}`,
            },
          }
        )
        .then((result) => {
          mostrarMensagem("Sucesso", "success", "Pontuação adicionada!");
          setValor("");
          setCpf("");
          setUsuarios([]);
          setVisible(!visible);
          PontosNotification(result?.data?.id);
        })
        .catch((error) => {
        });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#005098",
        paddingTop: StatusBar.currentHeight,
      }}
    >
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
          duration={1500}
        />
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
        <Text style={{ padding: 16, fontSize: 24, fontWeight: "700" }}>
          Pesquisar por usuário
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 32,
            marginHorizontal: 16,
            marginVertical: 8,
            backgroundColor: "#DCDCDC",
          }}
        >
          <TextInput
            placeholder="Buscar por CPF ou EMAIL"
            style={{
              width: "90%",
              borderRadius: 32,
              color: "black",
              padding: 16,
            }}
            placeholderTextColor="grey"
            onChange={(e) => setCpf(e.nativeEvent.text)}
            value={cpf}
            onSubmitEditing={searchUser}
            returnKeyType={"search"}
          />
          <Icon
            name="search"
            style={{ marginRight: "3%" }}
            color="#878383"
            size={24}
            onPress={searchUser}
          />
        </View>

        <SafeAreaView
          style={{ width: "100%", display: "flex", alignItems: "center" }}
        >
          {error && <Text>Nenhum usuário encontrado</Text>}
          {usuarios?.map((usuario) => (
            <SafeAreaView
              style={{
                width: "90%",
                marginTop: "2%",
                borderWidth: 1,
                borderColor: "#005098",
                borderRadius: 25,
                padding: 16,
              }}
              key={usuario.id}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Avatar
                  source={{ uri: usuario?.imagem }}
                  rounded
                  size="medium"
                  containerStyle={{ marginHorizontal: 8 }}
                />
                <View>
                  <Text
                    style={{ paddingLeft: 8, fontSize: 16, fontWeight: "700" }}
                  >
                    {usuario?.nome?.toUpperCase()}
                  </Text>
                  <Text
                    style={{ paddingLeft: 8, fontSize: 16, fontWeight: "100" }}
                  >
                    {cpf}
                  </Text>
                </View>
              </View>
              <View style={{ width: "100%", alignItems: "center" }}>
                <Input
                  value={valor}
                  placeholder={"Valor da compra"}
                  keyboardType={"numeric"}
                  padding={4}
                  onChange={(e) => setValor(e.nativeEvent.text)}
                />
                <Button
                  style={{ alignItems: "center", justifyContent: "center" }}
                  backgroundColor={"#005098"}
                  width={"100%"}
                  textColor={"#FFFFFF"}
                  padding={22}
                  fontSize={18}
                  borderRadius={50}
                  fontWeight={"bold"}
                  onPress={toggleOverlay}
                  label="Cadastrar Pontuação"
                />
              </View>
            </SafeAreaView>
          ))}
        </SafeAreaView>
      
      {valor && (
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <View
            style={{
              height: "50%",
              width: 300,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  paddingLeft: 16,
                  marginTop: 10,
                  fontSize: 24,
                  height: 32,
                }}
              >
                Nome do cliente
              </Text>
              <Text
                style={{
                  paddingLeft: 16,
                  marginBottom: 10,
                  fontSize: 24,
                  fontWeight: "700",
                  height: 32,
                }}
              >
                {usuarios[0]?.nome
                  .split(" ")
                  .slice(0, 2)
                  .join(" ")
                  .toUpperCase()}
              </Text>
              <Text style={{ paddingLeft: 16, fontSize: 24, height: 32 }}>
                Valor da compra
              </Text>
              <Text
                style={{
                  paddingLeft: 16,
                  marginBottom: 10,
                  fontSize: 24,
                  fontWeight: "700",
                  height: 32,
                }}
              >
                R$ {valor}
              </Text>
              <Text style={{ paddingLeft: 16, fontSize: 24, height: 32 }}>
                Pontos
              </Text>
              <Text
                style={{
                  paddingLeft: 16,
                  fontSize: 24,
                  fontWeight: "700",
                  height: 32,
                }}
              >
                {valor * regraDePontos} pontos
              </Text>
            </View>
            <Button
              backgroundColor={"#005098"}
              width={"100%"}
              textColor={"#FFFFFF"}
              padding={16}
              fontSize={16}
              borderRadius={32}
              fontWeight={"bold"}
              label="Confirmar"
              onPress={adicionarPontos}
            />
          </View>
        </Overlay>
      )}
      </View>
      </KeyboardAvoidingView>
      <Nav />
    </SafeAreaView>
  );
}
