import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@rneui/base";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker'; // 1. Importação correta do Expo
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View
} from "react-native";
import { CheckBox, Icon, Overlay, Switch } from "react-native-elements";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Button from "../../components/button/Button";
import Form from "../../components/form/Form";
import Header from "../../components/header/Header";
import Input from "../../components/input/Input";
import Nav from "../../components/nav/Nav";
import { API_URL } from "../../const/apiUrl";
import { styles } from "./EditarProdutoStyle";


export default function EditarProduto({ route, navigation }) { // Renomeado para EditarProduto
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
  const [imagem, setImagem] = useState(null);
  const [photo, setPhoto] = useState("");
  const [anyPointError, setAnyPointError] = useState(false);
  const [anyPointErrorMessage, setAnyPointErrorMessage] = useState("");
  const [infoRecompensa, setInfoRecompensa] = useState(false);
  const [infoResgate, setInfoResgate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    tiposPontos === "produto" ? 0 : 1
  );
  const [isEnabledResgate, setIsEnabledResgate] = useState(
    !!pontosResgate && pontosResgate != 0
  );
  const [isEnabledRecompensa, setIsEnabledRecompensa] = useState(
    !!pontosConsumacao && pontosConsumacao != 0
  );

  const exibirInfoRecompensa = () => setInfoRecompensa(!infoRecompensa);
  const exibirInfoResgate = () => setInfoResgate(!infoResgate);
  const toggleSwitchResgate = () => setIsEnabledResgate((previous) => !previous);
  const toggleSwitchRecompensa = () => setIsEnabledRecompensa((previous) => !previous);

  // 2. Lógica de seleção de imagem corrigida e unificada
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

    try {
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
    } catch (error) {
        console.error("Erro ao selecionar imagem:", error);
        Alert.alert("Erro", "Não foi possível carregar a imagem.");
    }
  };


  const deletarProduto = async () => {
    try {
        const tokenThen = await AsyncStorage.getItem("token");
        if (!tokenThen) throw new Error("Token não encontrado");
        
        await axios.delete(
            `${API_URL.base}/produtos/${id}`,
            {
                headers: { Authorization: `Bearer ${JSON.parse(tokenThen)}` },
            }
        );

        showMessage({
            message: "Sucesso",
            description: "Produto excluído com sucesso!",
            type: "success",
            style: { height: 100 },
            titleStyle: { fontWeight: "bold", fontSize: 20, justifyContent: "center", marginTop: "auto", alignSelf: "center" },
        });
        setTimeout(() => {
            navigation.navigate("ProdutosCadastrados", { id: lojaId });
        }, 1500);
    } catch (error) {
        console.error("Erro ao excluir produto:", error.response?.data || error.message);
        showMessage({
            message: "Erro",
            description: "Não foi possível excluir o produto.",
            type: "danger",
            style: { height: 100 },
            titleStyle: { fontWeight: "bold", fontSize: 20, justifyContent: "center", marginTop: "auto", alignSelf: "center" },
        });
    }
  };

  function handleNavigate() {
    if ((!isEnabledRecompensa || !recompensa) && (!isEnabledResgate || !resgate)) {
        setAnyPointError(true);
        setAnyPointErrorMessage("Ative e preencha ao menos uma das opções: Recompensa ou Resgate.");
        return;
    }
    
    setAnyPointError(false);
    navigation.navigate("ConfirmarUpdateProduto", {
        id: id,
        nome: nome,
        descricao: descricao,
        recompensa: isEnabledRecompensa ? recompensa : "0",
        resgate: isEnabledResgate ? resgate : "0",
        tipoPonto: selectedIndex === 0 ? "produto" : "manuais",
        imagem: imagem,
        permitirResgate: isEnabledResgate,
    });
  }
  
  return (
    <SafeAreaView
      style={{ backgroundColor: "white", paddingTop: StatusBar.currentHeight }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header icon={true} onPress={() => navigation.goBack()} />

        <View
          style={{
            width: "100%",
            padding: 12,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
        <View style={styles.container}>
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
              <Input
                title={"Recompensa"}
                maskType={"only-numbers"}
                onChangeText={(e) => setRecompensa(e)}
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
      <Nav />
    </SafeAreaView>
  );
}
