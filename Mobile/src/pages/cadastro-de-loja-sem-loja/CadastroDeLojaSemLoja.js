import React, { useState, useEffect } from "react";
import { Icon, Text } from "@rneui/base";
import {
  SafeAreaView,
  ScrollView,
  View,
  Alert,
  TouchableOpacity,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { styles } from "./cadastroDeLojaSemLojaStyle";
import { Picker } from "@react-native-picker/picker";
import Form from "../../components/form/Form";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { CheckBox, Overlay } from "@rneui/themed";
import { useForm, Controller } from "react-hook-form";

import useCategory from "../../hooks/useCategory";

export default function CadastroDeLojaSemLoja({ navigation }) {
  const { selectedCategory } = useCategory();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      cpf: "",
      inscricaoEstadual: "",
      nomeResponsavel: "",
      numeroContato: "",
      pontos: "",
      expiracaoPontosProduto: "",
      expiracaoPontosConsumo: "",
    },
  });

  const [categoria, setCategoria] = useState("");
  const [imagem, setImagem] = useState("");
  const [inseridoImagem, setInseridoImagem] = useState("");
  const [comprovante, setComprovante] = useState("");
  const [inseridoComprovante, setInseridoComprovante] = useState("");
  const [ativa] = useState(true);
  const [categoriaError, setcategoriaError] = useState(false);
  const [imagemError, setimagemError] = useState(false);
  const [comprovanteError, setComprovanteError] = useState(false);
  const [pontosError, setPontosError] = useState(false);
  const [selectedIndex, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (!categoria) {
      setcategoriaError(true);
    } else {
      setcategoriaError(false);
    }
    
    if (!imagem) {
      setimagemError(true);
    } else {
      setimagemError(false);
    }
    
    if (!comprovante) {
      setComprovanteError(true);
    } else {
      setComprovanteError(false);
    }
  }, [categoria, imagem, comprovante]);

  useEffect(() => {
    if (showErrors) {
      const pontos = watch("pontos");
      if (!pontos || pontos.trim() === "") {
        setPontosError(true);
      } else {
        setPontosError(false);
      }
    }
  }, [watch("pontos"), showErrors]);

  const inserirImagemDaLoja = async () => {
    const options = {
      mediaType: "photo",
      quality: 0.5,
    };
    const result = await launchImageLibrary(options);
    if (result?.assets) {
      setImagem(result.assets[0]);
      setInseridoImagem("Inserido");
      setimagemError(false);
      return;
    }
    Alert.alert("Operação cancelada pelo usuário", "Imagem não foi inserida", [
      {
        text: "Fechar",
        style: "cancel",
      },
    ]);
  };

  const inserirComprovante = () => {
    Alert.alert(
      "Selecione",
      "Informe de onde você quer pegar a foto",
      [
        {
          text: "Galeria",
          onPress: () => pickImageFromGalery(),
          style: "default",
        },
        {
          text: "Camera",
          onPress: () => pickImageFromCamera(),
          style: "default",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const pickImageFromGalery = async () => {
    const options = {
      mediaType: "photo",
      quality: 0.5,
    };
    const result = await launchImageLibrary(options);
    if (result?.assets) {
      setComprovante(result.assets[0]);
      setInseridoComprovante("Inserido");
      setComprovanteError(false);
      return;
    }
    Alert.alert("Operação cancelada pelo usuário", "Imagem não foi inserida", [
      {
        text: "Fechar",
        style: "cancel",
      },
    ]);
  };

  const pickImageFromCamera = async () => {
    const options = {
      mediaType: "photo",
      quality: 0.5,
      saveToPhotos: false,
      cameraType: "back",
    };
    const result = await launchCamera(options);
    if (result?.assets) {
      setComprovante(result.assets[0]);
      setInseridoComprovante("Inserido");
      setComprovanteError(false);
    } else {
      Alert.alert(
        "Operação cancelada pelo usuário",
        "Imagem não foi inserida",
        [
          {
            text: "Fechar",
            style: "cancel",
          },
        ]
      );
    }
  };

  function navegarLojaEndereco(data) {
    setShowErrors(true);
    
    if (!categoria) {
      setcategoriaError(true);
    }
    
    if (!imagem) {
      setimagemError(true);
    }
    
    if (!comprovante) {
      setComprovanteError(true);
    }
    
    if (categoria && imagem && comprovante) {
      navigation.navigate("CadastroRegulamento", {
        data: data,
        categoria: categoria,
        ativa: ativa,
        imagem: imagem,
        comprovante: comprovante,
      });
    }
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const isFormValid = () => {
    const pontos = watch("pontos");
    return (
      categoria && 
      imagem && 
      comprovante && 
      pontos && 
      pontos.trim() !== "" && 
      !errors.pontos &&
      !errors.razaoSocial &&
      !errors.nomeFantasia &&
      !errors.inscricaoEstadual &&
      !errors.nomeResponsavel &&
      !errors.numeroContato &&
      !errors.expiracaoPontosProduto &&
      !errors.expiracaoPontosConsumo &&
      ((selectedIndex === 0 && !errors.cnpj) || (selectedIndex === 1 && !errors.cpf))
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        backgroundColor="#005098"
        barStyle="light-content"
      />
      <Header
        title={"Informações da Loja"}
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
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Form>
            {errors.razaoSocial && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
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
                  obrigatorio={true}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    backgroundColor: "#DCDCDC",
                    width: "100%",
                    borderRadius: 32,
                    padding: 16,
                    marginBottom: 24,
                    color: "#000000",
                    borderColor: errors.razaoSocial && "red",
                    borderWidth: errors.razaoSocial ? 1 : 0,
                  }}
                />
              )}
              name="razaoSocial"
            />
            {errors.nomeFantasia && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
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
                  title={"Nome Fantasia"}
                  obrigatorio={true}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    backgroundColor: "#DCDCDC",
                    width: "100%",
                    borderRadius: 32,
                    padding: 16,
                    marginBottom: 24,
                    color: "#000000",
                    borderColor: errors.nomeFantasia && "red",
                    borderWidth: errors.nomeFantasia ? 1 : 0,
                  }}
                />
              )}
              name="nomeFantasia"
            />

            {errors.cnpj && selectedIndex === 0 && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
              >
                Preencha com um CNPJ válido
              </Text>
            )}
            {errors.cpf && selectedIndex === 1 && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
              >
                Preencha com um CPF válido
              </Text>
            )}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{ color: "black", letterSpacing: 0.5, fontSize: 16 }}
              >
                Qual identificação você quer usar ?
              </Text>
              <CheckBox
                checked={selectedIndex === 0}
                title="CNPJ"
                onPress={() => setIndex(0)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{ backgroundColor: "transparent" }}
              />
              <CheckBox
                checked={selectedIndex === 1}
                title="CPF"
                onPress={() => setIndex(1)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{ backgroundColor: "transparent" }}
              />
            </View>

            {selectedIndex == 0 ? (
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    maskType={"cnpj"}
                    obrigatorio={true}
                    title={"CNPJ"}
                    onChangeText={onChange}
                    value={value}
                    style={{
                      backgroundColor: "#DCDCDC",
                      width: "100%",
                      borderRadius: 32,
                      padding: 16,
                      marginBottom: 24,
                      color: "#000000",
                      borderColor: errors.cnpj && "red",
                      borderWidth: errors.cnpj ? 1 : 0,
                    }}
                  />
                )}
                name="cnpj"
              />
            ) : (
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    maskType={"cpf"}
                    obrigatorio={true}
                    title={"CPF"}
                    onChangeText={onChange}
                    value={value}
                    style={{
                      backgroundColor: "#DCDCDC",
                      width: "100%",
                      borderRadius: 32,
                      padding: 16,
                      marginBottom: 24,
                      color: "#000000",
                      borderColor: errors.cpf && "red",
                      borderWidth: errors.cpf ? 1 : 0,
                    }}
                  />
                )}
                name="cpf"
              />
            )}
            {errors.inscricaoEstadual && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
              >
                Esse campo não pode ser vazio
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title={"Inscrição Estadual"}
                  obrigatorio={true}
                  placeholder={"Caso não possua digite ISENTO."}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    backgroundColor: "#DCDCDC",
                    width: "100%",
                    borderRadius: 32,
                    padding: 16,
                    marginBottom: 24,
                    color: "#000000",
                    borderColor: errors.inscricaoEstadual && "red",
                    borderWidth: errors.inscricaoEstadual ? 1 : 0,
                  }}
                />
              )}
              name="inscricaoEstadual"
            />

            {errors.nomeResponsavel && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
              >
                Nome do responsável não pode ser vazio
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title={"Nome do responsável"}
                  obrigatorio={true}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    backgroundColor: "#DCDCDC",
                    width: "100%",
                    borderRadius: 32,
                    padding: 16,
                    marginBottom: 24,
                    color: "#000000",
                    borderColor: errors.nomeResponsavel && "red",
                    borderWidth: errors.nomeResponsavel ? 1 : 0,
                  }}
                />
              )}
              name="nomeResponsavel"
            />

            {errors.numeroContato && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
              >
                Número de contato não pode ser vazio
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  maskType={"cel-phone"}
                  obrigatorio={true}
                  title={"Número para contato"}
                  onChangeText={onChange}
                  value={value}
                  placeholder={"Ex: (DDD)987654321"}
                  style={{
                    backgroundColor: "#DCDCDC",
                    width: "100%",
                    borderRadius: 32,
                    padding: 16,
                    marginBottom: 24,
                    color: "#000000",
                    borderColor: errors.numeroContato && "red",
                    borderWidth: errors.numeroContato ? 1 : 0,
                  }}
                />
              )}
              name="numeroContato"
            />

            {showErrors && categoriaError && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
              >
                A categoria não deve ser vazia
              </Text>
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginRight: "42%",
                marginBottom: 8,
              }}
            >
              <Text>Selecione a categoria</Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <View style={[styles.picker, { marginBottom: 24 }]}>
              <Picker
                style={{ color: "#005098", width: "100%" }}
                selectedValue={categoria}
                onValueChange={(itemValue) => {
                  setCategoria(itemValue);
                  if (itemValue) {
                    setcategoriaError(false);
                  } else {
                    setcategoriaError(true);
                  }
                }}
              >
                <Picker.Item key="default" label="Categoria da Empresa" value="" />
                {selectedCategory.map((data) => (
                  <Picker.item
                    key={data?.id}
                    label={data?.nome}
                    value={data?.id}
                  />
                ))}
              </Picker>
            </View>
            {errors.expiracaoPontos && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
              >
                Defina em dias a expiração dos tickets.
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title={"Expiração de tickets"}
                  placeholder={"Digite em dias"}
                  maskType={"only-numbers"}
                  obrigatorio={true}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    backgroundColor: "#DCDCDC",
                    width: "100%",
                    borderRadius: 32,
                    padding: 16,
                    marginBottom: 24,
                    color: "#000000",
                    borderColor: errors.expiracaoPontos && "red",
                    borderWidth: errors.expiracaoPontos ? 1 : 0,
                  }}
                />
              )}
              name="expiracaoPontosProduto"
            />

            {errors.expiracaoPontos && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
              >
                Defina em dias a expiração dos pontos.
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title={"Expiração de pontos"}
                  placeholder={"Digite em dias"}
                  maskType={"only-numbers"}
                  obrigatorio={true}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    backgroundColor: "#DCDCDC",
                    width: "100%",
                    borderRadius: 32,
                    padding: 16,
                    marginBottom: 24,
                    color: "#000000",
                    borderColor: errors.expiracaoPontos && "red",
                    borderWidth: errors.expiracaoPontos ? 1 : 0,
                  }}
                />
              )}
              name="expiracaoPontosConsumo"
            />

            {showErrors && imagemError && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
              >
                Selecione uma imagem
              </Text>
            )}
            <Button
              activeOpacity={1}
              onPress={() => {
                imagem && setimagemError(false);
                inserirImagemDaLoja();
              }}
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
            {showErrors && comprovanteError && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%", marginBottom: 8 }}
              >
                Selecione o comprovante
              </Text>
            )}
            <Button
              activeOpacity={1}
              onPress={() => {
                comprovante && setComprovanteError(false);
                inserirComprovante();
              }}
              label={
                inseridoComprovante
                  ? "✔️ Comprovante inserido"
                  : "Inserir comprovante"
              }
              backgroundColor={inseridoComprovante ? "#7AFF9B" : "#DCDCDC"}
              width={"100%"}
              textColor={inseridoComprovante ? "#313131" : "#515151"}
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
                marginBottom: 24,
              }}
            >
              {showErrors && (errors.pontos || pontosError) && (
                <Text
                  style={{ 
                    color: "red", 
                    fontWeight: "bold", 
                    maxWidth: "100%",
                    marginTop: 8,
                    marginBottom: 8,
                    alignSelf: "flex-start",
                    marginLeft: 16
                  }}
                >
                  Os pontos devem ser preenchidos corretamente
                </Text>
              )}

              <View
                style={{
                  display: "flex",
                  padding: 8,
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text>Regra de pontos</Text>
                  <Text style={{ color: "red" }}>*</Text>
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

                <Button
                  icon={
                    <Icon
                      name="wrench"
                      type="font-awesome"
                      color="white"
                      size={25}
                      iconStyle={{ marginRight: 10 }}
                    />
                  }
                  title="Start Building"
                  onPress={toggleOverlay}
                />
              </Overlay>

              <SafeAreaView style={{ width: "90%", marginBottom: 16 }}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder={"1"}
                      title={"Pontos"}
                      onChangeText={(text) => {
                        onChange(text);
                        if (showErrors) {
                          if (!text || text.trim() === "") {
                            setPontosError(true);
                          } else {
                            setPontosError(false);
                          }
                        }
                      }}
                      value={value}
                      keyboardType={"numeric"}
                      style={{
                        backgroundColor: "#DCDCDC",
                        width: "100%",
                        borderRadius: 32,
                        padding: 16,
                        marginBottom: 8,
                        color: "#000000",
                        borderColor: showErrors && (errors.pontos || pontosError) ? "red" : undefined,
                        borderWidth: showErrors && (errors.pontos || pontosError) ? 1 : 0,
                      }}
                    />
                  )}
                  name="pontos"
                />
              </SafeAreaView>
            </SafeAreaView>

            {!isFormValid() ? (
              <Button
                label={"Avançar"}
                backgroundColor={"#DCDCDC"}
                width={"100%"}
                textColor={"#FFFFFF"}
                padding={20}
                fontSize={16}
                borderRadius={50}
                fontWeight={"bold"}
                marginTop={16}
                disabled={true}
              />
            ) : (
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
            )}
          </Form>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <Nav 
        home={false}
        meusPedidos={false}
        RecompensaSelect={false}
        conta={false}
        completarCadastro={false}
      />
    </View>
  );
}
