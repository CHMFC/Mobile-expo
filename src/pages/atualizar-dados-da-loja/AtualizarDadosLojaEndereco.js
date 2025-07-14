import { Text } from "@rneui/base";
import { ScrollView, View, SafeAreaView } from "react-native";
import Form from "../../components/form/Form";
import Button from "../../components/button/Button";
import { styles } from "./atualizarDadosLojaEnderecoStyles";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { useState } from "react";
import axios from "axios";
import { StatusBar } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function AtualizarDadosLojaEndereco({ navigation, route }) {
  const {
    id,
    razaoSocial,
    nomeFantasia,
    cnpj,
    cpf,
    inscricaoEstadual,
    nomeResponsavel,
    numeroContato,
    categoria,
    ativa,
    pontos,
    expiracaoPontosConsumo,
    expiracaoPontosProduto,
    imagem,
    comprovante,
    imagemAtual,
    comprovanteAtual,
    regulamento,
    infoLoja,
  } = route.params;

  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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

  function navegarConfirmarAtualizaçao() {
    navigation.navigate("atualizarDadosLojaSucesso", {
      id: id,
      razaoSocial: razaoSocial,
      nomeFantasia: nomeFantasia,
      cnpj: cnpj,
      cpf: cpf,
      inscricaoEstadual: inscricaoEstadual,
      nomeResponsavel: nomeResponsavel,
      numeroContato: numeroContato,
      categoria: categoria,
      ativa: ativa,
      pontos: pontos,
      expiracaoPontosConsumo: expiracaoPontosConsumo,
      expiracaoPontosProduto: expiracaoPontosProduto,
      regulamento: regulamento,
      imagem: imagem,
      imagemAtual: imagemAtual,
      comprovanteAtual: comprovanteAtual,
      cep: cep,
      logradouro: logradouro,
      complemento: complemento,
      bairro: complemento,
      uf: uf,
      latitude: latitude,
      longitude: longitude,
    });
  }

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
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <Header
        title={"FIDELIZE PE"}
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

      <ScrollView>
        <Text style={styles.title}>Alterar endereço da loja</Text>

        <View style={styles.container}>
          <Form>
            <Input
              title={"CEP"}
              maskType={"zip-code"}
              onChangeText={(text) => setCep(text)}
              value={cep}
              placeholder={infoLoja.endereco.cep}
              icon={true}
              iconName={"search"}
              onPress={autoFillAdressInfo}
            />
            <Input
              title={"Logradouro"}
              onChangeText={(text) => setLogradouro(text)}
              value={logradouro}
              placeholder={infoLoja.endereco.logradouro}
            />
            <Input
              title={"Complemento"}
              onChangeText={(text) => setComplemento(text)}
              value={complemento}
              placeholder={infoLoja.endereco.complemento}
            />
            <Input
              title={"Bairro"}
              onChangeText={(text) => setBairro(text)}
              value={bairro}
              placeholder={infoLoja.endereco.bairro}
            />
            <Input
              title={"Cidade"}
              onChangeText={(text) => setCidade(text)}
              value={cidade}
              placeholder={infoLoja.endereco.cidade}
            />
            <Input
              title={"UF"}
              onChangeText={(text) => setUf(text)}
              value={uf}
              placeholder={infoLoja.endereco.uf}
            />
            <Text style={{ marginBottom: 12 }}>
              Confirme se a latitude e longitude estão corretas antes de
              cadastrar
            </Text>

            <Input
              title={"Latitude"}
              onChangeText={(text) => setLatitude(text)}
              value={latitude}
              placeholder={infoLoja.endereco.latitude}
            />
            <Input
              title={"Longitude"}
              onChangeText={(text) => setLongitude(text)}
              value={longitude}
              placeholder={infoLoja.endereco.longitude}
            />

            <Button
              onPress={navegarConfirmarAtualizaçao}
              label={"Avançar"}
              backgroundColor={"#005098"}
              width={"100%"}
              textColor={"#FFFFFF"}
              padding={24}
              fontSize={16}
              borderRadius={50}
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
