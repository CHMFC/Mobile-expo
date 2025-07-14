import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  Platform,
  Alert,
  TextInput
} from "react-native";
import { Icon } from "@rneui/base";
import { styles } from "./ConfirmacaoCadastroLojaStyles";
import { Text, Switch } from "react-native-elements";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { API_URL } from "../../const/apiUrl";
import { Overlay } from "@rneui/themed";

export default function ConfirmacaoCadastroLoja({ navigation, route }) {
  const {
    infoLoja,
    cep,
    logradouro,
    complemento,
    bairro,
    cidade,
    uf,
    latitude,
    longitude,
  } = route.params;
  console.log(infoLoja?.infoLoja?.data?.cnpj);

  const [codigoRepresentante, setCodigoRepresentante] = useState("");
  const [visible, setVisible] = useState(true);
  const [isEnabledCodigoRepresentante, setIsEnabledCodigoRepresentante] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const toggleSwitchRecompensa = () => {
    setIsEnabledCodigoRepresentante((previousState) => !previousState);
  };

  const { tokenStored } = usePersist();

  async function criarLoja() {
    const formData = new FormData();

    const dadosAPI = {
      razaoSocial: infoLoja?.infoLoja?.data?.razaoSocial,
      nomeFantasia: infoLoja?.infoLoja?.data?.nomeFantasia,
      cnpj: infoLoja?.infoLoja?.data?.cnpj,
      cpf: infoLoja?.infoLoja?.data?.cpf,
      nomeResponsavel: infoLoja?.infoLoja?.data?.nomeResponsavel,
      numeroContato: infoLoja?.infoLoja?.data?.numeroContato,
      inscricaoEstadual: infoLoja?.infoLoja?.data?.inscricaoEstadual,
      ativa: infoLoja?.infoLoja?.ativa,
      imagem: {
        name: infoLoja?.infoLoja?.imagem.fileName,
        type: infoLoja?.infoLoja?.imagem.type,
        uri:
          Platform.OS === "android"
            ? infoLoja?.infoLoja?.imagem.uri
            : infoLoja?.infoLoja?.imagem.uri.replace("file://", ""),
      },
      categoriaId: infoLoja?.infoLoja?.categoria,
      documentoComprovacao: {
        name: infoLoja?.infoLoja?.comprovante.fileName,
        type: infoLoja?.infoLoja?.comprovante.type,
        uri:
          Platform.OS === "android"
            ? infoLoja?.infoLoja?.comprovante.uri
            : infoLoja?.infoLoja?.comprovante.uri.replace("file://", ""),
      },
      latitude: latitude,
      longitude: longitude,
      cep: cep,
      logradouro: logradouro,
      complemento: complemento,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      regraDePontos: infoLoja?.infoLoja?.data?.pontos,
      expiracaoPontos: infoLoja?.infoLoja?.data?.expiracaoPontosProduto,
      expiracaoPontosManuais: infoLoja?.infoLoja?.data?.expiracaoPontosConsumo,
      regulamento: infoLoja?.infoLoja?.data?.regulamento,
      codigoRepresentante: isEnabledCodigoRepresentante && codigoRepresentante ? codigoRepresentante : null,
    };

    Object.entries(dadosAPI).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await axios
      .post(`${API_URL.base}/lojas/`, formData, {
        headers: {
          Authorization: `Bearer ${tokenStored}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        mostrarMensagem("Loja criada\nRedirecionando...");
        setTimeout(() => navigation.navigate("MinhasLojas"), 1500);
      })
      .catch((error) => {
        console.log(error);
        const errResponse =
          (error && error.response && error.response.data) ||
          (error && error.message);

        console.log(error.response.data);
        Alert.alert(errResponse[0]?.error);
        console.log(infoLoja?.infoLoja?.categoria);
        console.error("ERRO AO CRIAR LOJA", errResponse[0]?.error);
      });
  }

  const mostrarMensagem = (mensagem) => {
    showMessage({
      message: "Sucesso",
      description: mensagem,
      type: "success",
      style: { height: 100 },
      titleStyle: {
        fontWeight: "bold",
        fontSize: 20,
        justifyContent: "center",
        marginTop: "auto",
        alignSelf: "center",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header icon={true} onPress={() => navigation.goBack()} />
      <View>
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
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.text}>
          <Text style={styles.textH3}>Confirmar Informações</Text>
        </View>
        <View style={styles.details}>
          <View style={styles.textContainer}>
            <Text style={styles.textTitulo}>Razão Social</Text>
            <Text style={styles.textInfoUsuario}>
              {infoLoja?.infoLoja?.data?.razaoSocial}
            </Text>
            <Text style={styles.textTitulo}>Nome fantasia</Text>
            <Text style={styles.textInfoUsuario}>
              {infoLoja?.infoLoja?.data?.nomeFantasia}
            </Text>
            {infoLoja?.infoLoja?.data?.cnpj && (
              <>
                <Text style={styles.textTitulo}>CNPJ</Text>

                <Text style={styles.textInfoUsuario}>
                  {infoLoja?.infoLoja?.data?.cnpj}
                </Text>
              </>
            )}
            {infoLoja?.infoLoja?.data?.cpf && (
              <>
                <Text style={styles.textTitulo}>CPF</Text>

                <Text style={styles.textInfoUsuario}>
                  {infoLoja?.infoLoja?.data?.cpf}
                </Text>
              </>
            )}
            <Text style={styles.textTitulo}>Número para contato</Text>
            <Text style={styles.textInfoUsuario}>
              {infoLoja?.infoLoja?.data?.numeroContato}
            </Text>
            <Text style={styles.textTitulo}>Inscrição estadual</Text>
            <Text style={styles.textInfoUsuario}>
              {infoLoja?.infoLoja?.data?.inscricaoEstadual}
            </Text>
            {infoLoja?.infoLoja?.data?.pontos && (
              <>
                <Text style={styles.textTitulo}>Regra de pontos</Text>
                <Text style={styles.textInfoUsuario}>
                  {infoLoja?.infoLoja?.data?.pontos}
                </Text>
              </>
            )}
            {infoLoja?.data?.expiracaoPontos && (
              <>
                <Text style={styles.textTitulo}>Expiração dos pontos</Text>
                <Text style={styles.textInfoUsuario}>
                  {infoLoja?.infoLoja?.data?.expiracaoPontos} dias
                </Text>
              </>
            )}
            <Text style={styles.textImage}>Imagem escolhida</Text>
            <Image
              style={styles.image}
              source={{ uri: infoLoja?.infoLoja?.imagem.uri }}
            />
            <Text style={styles.textImage}>Documento de comprovação</Text>
            <Image
              style={styles.image}
              source={{ uri: infoLoja?.infoLoja?.comprovante.uri }}
            />
          </View>
        </View>

        <Overlay
          isVisible={visible}
          overlayStyle={{ width: "90%", borderRadius: 16 }}
          onBackdropPress={toggleOverlay}
        >
          <View style={{ alignItems: 'center', paddingHorizontal: 10, paddingTop: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Código de Representante
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, marginTop: 10 }}>
                Adicionar código de representnate?
              </Text>

              <Switch
                style={{ marginTop: 10, marginLeft: 10 }}
                trackColor={{ false: "#DCDCDC", true: "#C9CFFF" }}
                thumbColor={isEnabledCodigoRepresentante ? "#005098" : "#FFFFFF"}
                onValueChange={toggleSwitchRecompensa}
                value={isEnabledCodigoRepresentante}
              />
            </View>

            {isEnabledCodigoRepresentante && (
              <TextInput
                value={codigoRepresentante}
                onChange={(e) => setCodigoRepresentante(e.nativeEvent.text)}
                placeholderTextColor="#878383"
                placeholder="Código do Representante"
                style={{
                  backgroundColor: "#DCDCDC",
                  width: "100%",
                  borderRadius: 32,
                  padding: 16,
                  marginTop: 12,
                  color: "#000000",
                }}
              />
            )}

            <Button
              label={"Criar loja"}
              backgroundColor={"#005098"}
              borderRadius={25}
              onPress={() => criarLoja()}
              fontSize={14}
              fontWeight="bold"
              textColor={"white"}
              width={250}
              padding={18}
              marginTop={24}
              marginBottom={12}
            />
          </View>
        </Overlay>


        <Button
          label={"Criar loja"}
          backgroundColor={"#005098"}
          borderRadius={25}
          onPress={() => toggleOverlay()}
          fontSize={14}
          fontWeight="bold"
          textColor={"white"}
          width={250}
          padding={18}
          marginTop={12}
          marginBottom={12}
        />

        <Button
          label={"Cancelar"}
          borderRadius={25}
          backgroundColor={"#DCDCDC"}
          onPress={() => navigation.navigate("MinhasLojas")}
          fontSize={14}
          fontWeight="bold"
          textColor={"black"}
          width={250}
          padding={18}
        />
      </ScrollView>
      <Nav />
    </SafeAreaView>
  );
}
