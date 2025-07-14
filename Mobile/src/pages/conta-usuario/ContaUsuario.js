import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StatusBar,
} from "react-native";
import Input from "../../components/input/Input";
import { styles } from "./ContaUsuarioStyle";
import { Avatar } from "react-native-elements";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import Button from "../../components/button/Button";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import("react-native-image-picker");
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { API_URL } from "../../const/apiUrl";
import ScreenContainer from "../../components/screenContainer/ScreenContainer";
import { Icon } from "react-native-elements";

export default function ContaUsuario({ navigation }) {
  const { tokenStored } = usePersist();
  const [nomeVazio, setNomeVazio] = useState(false);
  const [alterarNome, setAlterarNome] = useState();
  const [alterarEmail, setAlterarEmail] = useState();

  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [dataMaxima, setDataMaxima] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() - 18))
  );
  const [dataNascimentoVisivel, setDataNascimentoVisivel] = useState(false);
  const [DataNascimentoPlaceHolder, setDataNascimentoPlaceHolder] =
    useState(true);
  const [alterarCEP, setAlterarCEP] = useState();

  const [alterarCidade, setAlterarCidade] = useState("");
  const [alterarBairro, setAlterarBairro] = useState("");
  const [alterarCPF, setAlterarCPF] = useState();
  const [user, setUser] = useState(async () => {
    const data = await AsyncStorage.getItem("userData");
    const result = JSON.parse(data);
    setUser(result || null);
    setDataNascimento(new Date(result.dataNascimento));
    setDataNascimentoPlaceHolder(false);
  });
  const [alterarGenero, setAlterarGenero] = useState(async () => {
    const data = await AsyncStorage.getItem("userData");
    const result = JSON.parse(data);
    setAlterarGenero(result.genero || null);
  });
  const [imagem, setImagem] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState([]);

  const mostrarDataNascimento = () => {
    setDataNascimentoVisivel(true);
  };

  const esconderDataNascimento = () => {
    setDataNascimentoVisivel(false);
  };

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
        fontWeight: "bold",
        fontSize: 20,
        lineHeight: 20,
        justifyContent: "center",
        marginTop: "auto",
        alignSelf: "center",
      },
    });
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

  const autoFillAdressInfo = async () => {
    const cepReplace = alterarCEP.replace("-", "");

    await axios
      .get(`https://brasilapi.com.br/api/cep/v2/${cepReplace}`)
      .then((res) => {
        const endereco = res.data;
        setAlterarCidade(endereco.city);
        setAlterarBairro(endereco.neighborhood);
      })
      .catch((error) => {
        mostrarMensagem("Erro!", error.code == "ERR_BAD_REQUEST" ? "CEP Inválido!" : "Erro ao buscar CEP!", "danger");
      });
  };

  const atualizarDados = async () => {
    const formData = new FormData();

    const dadosAtualizadosUsuario = {
      nome: alterarNome ? alterarNome : user?.nome,
      cpf: user?.cpf,
      email: alterarEmail ? alterarEmail : user?.email,
      tipoCadastro: user.tipoCadastro,
      genero: alterarGenero ? alterarGenero : user?.genero,
      cidade: alterarCidade ? alterarCidade : user?.cidade,
      bairro: alterarBairro,
      dataNascimento: dataNascimento
        ? dataNascimento.toISOString().substring(0, 10)
        : user?.dataNascimento.toISOString().substring(0, 10),

      imagem: imagem
        ? {
          name: imagem.fileName,
          type: imagem.type,
          uri:
            Platform.OS === "android"
              ? imagem.uri
              : imagem.uri.replace("file://", ""),
        }
        : user.imagem,
      tokenCelular: user?.tokenCelular,
    };

    Object.entries(dadosAtualizadosUsuario).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await axios
      .put(`${API_URL.base}/usuarios/`, formData, {
        headers: {
          Authorization: `Bearer ${tokenStored}`,
          "content-Type": "multipart/form-data",
        },
      })
      .then(async (res) => {
        await AsyncStorage.setItem("userData", JSON.stringify(res.data));
        mostrarMensagem(
          "Sucesso!",
          "Dados atualizados\nRedirecionando...",
          "success"
        );
        setTimeout(() => navigation.navigate("Conta"), 1700);
      })
      .catch((error) => {
        mostrarMensagem("Erro!", "Erro ao atualizar dados", "danger");
        const errResponse =
          (error && error.response && error.response.data) ||
          (error && error.message) ||
          error.error;

      });
  };

  const nomeError =
    errorMessage?.error ===
    "Nome inválido! Não pode ser vazio e deve ser completo.";

  return (
    <ScreenContainer>
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Avatar
              rounded
              size={120}
              source={imagem ? { uri: imagem?.uri } : user?.imagem ? { uri: user.imagem } : null}
              icon={!imagem && !user?.imagem ? { name: "user", type: "font-awesome" } : null}
              containerStyle={{ backgroundColor: "#005098" }}
            />
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={handleImageUser}
            >
              <Icon name="pencil" type="font-awesome" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView style={styles.inputs} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Text style={styles.inputLabel}>Seu nome</Text>
            <Input
              placeholder={user?.nome?.toUpperCase()}
              value={alterarNome ? alterarNome : user?.nome?.toUpperCase()}
              onChange={(e) => setAlterarNome(e.nativeEvent.text)}
              containerStyle={styles.input}
              editable={false}
            />

            <Text style={styles.inputLabel}>Email</Text>
            <Input
              placeholder={user?.email}
              value={alterarEmail ? alterarEmail : user?.email}
              onChange={(e) => setAlterarEmail(e.nativeEvent.text)}
              containerStyle={styles.input}
              editable={false}
            />

            <Text style={styles.inputLabel}>Data de Nascimento</Text>
            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={mostrarDataNascimento}
            >
              <TextInput
                value={
                  DataNascimentoPlaceHolder
                    ? "Data de Nascimento"
                    : `${dataNascimento.getDate().toString().padStart(2, "0")}/${String(dataNascimento.getMonth() + 1).padStart(2, "0")}/${dataNascimento.getFullYear()}`
                }
                placeholderTextColor="#878383"
                style={styles.input}
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
            />

            <Text style={styles.inputLabel}>Gênero</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={alterarGenero ? alterarGenero : user?.genero}
                onValueChange={(itemValue) => setAlterarGenero(itemValue)}
                style={{ color: "#000000", marginTop: -16}}
              >
                <Picker.Item label="Feminino" value="feminino" />
                <Picker.Item label="Masculino" value="masculino" />
                <Picker.Item label="Outros" value="outros" />
                <Picker.Item label="Não quero informar" value="nao quis informar" />
              </Picker>
            </View>

            <Text style={styles.inputLabel}>CEP</Text>
            <Input
              maskType={"zip-code"}
              placeholder="CEP"
              onChangeText={(text) => setAlterarCEP(text)}
              value={alterarCEP}
              icon={true}
              iconName={"search"}
              onPress={autoFillAdressInfo}
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Localização</Text>
            <TextInput
              value={
                alterarCidade && alterarBairro
                  ? `${alterarCidade}, ${alterarBairro}`
                  : alterarCidade && alterarCidade
              }
              placeholder={
                user?.bairro && user?.bairro != "null"
                  ? `${user?.cidade}, ${user?.bairro}`
                  : user?.cidade
              }
              style={styles.input}
              editable={false}
              placeholderTextColor="#878383"
            />

            <Button
              label={"Atualizar"}
              backgroundColor={"#005098"}
              width={"100%"}
              textColor={"#FFFFFF"}
              padding={16}
              fontSize={16}
              borderRadius={32}
              fontWeight={"bold"}
              onPress={atualizarDados}
              marginTop={24}
            />
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <Nav />
    </ScreenContainer>
  );
}
