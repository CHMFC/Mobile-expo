import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableHighlight,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Overlay } from "@rneui/themed";
import { styles } from "./CadastroDeFuncionarioStyles";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import axios from "axios";
import { Avatar, Text } from "react-native-elements";
import usePersist from "../../hooks/usePersist";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Icon from "react-native-vector-icons/Ionicons";
import useNotification from "../../hooks/useNotification";
import { API_URL } from "../../const/apiUrl";

export default function CadastroDeFuncionario({ route, navigation }) {
  const { id } = route.params;
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { tokenStored } = usePersist();
  const [isSearching, setIsSearching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tokenCelular, setTokenCelular] = useState("");
  const { setNotification, allNotifications } = useNotification();

  const toggleOverlay = () => {
    setVisible(!visible);
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

  useEffect(() => {
    const fetchData = async () => {
      if (isSearching) {
        try {
          const response = await axios.get(
            `${API_URL.base}/usuarios/search/${searchQuery}`
          );
          setData(response.data);
          setTokenCelular(response.data.tokenCelular);
        } catch (error) {
        }
        setIsSearching(false);
      }
    };
    fetchData();
  }, [isSearching]);

  const cadastroFuncionarioNotification = async () => {
    try {
      const response = await axios.post(
        `${API_URL.base}/pushnotification`,
        {
          tokenCelular: [tokenCelular],
          title: "Funcionário cadastrado!",
          body: "Você foi cadastrado como funcionário!",
        }
      );
    } catch (err) {
    }
  };
  const cadastrar = async (usuarioId) => {
    try {
      await axios
        .post(
          `${API_URL.base}/lojas/${id}/funcionarios/`,
          {
            usuarioId: usuarioId,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenStored}`,
            },
          }
        )
        .then(() => {
          mostrarMensagem(
            "Sucesso!",
            "Funcionário cadastrado com sucesso!",
            "success"
          );
          cadastroFuncionarioNotification();
          navigation.navigate("OpcoesLoja", { id: id });
        });
    } catch (error) {
      mostrarMensagem("Falha!", "Erro ao cadastrar funcionário!", "danger");
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
  };

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      > 
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#005098",
      }}
    >
     
      <View
        style={{
          width: "100%",
          backgroundColor: "white",
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
          duration={2000}
        />
        <Text
          
          style={{
            fontSize: 24,
            fontWeight: "700",
            textAlign: "center",
            padding: 8,

          }}
        >
          Pesquisar Usuário
        </Text>
        <View style={[styles.search.container, { flexDirection: "row" }]}>
          <TextInput
            placeholder="Email ou CPF"
            style={styles.search.input}
            placeholderTextColor="grey"
            onChangeText={(text) => setSearchQuery(text)}
            returnKeyType={"search"}
            onSubmitEditing={handleSearch}
            value={searchQuery}
            autoCapitalize="none"
          />
          <Icon
            name="search"
            color="#878383"
            size={24}
            onPress={handleSearch}
          />
        </View>
      </View>

      <View style={{ flex: 1, height: "100%", backgroundColor: "white" }}>
        {searchQuery !== "" && (
          <ScrollView>
            {data && (
              <View key={data.id}>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: 20,
                  }}
                >
                  {data.imagem ? (
                    <Avatar
                      size={"xlarge"}
                      rounded={true}
                      source={{ uri: data.imagem }}
                    />
                  ) : (
                    <Icon
                      name="person-circle"
                      type="ionicon"
                      size={96}
                      color="#C4C4C4"
                    />
                  )}
                  <Text style={{ fontSize: 24, fontWeight: "700" }}>
                    {data.nome}
                  </Text>
                  <Text>ID #{data.id}</Text>
                  <Text>Nome: {data.nome}</Text>
                  <Button
                    label={"Cadastrar"}
                    backgroundColor={"#005098"}
                    width={"90%"}
                    textColor={"#FFFFFF"}
                    padding={16}
                    fontSize={16}
                    borderRadius={32}
                    fontWeight={"bold"}
                    marginTop={12}
                    marginBottom={72}
                    onPress={toggleOverlay}
                  />
                </View>
              </View>
            )}
          </ScrollView>
        )}
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <TouchableHighlight
            style={{
              position: "absolute",
              right: 0,
              zIndex: 1,
            }}
            onPress={toggleOverlay}
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
            <View style={styles.divDados}>
              {data.imagem ? (
                <Avatar
                  size={"large"}
                  rounded={true}
                  source={{ uri: data.imagem }}
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
                }}
              >
                Você deseja realmente cadastrar{" "}
                <Text style={{ fontWeight: "700" }}>{data.nome}</Text> como um
                dos seus funcionarios?
              </Text>
            </View>
            <View style={{ width: "100%" }}>
              <Button
                backgroundColor={"#005098"}
                width={"100%"}
                textColor={"#FFFFFF"}
                padding={16}
                fontSize={16}
                borderRadius={32}
                fontWeight={"bold"}
                onPress={() => {
                  cadastrar(data?.id);
                }}
                label="Confirmar"
              />
            </View>
          </View>
        </Overlay>
        <Nav />
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
