import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckBox, Icon, Overlay, Switch } from "react-native-elements";
import Button from "../../components/button/Button";
import Form from "../../components/form/Form";
import Header from "../../components/header/Header";
import Input from "../../components/input/Input";
import Nav from "../../components/nav/Nav";
import { styles } from "./cadastroDeProdutosStyle";

// 1. Importação corrigida para usar a biblioteca do Expo
import * as ImagePicker from 'expo-image-picker';

export default function CadastroDeProdutos({ route, navigation }) {
  const { id, endereco, razaoSocial } = route.params;

  const [isEnabledResgate, setIsEnabledResgate] = useState(true);
  const [isEnabledRecompensa, setIsEnabledRecompensa] = useState(true);
  const [descricao, setDescricao] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imagem, setImagem] = useState(null);
  const [photo, setPhoto] = useState("");
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

  const exibirInfoRecompensa = () => setInfoRecompensa(!infoRecompensa);
  const exibirInfoResgate = () => setInfoResgate(!infoResgate);
  const toggleSwitchResgate = () => setIsEnabledResgate((previousState) => !previousState);
  const toggleSwitchRecompensa = () => setIsEnabledRecompensa((previousState) => !previousState);

  // 2. Lógica de seleção de imagem unificada e corrigida para o padrão Expo
  const handleImageUser = () => {
    Alert.alert(
      "Selecione a fonte",
      "De onde você quer pegar a foto?",
      [
        { text: "Galeria", onPress: () => pickImageFrom('gallery') },
        { text: "Câmera", onPress: () => pickImageFrom('camera') },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const pickImageFrom = async (source) => {
    let result;
    const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
    };

    if (source === 'gallery') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria.');
            return;
        }
        result = await ImagePicker.launchImageLibraryAsync(options);
    } else { // Câmera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à sua câmera.');
            return;
        }
        result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.canceled) {
        setImagem(result.assets[0]);
        setPhoto("Inserido");
    }
  };

  function handleNavigate(data) {
    if (!isEnabledRecompensa && !isEnabledResgate) {
        setAnyPointError(true);
        setAnyPointErrorMessage("Ative e preencha ao menos uma das opções: Recompensa ou Resgate.");
        return;
    }

    navigation.navigate("ConfirmacaoDeProduto", {
        id: id,
        nome: data.nome,
        descricao: descricao,
        recompensa: isEnabledRecompensa ? data.recompensa : "",
        resgate: isEnabledResgate ? data.resgate : "",
        tipoPonto: selectedIndex === 0 ? "produto" : "manuais",
        endereco: endereco,
        razaoSocial: razaoSocial,
        imagem: imagem,
        permitirResgate: isEnabledResgate,
    });
  }
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={[
          { backgroundColor: "white", paddingTop: StatusBar.currentHeight },
        ]}
      >
        <Header
          title={"FIDELIZE PE"}
          icon={true}
          onPress={() => navigation.goBack()}
        />
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
                onValueChange={toggleSwitchRecompensa}
                value={isEnabledRecompensa}
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
      <Nav />
    </SafeAreaView>
  );
}
