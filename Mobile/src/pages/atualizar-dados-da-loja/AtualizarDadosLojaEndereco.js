import { Text } from "@rneui/base";
import { ScrollView, View, SafeAreaView } from "react-native";
import Form from "../../components/form/Form";
import Button from "../../components/button/Button";
import { styles } from "./atualizarDadosLojaEnderecoStyles";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Controller, useForm } from "react-hook-form";

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

  const { control, formState: { errors }, setValue } = useForm({
    defaultValues: {
      cep: infoLoja?.endereco?.cep || "",
    }
  });

  useEffect(() => {
    if (infoLoja?.endereco?.cep) {
      setCep(infoLoja.endereco.cep);
      setValue('cep', infoLoja.endereco.cep);
    }
  }, [infoLoja, setValue]);

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
          });
      })
      .catch((error) => {
        mostrarMensagem("Erro!", error.code == "ERR_BAD_REQUEST" ? "CEP Inválido!" : "Erro ao buscar CEP!", "danger");
      });
  };

  const isFormValid = () => {
    return cep && logradouro && bairro && cidade && uf;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        backgroundColor="#005098"
        barStyle="light-content"
      />
      <Header
        title={"Atualizar Endereço"}
        icon={true}
        onPress={() => navigation.goBack()}
        iconNotifications={false}
      />
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
            {errors?.cep && (
              <Text
                style={{
                  color: "red",
                  fontWeight: "bold",
                  maxWidth: "100%",
                  marginBottom: 8,
                  alignSelf: 'flex-start'
                }}
              >
                Preencha corretamente
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title={"CEP"}
                  obrigatorio={true}
                  onChangeText={(text) => {
                    onChange(text);
                    setCep(text);
                  }}
                  value={value}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    borderRadius: 24,
                    padding: 16,
                    marginBottom: 16,
                    color: '#000000',
                    borderColor: errors?.cep ? "red" : undefined,
                    borderWidth: errors?.cep ? 1 : 0,
                  }}
                />
              )}
              name="cep"
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
              label={"Atualizar"}
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
      <Nav />
    </View>
  );
}
