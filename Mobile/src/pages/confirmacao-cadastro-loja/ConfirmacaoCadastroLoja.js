import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  Platform,
  Alert,
  TextInput,
  StatusBar
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
      razaoSocial: infoLoja.razaoSocial,
      nomeFantasia: infoLoja.nomeFantasia,
      cnpj: infoLoja.cnpj,
      cpf: infoLoja.cpf,
      nomeResponsavel: infoLoja.nomeResponsavel,
      numeroContato: infoLoja.numeroContato,
      inscricaoEstadual: infoLoja.inscricaoEstadual,
      ativa: infoLoja.ativa,
      imagem: {
        name: infoLoja.imagem?.fileName,
        type: infoLoja.imagem?.type,
        uri:
          Platform.OS === "android"
            ? infoLoja.imagem?.uri
            : infoLoja.imagem?.uri.replace("file://", ""),
      },
      categoriaId: infoLoja.categoria,
      documentoComprovacao: {
        name: infoLoja.comprovante?.fileName,
        type: infoLoja.comprovante?.type,
        uri:
          Platform.OS === "android"
            ? infoLoja.comprovante?.uri
            : infoLoja.comprovante?.uri.replace("file://", ""),
      },
      latitude: latitude,
      longitude: longitude,
      cep: cep,
      logradouro: logradouro,
      complemento: complemento,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      regraDePontos: infoLoja.pontos,
      expiracaoPontos: infoLoja.expiracaoPontosProduto,
      expiracaoPontosManuais: infoLoja.expiracaoPontosConsumo,
      regulamento: infoLoja.regulamento,
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
        const errResponse =
          (error && error.response && error.response.data) ||
          (error && error.message);

        Alert.alert(errResponse[0]?.error);
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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        backgroundColor="#005098"
        barStyle="light-content"
      />
      <Header 
        icon={true} 
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
          duration={1500}
        />
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false}
      >
        <View style={{
          flex: 1,
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 100
        }}>
          <View style={styles.text}>
            <Text style={styles.textH3}>Confirmar Informações</Text>
          </View>
          <View style={[styles.details, { marginTop: 16, width: '100%' }]}>
            <View style={styles.textContainer}>
              <Text style={styles.textTitulo}>Razão Social</Text>
              <Text style={styles.textInfoUsuario}>
                {infoLoja.razaoSocial}
              </Text>
              <Text style={styles.textTitulo}>Nome fantasia</Text>
              <Text style={styles.textInfoUsuario}>
                {infoLoja.nomeFantasia}
              </Text>
              {infoLoja.cnpj && (
                <>
                  <Text style={styles.textTitulo}>CNPJ</Text>
                  <Text style={styles.textInfoUsuario}>
                    {infoLoja.cnpj}
                  </Text>
                </>
              )}
              {infoLoja.cpf && (
                <>
                  <Text style={styles.textTitulo}>CPF</Text>
                  <Text style={styles.textInfoUsuario}>
                    {infoLoja.cpf}
                  </Text>
                </>
              )}
              <Text style={styles.textTitulo}>Número para contato</Text>
              <Text style={styles.textInfoUsuario}>
                {infoLoja.numeroContato}
              </Text>
              <Text style={styles.textTitulo}>Inscrição estadual</Text>
              <Text style={styles.textInfoUsuario}>
                {infoLoja.inscricaoEstadual}
              </Text>
              {infoLoja.pontos && (
                <>
                  <Text style={styles.textTitulo}>Regra de pontos</Text>
                  <Text style={styles.textInfoUsuario}>
                    {infoLoja.pontos}
                  </Text>
                </>
              )}
              {infoLoja.expiracaoPontosProduto && (
                <>
                  <Text style={styles.textTitulo}>Expiração dos tickets</Text>
                  <Text style={styles.textInfoUsuario}>
                    {infoLoja.expiracaoPontosProduto} dias
                  </Text>
                </>
              )}
              {infoLoja.expiracaoPontosConsumo && (
                <>
                  <Text style={styles.textTitulo}>Expiração dos pontos</Text>
                  <Text style={styles.textInfoUsuario}>
                    {infoLoja.expiracaoPontosConsumo} dias
                  </Text>
                </>
              )}
              <Text style={styles.textImage}>Imagem escolhida</Text>
              <Image
                style={styles.image}
                source={{ uri: infoLoja.imagem?.uri }}
              />
              <Text style={styles.textImage}>Documento de comprovação</Text>
              <Image
                style={styles.image}
                source={{ uri: infoLoja.comprovante?.uri }}
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
                  Adicionar código de representante?
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

          <View style={{ width: '100%', alignItems: 'center', paddingHorizontal: 16 }}>
            <Button
              label={"Criar loja"}
              backgroundColor={"#005098"}
              borderRadius={50}
              onPress={() => toggleOverlay()}
              fontSize={16}
              fontWeight="bold"
              textColor={"white"}
              width={"100%"}
              padding={20}
              marginTop={24}
              marginBottom={16}
            />

            <Button
              label={"Cancelar"}
              borderRadius={50}
              backgroundColor={"#DCDCDC"}
              onPress={() => navigation.navigate("MinhasLojas")}
              fontSize={16}
              fontWeight="bold"
              textColor={"black"}
              width={"100%"}
              padding={20}
            />
          </View>
        </View>
      </ScrollView>
      <Nav />
    </View>
  );
}
