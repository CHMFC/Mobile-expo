import React, { useState } from "react";
import { ScrollView, View, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import Form from "../../components/form/Form";
import Button from "../../components/button/Button";
import { styles } from "./cadastroDeLojaEnderecoStyle";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import axios from "axios";
import { Text } from "react-native-elements";
import { StatusBar } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function CadastroDeLojaEndereco({ navigation, route }) {
  const infoLoja = route.params;
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState(false);

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
      },
    });
  };

  const autoFillAdressInfo = async () => {
    const cepReplace = cep.replace("-", "");

    await axios
      .get(`https://brasilapi.com.br/api/cep/v2/${cepReplace}`)
      .then(async (res) => {
        const endereco = res.data;
        setLogradouro(endereco.street);
        setBairro(endereco.neighborhood);
        setCidade(endereco.city);
        setUf(endereco.state);
        setLatitude(endereco.location?.coordinates?.latitude);
        setLongitude(endereco.location?.coordinates?.longitude);
        await axios.get(`https://opencep.com/v1/${cepReplace}`)
          .then((res) => {
            setComplemento(res.data.complemento);
          })
          .catch((error) => {
            mostrarMensagem("Erro!", error.code == "ERR_BAD_REQUEST" ? "CEP Inválido!" : "Erro ao buscar CEP!", "danger");
          });
      })
      .catch((error) => {
        mostrarMensagem("Erro!", error.code == "ERR_BAD_REQUEST" ? "CEP Inválido!" : "Erro ao buscar CEP!", "danger");
      });
  };

  function navegarConfirmarCadastro() {
    if (!cep || !logradouro || !complemento || !bairro || !cidade || !uf) {
      mostrarMensagem("Erro!", "Preencha os campos corretamente", "danger");
    } else {
      navigation.navigate("ConfirmaçãoCadastroLoja", {
        infoLoja: infoLoja,
        cep: cep,
        logradouro: logradouro,
        complemento: complemento,
        bairro: bairro,
        cidade: cidade,
        uf: uf,
        latitude: latitude,
        longitude: longitude,
      });
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        backgroundColor="#005098"
        barStyle="light-content"
      />
      <Header
        title={"Endereço da Loja"}
        icon={true}
        onPress={() => navigation.goBack()}
        iconNotifications={false}
      />
      <View>
        <FlashMessage
          textStyle={{
            
            fontSize: 20,
            lineHeight: 20,
            justifyContent: "center",
            alignSelf: "center",
            marginTop: "auto",
            textAlign: "center",
          }}
          duration={2000}
        />
      </View>
      <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 100
        }}
      >
        <View style={{ 
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 16
        }}>
          <Form>
            <Input
              obrigatorio={true}
              maskType={"zip-code"}
              title={"CEP"}
              onChangeText={(text) => setCep(text)}
              value={cep}
              icon={true}
              iconName={"search"}
              onPress={autoFillAdressInfo}
              style={{
                width: '100%',
                backgroundColor: '#DCDCDC',
                borderRadius: 24,
                padding: 16,
                marginBottom: 16
              }}
            />
            <Input
              obrigatorio={true}
              title={"Logradouro"}
              onChangeText={(text) => setLogradouro(text)}
              value={logradouro}
              style={{
                width: '100%',
                backgroundColor: '#DCDCDC',
                borderRadius: 24,
                padding: 16,
                marginBottom: 16
              }}
            />
            <Input
              obrigatorio={true}
              title={"Complemento"}
              onChangeText={(text) => setComplemento(text)}
              value={complemento}
              style={{
                width: '100%',
                backgroundColor: '#DCDCDC',
                borderRadius: 24,
                padding: 16,
                marginBottom: 16
              }}
            />
            <Input
              obrigatorio={true}
              title={"Bairro"}
              onChangeText={(text) => setBairro(text)}
              value={bairro}
              style={{
                width: '100%',
                backgroundColor: '#DCDCDC',
                borderRadius: 24,
                padding: 16,
                marginBottom: 16
              }}
            />
            <Input
              obrigatorio={true}
              title={"Cidade"}
              onChangeText={(text) => setCidade(text)}
              value={cidade}
              style={{
                width: '100%',
                backgroundColor: '#DCDCDC',
                borderRadius: 24,
                padding: 16,
                marginBottom: 16
              }}
            />
            <Input
              obrigatorio={true}
              title={"UF"}
              onChangeText={(text) => setUf(text)}
              value={uf}
              style={{
                width: '100%',
                backgroundColor: '#DCDCDC',
                borderRadius: 24,
                padding: 16,
                marginBottom: 16
              }}
            />
            <Text style={{
              marginBottom: 16,
              alignSelf: 'flex-start'
            }}>
              Confirme se a latitude e longitude estão corretas antes de
              cadastrar
            </Text>

            <Input
              obrigatorio={true}
              title={"Latitude"}
              onChangeText={(text) => setLatitude(text)}
              value={latitude}
              style={{
                width: '100%',
                backgroundColor: '#DCDCDC',
                borderRadius: 24,
                padding: 16,
                marginBottom: 16
              }}
            />
            <Input
              obrigatorio={true}
              title={"Longitude"}
              onChangeText={(text) => setLongitude(text)}
              value={longitude}
              style={{
                width: '100%',
                backgroundColor: '#DCDCDC',
                borderRadius: 24,
                padding: 16,
                marginBottom: 16
              }}
            />

            <Button
              onPress={navegarConfirmarCadastro}
              label={"Avançar"}
              backgroundColor={"#005098"}
              width={"100%"}
              textColor={"#FFFFFF"}
              padding={20}
              fontSize={16}
              borderRadius={50}
              fontWeight={"bold"}
              marginTop={16}
            />
          </Form>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <Nav />
    </View>
  );
}
