import React, { useState } from "react";
import { ScrollView, View, SafeAreaView } from "react-native";
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
  console.log(infoLoja.infoLoja?.imagem);

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
            console.error("Erro:", error.message, "| Code:", error.code);
          });
      })
      .catch((error) => {
        mostrarMensagem("Erro!", error.code == "ERR_BAD_REQUEST" ? "CEP Inválido!" : "Erro ao buscar CEP!", "danger");
        console.error("Erro:", error.message, "| Code:", error.code);
      });
  };

  function navegarConfirmarCadastro() {
    if (!cep || !logradouro || !complemento || !bairro || !cidade || !uf) {
      alert("Preencha os campos corretamente");
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
    <SafeAreaView
      style={{ backgroundColor: "white", paddingTop: StatusBar.currentHeight }}
    >
      <ScrollView>
        <Header
          title={"Endereço da Loja"}
          icon={true}
          onPress={() => navigation.goBack()}
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

        <View style={styles.container}>
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
            />
            <Input
              obrigatorio={true}
              title={"Logradouro"}
              onChangeText={(text) => setLogradouro(text)}
              value={logradouro}
            />
            <Input
              obrigatorio={true}
              title={"Complemento"}
              onChangeText={(text) => setComplemento(text)}
              value={complemento}
            />
            <Input
              obrigatorio={true}
              title={"Bairro"}
              onChangeText={(text) => setBairro(text)}
              value={bairro}
            />
            <Input
              obrigatorio={true}
              title={"Cidade"}
              onChangeText={(text) => setCidade(text)}
              value={cidade}
            />
            <Input
              obrigatorio={true}
              title={"UF"}
              onChangeText={(text) => setUf(text)}
              value={uf}
            />
            <Text>
              Confirme se a latitude e longitude estão corretas antes de
              cadastrar
            </Text>

            <Input
              obrigatorio={true}
              title={"Latitude"}
              onChangeText={(text) => setLatitude(text)}
              value={latitude}
            />
            <Input
              obrigatorio={true}
              title={"Longitude"}
              onChangeText={(text) => setLongitude(text)}
              value={longitude}
            />

            <Button
              onPress={navegarConfirmarCadastro}
              label={"Avançar"}
              backgroundColor={"#005098"}
              width={"90%"}
              textColor={"#FFFFFF"}
              padding={16}
              fontSize={16}
              borderRadius={32}
              fontWeight={"bold"}
              marginBottom={10}
            />
          </Form>
        </View>
      </ScrollView>
      <Nav />
    </SafeAreaView>
  );
}
