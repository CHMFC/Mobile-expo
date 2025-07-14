import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { styles } from "./FuncionarioLojaStyle";
import { Text, Avatar, Switch } from "react-native-elements";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { LojaInfo } from "../../components/lojaInfo/LojaInfo";
import React, { useState, useEffect } from "react";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Overlay } from "@rneui/themed";
import Button from "../../components/button/Button";
import Icon from "react-native-vector-icons/Ionicons";
import {
  removerFuncionarioNotification,
  FuncionarioNotification,
} from "../../const/notifications";
import useNotification from "../../hooks/useNotification";
import { API_URL } from "../../const/apiUrl";

export default function FuncionarioLoja({ route, navigation }) {
  const { id } = route.params;
  const [list, setList] = useState([]);
  const { tokenStored } = usePersist();
  const [data, setData] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);

  const mostrarMensagem = (title, mensagem, type) => {
    showMessage({
      message: title,
      description: mensagem,
      type: type,
      style: { height: "100%", top: -20 },
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

  const toggleSwitch = async (funcionarioId) => {
    const funcionarioIndex = list.findIndex(
      (funcionario) => funcionario.usuario.id === funcionarioId
    );
    const updatedFuncionario = {
      ...list[funcionarioIndex],
      ativo: !list[funcionarioIndex].ativo,
    };
    const updatedList = [...list];
    updatedList[funcionarioIndex] = updatedFuncionario;
    setList(updatedList);

    try {
      await axios
        .put(
          `${API_URL.base}/lojas/${id}/funcionarios/${funcionarioId}`,
          { ativo: updatedFuncionario.ativo },
          { headers: { Authorization: `Bearer ${tokenStored}` } }
        )
        .then((res) => {
          if (res.data == "Funcionário ativado!")
            mostrarMensagem("Sucesso!", "Funcionário ativado", "success");
          else mostrarMensagem("Sucesso!", "Funcionário desativado", "success");
        });
    } catch (error) {
      mostrarMensagem(
        "Falha!",
        "Erro ao ativar/desativar funcionário",
        "danger"
      );
    }
    FuncionarioNotification(
      updatedFuncionario.usuario.nome,
      updatedFuncionario.usuario.tokenCelular,
      updatedFuncionario.ativo
    );
  };

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

    const exibirFuncionarios = async () => {
      await axios
        .get(
          `${API_URL.base}/lojas/${id}/funcionarios`,
          {
            headers: {
              Authorization: `Bearer ${tokenStored}`,
            },
          }
        )
        .then(function (response) {
          setList(response.data.funcionarios);
        })
        .catch(function (error) {
        });
    };
    exibirFuncionarios();
  }, []);

  const removerFuncionario = async (lojaId, funcionarioId) => {
    try {
      await axios.delete(
        `${API_URL.base}/lojas/${lojaId}/funcionarios/${funcionarioId}`,
        { headers: { Authorization: `Bearer ${tokenStored}` } }
      );
      setList(list.filter((f) => f.usuario.id !== funcionarioId));
      setOverlayVisible(false);
      removerFuncionarioNotification(
        selectedFuncionario.usuario.nome,
        selectedFuncionario.usuario.tokenCelular
      );
    } catch (error) {
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#005098"}}>
      <View
        style={[
          {
            backgroundColor: "white",
          },
        ]}
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
          duration={2000}
        />
        {data?.map((loja) => (
          <View
            key={loja?.categoria?.id}
            style={{
              width: "100%",
              marginTop: 24,
              paddingLeft: 8,
              paddingBottom: 8,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <LojaInfo loja={loja} />
          </View>
        ))}
        <Text
          style={{
            width: "100%",
            paddingLeft: 16,
            fontSize: 24,
            fontWeight: "700",
          }}
        >
          Funcionarios Cadastrados
        </Text>
        <ScrollView style={styles.mainUsers}>
          {list.map((funcionario, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedFuncionario(funcionario);
                setOverlayVisible(true);
              }}
            >
              <View key={index} style={styles.divUser}>
                {funcionario.usuario.imagem ? (
                  <Avatar
                    source={{ uri: funcionario.usuario.imagem }}
                    rounded
                    size="medium"
                    containerStyle={styles.card.avatarContainer}
                  />
                ) : (
                  <Icon
                    style={{ paddingLeft: 4 }}
                    name="person-circle"
                    type="ionicon"
                    size={64}
                    color="#C4C4C4"
                  />
                )}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View style={{ maxWidth: "70%" }}>
                    <Text
                      style={{
                        paddingLeft: 8,
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                    >
                      ID #{funcionario.usuario.id}
                    </Text>
                    <Text
                      style={{
                        paddingLeft: 8,
                        fontSize: 16,
                        fontWeight: "100",
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Nome: {funcionario.usuario.nome}
                    </Text>
                  </View>
                  <View style={styles.btnSwitch}>
                    <Switch
                      trackColor={{ false: "#DCDCDC", true: "#C9CFFF" }}
                      thumbColor={funcionario.ativo ? "#005098" : "#FFFFFF"}
                      onValueChange={() => toggleSwitch(funcionario.usuario.id)}
                      value={funcionario.ativo}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Overlay
          isVisible={overlayVisible}
          onBackdropPress={() => setOverlayVisible(false)}
        >
          <TouchableHighlight
            style={{
              position: "absolute",
              right: 0,
              zIndex: 1,
            }}
            onPress={() => setOverlayVisible(false)}
            underlayColor="#D5D5D5"
          >
            <Icon
              name="close-outline"
              type="ionicon"
              size={40}
              color="#000000"
            />
          </TouchableHighlight>
          <View
            style={{
              top: 80,
              height: "50%",
              width: 300,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={[styles.divDados, { alignItems: "center" }]}>
              {selectedFuncionario?.usuario?.imagem ? (
                <Avatar
                  size={"large"}
                  rounded={true}
                  source={{ uri: selectedFuncionario.usuario.imagem }}
                />
              ) : (
                <Icon
                  name="person-circle"
                  type="ionicon"
                  size={96}
                  color="#C4C4C4"
                />
              )}
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 24,
                  textAlign: "center",
                }}
              >
                Tem certeza que deseja remover o funcionário{" "}
                <Text style={{ fontWeight: "700" }}>
                  {selectedFuncionario?.usuario?.nome}
                </Text>
                ?
              </Text>
            </View>
            <View style={{ width: "100%" }}>
              <Button
                backgroundColor={"#005098"}
                width={"100%"}
                textColor={"#FFFFFF"}
                padding={16}
                fontSize={16}
                marginTop={40}
                borderRadius={32}
                fontWeight={"bold"}
                onPress={() => {
                  removerFuncionario(id, selectedFuncionario.usuario.id);
                }}
                label="Remover"
              />
            </View>
          </View>
        </Overlay>
      </View>
      <Nav />
    </SafeAreaView>
  );
}
