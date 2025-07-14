import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker'; // 1. Importação correta do Expo
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-elements";
import FlashMessage, { showMessage } from "react-native-flash-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Input from "../../components/input/Input";
import Nav from "../../components/nav/Nav";
import { API_URL } from "../../const/apiUrl";
import usePersist from "../../hooks/usePersist";
import { styles } from "./ContaUsuarioStyle";


export default function ContaUsuario({ navigation }) {
    const { tokenStored } = usePersist();
    const [nomeVazio, setNomeVazio] = useState(false);
    const [alterarNome, setAlterarNome] = useState("");
    const [alterarEmail, setAlterarEmail] = useState("");

    const [dataNascimento, setDataNascimento] = useState(new Date());
    const [dataMaxima, setDataMaxima] = useState(
        new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    );
    const [dataNascimentoVisivel, setDataNascimentoVisivel] = useState(false);
    const [DataNascimentoPlaceHolder, setDataNascimentoPlaceHolder] = useState(true);
    const [alterarCEP, setAlterarCEP] = useState("");

    const [alterarCidade, setAlterarCidade] = useState("");
    const [alterarBairro, setAlterarBairro] = useState("");
    const [alterarCPF, setAlterarCPF] = useState("");
    const [user, setUser] = useState(null);
    const [alterarGenero, setAlterarGenero] = useState("");
    const [imagem, setImagem] = useState(null);
    const [senha, setSenha] = useState("");
    const [errorMessage, setErrorMessage] = useState([]);

    // 2. Lógica de carregamento de dados movida para useEffect
    useEffect(() => {
        const loadUserData = async () => {
            const data = await AsyncStorage.getItem("userData");
            if (data) {
                const result = JSON.parse(data);
                setUser(result);
                if (result.dataNascimento) {
                    setDataNascimento(new Date(result.dataNascimento));
                    setDataNascimentoPlaceHolder(false);
                }
                setAlterarGenero(result.genero || "");
            }
        };
        loadUserData();
    }, []);

    const mostrarDataNascimento = () => setDataNascimentoVisivel(true);
    const esconderDataNascimento = () => setDataNascimentoVisivel(false);

    const confirmarDataNascimento = (date) => {
        setDataNascimento(date);
        setDataNascimentoPlaceHolder(false);
        esconderDataNascimento();
    };

    const mostrarMensagem = (title, mensagem, type) => {
        showMessage({
            message: title,
            description: mensagem,
            type: type,
            style: { height: "100%" },
            titleStyle: {
                fontWeight: "bold", fontSize: 20, lineHeight: 20,
                justifyContent: "center", marginTop: "auto", alignSelf: "center",
            },
        });
    };

    // 3. Funções de imagem corrigidas para o padrão Expo
    const handleImageUser = () => {
        Alert.alert(
            "Selecione", "De onde você quer pegar a foto?",
            [
                { text: "Galeria", onPress: () => pickImageFrom('gallery') },
                { text: "Câmera", onPress: () => pickImageFrom('camera') },
            ],
            { cancelable: true }
        );
    };

    const pickImageFrom = async (source) => {
        let result;
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        };

        if (source === 'gallery') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Desculpe, precisamos de permissão para acessar suas fotos!');
                return;
            }
            result = await ImagePicker.launchImageLibraryAsync(options);
        } else { // Câmera
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Desculpe, precisamos de permissão para usar sua câmera!');
                return;
            }
            result = await ImagePicker.launchCameraAsync(options);
        }

        if (!result.canceled) {
            setImagem(result.assets[0]);
        }
    };


    const autoFillAdressInfo = async () => {
        if (!alterarCEP) return;
        const cepReplace = alterarCEP.replace("-", "");
        try {
            const res = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cepReplace}`);
            const endereco = res.data;
            setAlterarCidade(endereco.city);
            setAlterarBairro(endereco.neighborhood);
        } catch (error) {
            mostrarMensagem("Erro!", error.response?.data?.message || "Erro ao buscar CEP!", "danger");
            console.error("Erro:", error.message);
        }
    };

    const atualizarDados = async () => {
        const formData = new FormData();

        if (imagem) {
            formData.append('imagem', {
                name: imagem.fileName || 'profile.jpg',
                type: imagem.mimeType || 'image/jpeg',
                uri: Platform.OS === "android" ? imagem.uri : imagem.uri.replace("file://", ""),
            });
        }

        formData.append('nome', alterarNome || user.nome);
        formData.append('email', alterarEmail || user.email);
        formData.append('genero', alterarGenero || user.genero);
        formData.append('cidade', alterarCidade || user.cidade);
        formData.append('bairro', alterarBairro || user.bairro);
        if (dataNascimento) {
            formData.append('dataNascimento', dataNascimento.toISOString().substring(0, 10));
        }

        try {
            const res = await axios.put(`${API_URL.base}/usuarios/`, formData, {
                headers: {
                    Authorization: `Bearer ${tokenStored}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            await AsyncStorage.setItem("userData", JSON.stringify(res.data));
            mostrarMensagem("Sucesso!", "Dados atualizados\nRedirecionando...", "success");
            setTimeout(() => navigation.navigate("Conta"), 1700);
        } catch (error) {
            mostrarMensagem("Erro!", "Erro ao atualizar dados", "danger");
            console.error(error.response?.data || error.message);
        }
    };

    const nomeError = errorMessage?.error === "Nome inválido! Não pode ser vazio e deve ser completo.";

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <Header
        icon={true}
        title="ScottClub"
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {!imagem && !user?.imagem ? (
            <SafeAreaView>
              <Avatar
                rounded
                size={"xlarge"}
                icon={{ name: "user", type: "font-awesome" }}
                containerStyle={{
                  backgroundColor: "#005098",
                  marginTop: "10%",
                }}
              />
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() => handleImageUser()}
              >
                <Avatar
                  rounded
                  size={"small"}
                  icon={{ name: "pencil", type: "font-awesome" }}
                  containerStyle={{
                    marginTop: "10%",
                    backgroundColor: "#005098",
                    marginLeft: "27%",
                    bottom: "85%",
                  }}
                />
              </TouchableOpacity>
            </SafeAreaView>
          ) : (
            <SafeAreaView>
              <Avatar
                rounded
                size={"xlarge"}
                source={{ uri: imagem ? imagem?.uri : user?.imagem }}
                containerStyle={{
                  backgroundColor: "#005098",
                  marginTop: "10%",
                }}
              />
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() => handleImageUser()}
              >
                <Avatar
                  rounded
                  size={"small"}
                  icon={{ name: "pencil", type: "font-awesome" }}
                  containerStyle={{
                    marginTop: "10%",
                    backgroundColor: "#005098",
                    marginLeft: "27%",
                    bottom: "85%",
                  }}
                />
              </TouchableOpacity>
            </SafeAreaView>
          )}

          <KeyboardAvoidingView style={styles.inputs}>
            <Input
              title={"Seu nome"}
              placeholder={user?.nome?.toUpperCase()}
              value={alterarNome ? alterarNome : user?.nome?.toUpperCase()}
              onChange={(e) => setAlterarNome(e.nativeEvent.text)}
            />
            <Input
              title={"Email"}
              placeholder={user?.email}
              value={alterarEmail ? alterarEmail : user?.email}
              onChange={(e) => setAlterarEmail(e.nativeEvent.text)}
            />

            {/* <Input
              title={"CPF"}
              maskType={"cpf"}
              placeholder={user?.cpf}
              value={alterarCPF}
              onChange={(e) => setAlterarCPF(e.nativeEvent.text)}
            /> */}

            <Text
              style={{
                color: "black",
                alignSelf: "flex-start",
                marginLeft: 18,
              }}
            >
              Data de Nascimento
            </Text>
            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={mostrarDataNascimento}
            >
              <TextInput
                value={
                  DataNascimentoPlaceHolder
                    ? "Data de Nascimento"
                    : `${dataNascimento
                      .getDate()
                      .toString()
                      .padStart(2, "0")}/${String(
                        dataNascimento.getMonth() + 1
                      ).padStart(2, "0")}/${dataNascimento.getFullYear()}`
                }
                onChange={(e) => setDataNascimento(e.nativeEvent.text)}
                placeholderTextColor="#878383"
                placeholder={"Data de Nascimento"}
                style={{
                  backgroundColor: "#DCDCDC",
                  width: "100%",
                  borderRadius: 32,
                  padding: 16,
                  marginBottom: 12,
                  color: "#000000",
                  borderColor: nomeError || (nomeVazio && "red"),
                  borderWidth: nomeError || nomeVazio ? 1 : 0,
                }}
                editable={false}
              />
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={dataNascimentoVisivel}
              mode="date"
              date={dataNascimento}
              onConfirm={confirmarDataNascimento}
              onCancel={esconderDataNascimento}
              maximumDate={dataMaxima}
              style={styles.dataNascimeto}
            />

            <Text
              style={{
                color: "black",
                alignSelf: "flex-start",
                marginLeft: 18,
              }}
            >
              Gênero
            </Text>
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                width: "100%",
                marginBottom: 12,
                backgroundColor: "#DCDCDC",
                borderRadius: 50,
              }}
            >
              <Picker
                style={{ color: "#000000" }}
                selectedValue={alterarGenero ? alterarGenero : user?.genero}
                onValueChange={(itemValue) => {
                  setAlterarGenero(itemValue);
                }}
              >
                <Picker.Item label="Feminino" value="feminino" />
                <Picker.Item label="Masculino" value="masculino" />
                <Picker.Item label="Outros" value="outros" />
                <Picker.Item
                  label="Não quero informar"
                  value="nao quis informar"
                />
              </Picker>
            </View>

            {/* <Input
              title={"Data de nascimento"}
              placeholder={user?.dataNascimento}
              value={alterarEmail}
              onChange={(e) => setAlterarCPF(e.nativeEvent.text)}
            /> */}
            <Input
              maskType={"zip-code"}
              title={"CEP"}
              placeholder="CEP"
              onChangeText={(text) => setAlterarCEP(text)}
              value={alterarCEP}
              icon={true}
              iconName={"search"}
              onPress={autoFillAdressInfo}
            />

            <Text
              style={{
                color: "black",
                alignSelf: "flex-start",
                marginLeft: 18,
              }}
            >
              Localização
            </Text>
            <TextInput
              value={
                alterarCidade && alterarBairro
                  ? `${alterarCidade}, ${alterarBairro}`
                  : (alterarCidade && alterarCidade)
              }
              onChange={(e) => {
                setAlterarBairro(e.nativeEvent.text);
              }}
              placeholderTextColor="#878383"
              placeholder={
                user?.bairro && user?.bairro != "null"
                  ? `${user?.cidade}, ${user?.bairro}`
                  : user?.cidade
              }
              style={{
                backgroundColor: "#DCDCDC",
                width: "100%",
                borderRadius: 32,
                padding: 16,
                marginBottom: 12,
                color: "#000000",
              }}
              editable={false}
            />

            <Button
              label={"Atualizar"}
              backgroundColor={"#005098"}
              width={"100%"}
              textColor={"#FFFFFF"}
              padding={24}
              fontSize={16}
              borderRadius={50}
              fontWeight={"bold"}
              onPress={atualizarDados}
              marginTop={32}
            />
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
      <Nav />
    </SafeAreaView>
  );
}
