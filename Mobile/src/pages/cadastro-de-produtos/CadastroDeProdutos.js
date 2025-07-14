import React, { useState, useEffect } from "react";

import {
  StatusBar,
  Text,
  ScrollView,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CheckBox, Icon, Overlay, Switch } from "react-native-elements";

import Form from "../../components/form/Form";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";

import { styles } from "./cadastroDeProdutosStyle";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useForm, Controller } from "react-hook-form";

export default function CadastroDeProdutos({ route, navigation }) {
  const { id, endereco, razaoSocial } = route.params;

  const [isEnabledResgate, setIsEnabledResgate] = useState(true);
  const [isEnabledRecompensa, setIsEnabledRecompensa] = useState(true);
  const [descricao, setDescricao] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imagem, setImagem] = useState("");
  const [photo, setPhoto] = useState();
  const [anyPointError, setAnyPointError] = useState(false);
  const [anyPointErrorMessage, setAnyPointErrorMessage] = useState("");
  const [infoRecompensa, setInfoRecompensa] = useState(false);
  const [infoResgate, setInfoResgate] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: "",
      recompensa: "",
      resgate: "",
    },
  });

  const exibirInfoRecompensa = () => {
    setInfoRecompensa(!infoRecompensa);
  };

  const exibirInfoResgate = () => {
    setInfoResgate(!infoResgate);
  };

  const toggleSwitchResgate = () => {
    setIsEnabledResgate((previousState) => !previousState);
    setAnyPointError(false);
  };

  const toggleSwitchRecompensa = () => {
    setIsEnabledRecompensa((previousState) => !previousState);
    setAnyPointError(false);
  };

  const handleImageUser = () => {
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
      setImagem(result.assets[0]);
      setPhoto("Inserido");
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
      setImagem(result.assets[0]);
      setPhoto("Inserido");
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

  function handleNavigate(data) {
    if (
      data?.nome &&
      ((isEnabledRecompensa && data?.recompensa) ||
        (isEnabledResgate && data?.resgate))
    ) {
      navigation.navigate("ConfirmacaoDeProduto", {
        id: id,
        nome: data?.nome,
        descricao: descricao,
        recompensa: isEnabledRecompensa ? data.recompensa : "",
        resgate: isEnabledResgate ? data?.resgate : "",
        tipoPonto: selectedIndex === 0 ? "produto" : "manuais",
        endereco: endereco,
        razaoSocial: razaoSocial,
        imagem: imagem,
        permitirResgate: isEnabledResgate,
      });
      setAnyPointError(false);
    } else {
      setAnyPointError(true);
      setAnyPointErrorMessage("Ative ao menos um abaixo!");
    }
  }

  useEffect(() => {
    if (selectedIndex === 0) {
      setIsEnabledRecompensa(true);
    } else {
      setIsEnabledRecompensa(false);
    }
  }, [selectedIndex]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#005098" }}>
      <Header
          title={"FIDELIZE PE"}
          icon={true}
          onPress={() => navigation.goBack()}
        />
     
     <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <Text style={styles.title}>Cadastro de produtos</Text>
        <View style={styles.container}>
          <Form>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Input
                  title={"Nome"}
                  placeholder={"Nome do produto"}
                  onChangeText={onChange}
                  value={value}
                  obrigatorio={true}
                />
              )}
              name="nome"
            />
            {errors.nome && (
              <Text style={{ color: "red", marginTop: -12, marginBottom: 12 }}>
                Nome do produto é obrigatório!
              </Text>
            )}

            <View>
              <Text style={{ color: "black", fontSize: 16 }}>
                Qual tipo de pontuação do produto?
              </Text>
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  checked={selectedIndex === 0}
                  title="Tickets"
                  onPress={() => setSelectedIndex(0)}
                  iconRight={true}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  containerStyle={{
                    backgroundColor: "transparent",
                  }}
                />
                <CheckBox
                  checked={selectedIndex === 1}
                  title="Pontos"
                  onPress={() => setSelectedIndex(1)}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  containerStyle={{ backgroundColor: "transparent" }}
                />
              </View>
            </View>

            {anyPointError && (
              <Text style={{ color: "red" }}>{anyPointErrorMessage}</Text>
            )}

            <View style={styles.permitirResgate}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: "black" }}>Permitir recompensa?</Text>
                <TouchableOpacity onPress={exibirInfoRecompensa}>
                  <Icon
                    name="information-circle"
                    type="ionicon"
                    size={16}
                    color={"#005098"}
                    style={{ marginLeft: "5%" }}
                  />
                </TouchableOpacity>
              </View>
              <Switch
                trackColor={{ false: "#DCDCDC", true: "#C9CFFF" }}
                thumbColor={isEnabledRecompensa ? "#005098" : "#FFFFFF"}
                onValueChange={() => {
                  if (selectedIndex === 0) {
                    toggleSwitchRecompensa();
                  }
                }}
                value={selectedIndex === 0 ? isEnabledRecompensa : false}
              />
            </View>
            <Overlay
              isVisible={infoRecompensa}
              onBackdropPress={exibirInfoRecompensa}
              overlayStyle={{ width: "90%" }}
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View />
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "700",
                      marginLeft: 8,
                    }}
                  >
                    Como funciona a recompensa?
                  </Text>
                  <TouchableOpacity style={{ alignSelf: "flex-end" }}>
                    <Icon
                      name="close-outline"
                      type="ionicon"
                      size={32}
                      color="#000"
                      onPress={exibirInfoRecompensa}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    textAlign: "auto",
                    color: "black",
                  }}
                >
                  Recompensa são os pontos ou tickets que se ganha ao comprar o
                  produto.
                </Text>
              </View>
            </Overlay>

            {isEnabledRecompensa && (
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    title={"Recompensa"}
                    placeholder={"Valor que o usuário ganhará"}
                    keyboardType={"numeric"}
                    onChangeText={onChange}
                    value={value}
                    obrigatorio={true}
                  />
                )}
                name="recompensa"
              />
            )}

            {isEnabledRecompensa && errors.recompensa && (
              <Text style={{ color: "red", marginTop: -12, marginBottom: 12 }}>
                Valor da recompensa é obrigatório!
              </Text>
            )}

            <View
              style={[
                styles.permitirResgate,
                {
                  marginTop:
                    !isEnabledRecompensa && !isEnabledResgate ? -12 : -20,
                },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: "black" }}>Permitir resgate?</Text>
                <TouchableOpacity onPress={exibirInfoResgate}>
                  <Icon
                    name="information-circle"
                    type="ionicon"
                    size={16}
                    color={"#005098"}
                    style={{ marginLeft: "5%" }}
                  />
                </TouchableOpacity>
              </View>
              <Switch
                trackColor={{ false: "#DCDCDC", true: "#C9CFFF" }}
                thumbColor={isEnabledResgate ? "#005098" : "#FFFFFF"}
                onValueChange={toggleSwitchResgate}
                value={isEnabledResgate}
              />
            </View>

            <Overlay
              isVisible={infoResgate}
              onBackdropPress={exibirInfoResgate}
              overlayStyle={{ width: "90%" }}
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View />
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "700",
                      marginLeft: 8,
                    }}
                  >
                    Como funciona o resgate?
                  </Text>
                  <TouchableOpacity style={{ alignSelf: "flex-end" }}>
                    <Icon
                      name="close-outline"
                      type="ionicon"
                      size={32}
                      color="#000"
                      onPress={exibirInfoResgate}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    textAlign: "auto",
                    color: "black",
                  }}
                >
                  Resgate são os pontos ou tickets necessários para resgatar o
                  produto.
                </Text>
              </View>
            </Overlay>
            {isEnabledResgate && (
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    title={"Resgate"}
                    placeholder={"Valor para o usuário resgatar"}
                    keyboardType={"numeric"}
                    onChangeText={onChange}
                    value={value}
                    obrigatorio={true}
                  />
                )}
                name="resgate"
              />
            )}

            {isEnabledResgate && errors.resgate && (
              <Text style={{ color: "red", marginTop: -12, marginBottom: 12 }}>
                Valor do resgate é obrigatório!
              </Text>
            )}

            <Text style={{ marginRight: 120, color: "black" }}>
              Inserir foto do produto
            </Text>
            <Button
              activeOpacity={1}
              onPress={() => handleImageUser()}
              label={photo ? "✔️ Imagem inserida" : "Inserir foto"}
              backgroundColor={photo ? "#7AFF9B" : "#DCDCDC"}
              width={"100%"}
              textColor={"#515151"}
              padding={16}
              fontSize={16}
              borderRadius={32}
              fontWeight={"bold"}
              marginBottom={16}
              marginTop={12}
            />
            <Input
              borderRadius={25}
              title={"Descrição"}
              description={true}
              onChange={(e) => setDescricao(e.nativeEvent.text)}
              placeholder={"Dê informações sobre seus produto e suas regras."}
            />

            <Button
              onPress={handleSubmit(handleNavigate)}
              label={"Avançar"}
              backgroundColor={"#005098"}
              width={"90%"}
              textColor={"#FFFFFF"}
              padding={16}
              fontSize={16}
              borderRadius={32}
              fontWeight={"bold"}
            />
          </Form>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <Nav />
    </SafeAreaView>
  );
}
