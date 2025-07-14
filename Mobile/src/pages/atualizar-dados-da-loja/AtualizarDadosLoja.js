import { Text } from "@rneui/base";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import Form from "../../components/form/Form";
import Button from "../../components/button/Button";
import { styles } from "./atualizarDadosLojaStyles";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from "react-native-image-picker";
import { Icon, Overlay } from "react-native-elements";
import usePersist from "../../hooks/usePersist";
import axios from "axios";
import useCategory from "../../hooks/useCategory";
import { API_URL } from "../../const/apiUrl";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";

export default function AtualizarDadosLoja({ navigation, route }) {
  const { id, imagemAtual, comprovanteAtual } = route.params;
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cpf, setCpf] = useState("");
  const [inscricaoEstadual, setInscricaoEstadual] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [numeroContato, setNumeroContato] = useState("");
  const [expiracaoPontosProduto, setExpiracaoPontosProduto] = useState("");
  const [expiracaoPontosConsumo, setExpiracaoPontosConsumo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [pontos, setPontos] = useState("");
  const [imagem, setImagem] = useState("");
  const [inseridoImagem, setInseridoImagem] = useState("");
  const [ativa, setAtiva] = useState(true);
  const [visible, setVisible] = useState(false);

  const [infoLoja, setInfoLoja] = useState([]);

  const { tokenStored } = usePersist();
  const { selectedCategory } = useCategory();

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      razaoSocial: infoLoja?.razaoSocial || "",
    }
  });

  useEffect(() => {
    async function resgatarRecompensasDiario() {
      await axios
        .get(`${API_URL.base}/lojas/${id}`, {
          headers: { Authorization: `Bearer ${tokenStored}` },
        })
        .then((response) => {
          setInfoLoja(response?.data);
        })
        .catch((err) => {
        });
    }
    resgatarRecompensasDiario();
  }, []);

  useEffect(() => {
    if (infoLoja?.razaoSocial) {
      setRazaoSocial(infoLoja.razaoSocial);
      setValue('razaoSocial', infoLoja.razaoSocial);
    }
  }, [infoLoja, setValue]);

  useEffect(() => {
    if (infoLoja?.categoria?.id) {
      setCategoria(infoLoja.categoria.id);
    }
  }, [infoLoja]);

  const inserirImagemDaLoja = async () => {
    const options = {
      mediaType: "photo",
      quality: 0.5,
    };
    const result = await launchImageLibrary(options);
    if (result?.assets) {
      setImagem(result.assets[0]);
      setInseridoImagem("Inserido");
    }
  };

  function navegarLojaEndereco() {
    navigation.navigate("AtualizarRegulamento", {
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
      imagem: imagem,
      imagemAtual: imagemAtual,
      comprovanteAtual: comprovanteAtual,
      infoLoja: infoLoja,
    });
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        backgroundColor="#005098"
        barStyle="light-content"
      />
      <Header
        title={"Atualizar Dados"}
        icon={true}
        onPress={() => navigation.goBack()}
        iconNotifications={false}
      />
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
            {errors.razaoSocial && (
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
                  title={"Razão Social"}
                  onChangeText={onChange}
                  placeholder={infoLoja.razaoSocial}
                  value={infoLoja.razaoSocial}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    borderRadius: 24,
                    padding: 16,
                    marginBottom: 16,
                    color: '#000000',
                    borderColor: errors.razaoSocial ? "red" : undefined,
                    borderWidth: errors.razaoSocial ? 1 : 0,
                  }}
                />
              )}
              name="razaoSocial"
            />

            <Input
              title={"Nome Fantasia"}
              onChangeText={(text) => setNomeFantasia(text)}
              placeholder={infoLoja.nomeFantasia}
              disabled={true}
            />

            {infoLoja.cnpj && (
              <Input
                title={"CNPJ"}
                maskType={"cnpj"}
                onChangeText={(text) => setCnpj(text)}
                placeholder={infoLoja.cnpj}
                disabled={true}
              />
            )}

            {infoLoja.cpf && (
              <Input
                title={"CPF"}
                maskType={"cpf"}
                onChangeText={(text) => setCpf(text)}
                value={infoLoja.cpf}
                disabled={true}
              />
            )}
            <Input
              title={"Inscrição Estadual"}
              onChangeText={(text) => setInscricaoEstadual(text)}
              value={inscricaoEstadual}
              placeholder={infoLoja.inscricaoEstadual}
            />
            <Input
              title={"Nome do responsável"}
              onChangeText={(text) => setNomeResponsavel(text)}
              value={nomeResponsavel}
              placeholder={infoLoja.nomeResponsavel}
            />
            <Input
              title={"Número para contato"}
              onChangeText={(text) => setNumeroContato(text)}
              value={numeroContato}
              placeholder={infoLoja.numeroContato}
              maskType={"cel-phone"}
            />

            <Text style={styles.label}>Selecione a categoria</Text>
            <View style={{
              width: '100%',
              backgroundColor: '#DCDCDC',
              borderRadius: 50,
              marginBottom: 16,
              overflow: 'hidden'
            }}>
              <Picker
                style={{ 
                  color: "#005098", 
                  width: "100%",
                }}
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
              >
                <Picker.Item label="Categoria da Empresa" value="" />
                {selectedCategory.map((data) => (
                  <Picker.Item
                    label={data?.nome}
                    value={data?.id}
                    key={data?.id}
                  />
                ))}
              </Picker>
            </View>

            <Input
              title={"Expiração de tickets"}
              placeholder={`${infoLoja.expiracaoPontos} dias`}
              maskType={"only-numbers"}
              onChangeText={(item) => setExpiracaoPontosProduto(item)}
              value={expiracaoPontosProduto}
            />

            <Input
              title={"Expiração de pontos"}
              placeholder={`${infoLoja.expiracaoPontosManuais} dias`}
              maskType={"only-numbers"}
              onChangeText={(item) => setExpiracaoPontosConsumo(item)}
              value={expiracaoPontosConsumo}
            />

            <Button
              activeOpacity={1}
              onPress={() => inserirImagemDaLoja()}
              label={
                inseridoImagem
                  ? "✔️ Imagem inserida"
                  : "Escolher imagem da loja"
              }
              backgroundColor={inseridoImagem ? "#7AFF9B" : "#DCDCDC"}
              width={"100%"}
              textColor={inseridoImagem ? "#313131" : "#515151"}
              padding={24}
              fontSize={16}
              borderRadius={32}
              fontWeight={"bold"}
              marginBottom={16}
            />

            <SafeAreaView
              style={{
                width: "100%",
                borderColor: "#dcdcdc",
                borderWidth: 1,
                borderRadius: 25,
                marginHorizontal: 8,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  display: "flex",
                  padding: 8,
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text>Regra de pontos</Text>
                </View>
                <TouchableOpacity onPress={toggleOverlay}>
                  <Icon
                    name="information-circle"
                    type="ionicon"
                    size={24}
                    color={"#005098"}
                    style={{ marginLeft: "5%", elevation: 10 }}
                  />
                </TouchableOpacity>
              </View>

              <Overlay
                isVisible={visible}
                overlayStyle={{ width: "90%" }}
                onBackdropPress={toggleOverlay}
              >
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    Como funciona a regra de pontos?
                  </Text>
                  <Text>
                    Você define aqui quantos pontos o seu cliente ganhará a cada
                    real gasto, bem como, qual será o benefício e com quantos
                    pontos ele ganhará. {"\n\n"}Exemplos: {"\n\n"}1 real = 1
                    ponto {"\n"}1 real = 2 pontos {"\n"}E assim em diante.
                  </Text>
                </View>
              </Overlay>

              <SafeAreaView style={{ width: "90%" }}>
                <Input
                  placeholder={`${infoLoja.regraDePontos}`}
                  title={"Pontos"}
                  onChangeText={(text) => setPontos(text)}
                  value={pontos}
                  keyboardType={"numeric"}
                />
              </SafeAreaView>
            </SafeAreaView>

            <Button
              onPress={handleSubmit(navegarLojaEndereco)}
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
