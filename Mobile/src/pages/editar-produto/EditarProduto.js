import { useEffect, useState } from "react";
import axios from "axios";
import FlashMessage, { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ScrollView,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Text } from "@rneui/base";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { styles } from "./EditarProdutoStyle";
import { CheckBox, Icon, Overlay, Switch } from "react-native-elements";
import Form from "../../components/form/Form";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import("react-native-image-picker");
import { API_URL } from "../../const/apiUrl";

export default function CadastroDeProdutos({ route, navigation }) {
  const {
    id,
    nomeProduto,
    pontosConsumacao,
    pontosResgate,
    descricaoProduto,
    tiposPontos,
    lojaId,
  } = route.params;

  const [nome, setNome] = useState(nomeProduto);
  const [descricao, setDescricao] = useState(descricaoProduto);
  const [recompensa, setRecompensa] = useState(pontosConsumacao);
  const [resgate, setResgate] = useState(pontosResgate);
  const [imagem, setImagem] = useState("");
  const [photo, setPhoto] = useState();
  const [anyPointError, setAnyPointError] = useState(false);
  const [anyPointErrorMessage, setAnyPointErrorMessage] = useState("");
  const [infoRecompensa, setInfoRecompensa] = useState(false);
  const [infoResgate, setInfoResgate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    tiposPontos === "produto" ? 0 : 1
  );
  const [isEnabledResgate, setIsEnabledResgate] = useState(
    pontosResgate != 0 ? true : false
  );
  const [isEnabledRecompensa, setIsEnabledRecompensa] = useState(
    pontosConsumacao != 0 ? true : false
  );

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

  const deletarProduto = async () => {
    async function getToken() {
      await AsyncStorage.getItem("token")
        .then((tokenThen) => {
          const deletarProdutoRequest = async () => {
            await axios
              .delete(
                `${API_URL.base}/produtos/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${JSON.parse(tokenThen)}`,
                  },
                }
              )
              .then((res) => {
                showMessage({
                  message: "Sucesso",
                  description: res?.data?.message,
                  type: "success",
                });
                setTimeout(() => {
                  navigation.navigate("ProdutosCadastrados", { id: lojaId });
                }, 1500);
              })
              .catch(() => {
                showMessage({
                  message: "Erro",
                  description: "Erro ao excluir produto!",
                  type: "danger",
                });
              });
          };
          deletarProdutoRequest();
        })
        .catch((error) => {
          return null;
        });
    }
    getToken();
  };

  function handleNavigate() {
    if ((isEnabledRecompensa && recompensa) || (isEnabledResgate && resgate)) {
      navigation.navigate("ConfirmarUpdateProduto", {
        id: id,
        nome: nome,
        descricao: descricao,
        recompensa: isEnabledRecompensa ? recompensa : "",
        resgate: isEnabledResgate ? resgate : "",
        tipoPonto: selectedIndex === 0 ? "produto" : "manuais",
        imagem: imagem,
        permitirResgate: isEnabledResgate,
      });
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
    console.log("isEnabledRecompensa", isEnabledRecompensa);
  }, [selectedIndex]);  
  
    return (
    <SafeAreaView
      style={{ 
        backgroundColor: "#005098", 
        paddingTop: StatusBar.currentHeight,
        flex: 1 
      }}
    >
      <Header icon={true} onPress={() => navigation.goBack()} />
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={{ backgroundColor: "white" }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            style={{
              width: "100%",
              padding: 12,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "white",
            }}
          >
            <FlashMessage
              textStyle={{
                fontSize: 16,
                textAlign: "center",
                flexWrap: "wrap",
                alignSelf: "center",
              }}
              titleStyle={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                flexWrap: "wrap",
                alignSelf: "center",
              }}
              style={{
                minHeight: 80,
                paddingHorizontal: 16,
                paddingVertical: 12,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
              duration={1500}
            />
            <Text style={styles.title}>Editar produto</Text>
            <Button
              label={"Excluir produto"}
              padding={12}
              backgroundColor={"red"}
              textColor={"#ffffff"}
              fontWeight={"bold"}
              onPress={deletarProduto}
              borderRadius={5}
            />
          </View>
          <View style={[styles.container, { backgroundColor: "white", paddingBottom: 100 }]}>
            <Form>
              <Input
                title={"Nome"}
                onChange={(e) => setNome(e.nativeEvent.text)}
                placeholder={nomeProduto}
              />
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
                <Input
                  title={"Recompensa"}
                  maskType={"only-numbers"}
                  onChangeText={(e) => setRecompensa(e)}
                  value={recompensa}
                  placeholder={
                    pontosConsumacao ? pontosConsumacao.toString() : null
                  }
                />
              )}
              <View style={styles.permitirResgate}>
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
                <Input
                  title={"Resgate"}
                  maskType={"only-numbers"}
                  onChangeText={(e) => setResgate(e)}
                  value={resgate}
                  placeholder={pontosResgate ? pontosResgate.toString() : null}
                />
              )}
              <Text style={{ marginRight: 110 }}>Inserir foto do produto</Text>
              <Button
                activeOpacity={1}
                onPress={() => handleImageUser()}
                label={photo ? photo : "Alterar foto"}
                backgroundColor={"#DCDCDC"}
                width={"100%"}
                textColor={"#515151"}
                padding={16}
                fontSize={16}
                borderRadius={32}
                fontWeight={"bold"}
                marginBottom={16}
              />
              <Input
                title={"Descrição"}
                borderRadius={15}
                description={true}
                onChange={(e) => setDescricao(e.nativeEvent.text)}
                placeholder={descricaoProduto}
              />

              <Button
                onPress={handleNavigate}
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
      </View>
      <Nav />
    </SafeAreaView>
  );
}
