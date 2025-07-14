import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styles } from "./registerStyle";
import { useState } from "react";
import Form from "../../components/form/Form";
import SocialLogin from "../../components/socialLogin/SocialLogin";
import InputPassword from "../../components/inputPassword/InputPassword";
import Button from "../../components/button/Button";
import { Overlay } from "react-native-elements";
import Modal from "../../components/modal/Modal";
import axios from "axios";
import FlashMessage, { showMessage } from "react-native-flash-message";
import usePersist from "../../hooks/usePersist";
import { TextInputMask } from "react-native-masked-text";
import DatePicker from "react-native-date-picker";
import { API_URL } from "../../const/apiUrl";
import Header from "../../components/header/Header";

const screenWidth = Dimensions.get("window").width;

export default function Register({ navigation }) {
  const [nome, setNome] = useState("");
  const [nomeVazio, setNomeVazio] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [senhaError, setSenhaError] = useState(false);
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [dataMaxima] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() - 18))
  );
  const [dataNascimentoVisivel, setDataNascimentoVisivel] = useState(false);
  const [DataNascimentoPlaceHolder, setDataNascimentoPlaceHolder] =
    useState(true);
  const [cpfVazio, setCpfVazio] = useState(false);
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [senhasDiferentes, setSenhasDiferentes] = useState(false);
  const [senhaLength, setSenhaLength] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const { deviceToken } = usePersist();

  const toggleOverlay = () => {
    setModalVisible(!modalVisible);
  };

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

  const mostrarMensagem = (message, type, mensagem) => {
    showMessage({
      message: message,
      description: mensagem,
      type: type,
      style: { height: "100%", top: 0 },
      titleStyle: {
        fontWeight: "bold",
        fontSize: 20,
        justifyContent: "center",
        marginTop: "auto",
        alignSelf: "center",
      },
    });
    setTimeout(() => {
      navigation.navigate("Login");
    }, 1700);
  };

  const erroAoCadastrar = () => {
    if (!nome && !email && !cpf && !senha) {
      setNomeVazio(true);
      setEmailError(true);
      setError(true);
      setCpfVazio(true);
      setTimeout(() => {
        setNomeVazio(false);
        setEmailError(false);
        setError(false);
        setSenhasDiferentes(false);
        setSenhaLength(false);
        setCpfVazio(false);
      }, 10000);
    }
    if (!nome) {
      setNomeVazio(true);
      setTimeout(() => {
        setNomeVazio(false);
      }, 10000);
    }
    if (!cpf) {
      setCpfVazio(true);
      setTimeout(() => {
        setCpfVazio(false);
      }, 10000);
    }
    if (!email) {
      setEmailError(true);
      setTimeout(() => {
        setEmailError(false);
      }, 10000);
    }
    if (senha !== repetirSenha) {
      setSenhasDiferentes(true);
    } else {
      setSenhasDiferentes(false);
    }
  };

  const register = async () => {
    if (!email || !cpf || cpf.length < 11 || !senha) {
      setEmailError(true);
      setError(true);
    }
    if (senha !== repetirSenha) {
      setSenhasDiferentes(true);
    } else {
      setSenhasDiferentes(false);
    }
    await axios
      .post(`${API_URL.base}/usuarios`, {
        nome: nome,
        email: email,
        tipoCadastro: "EMAIL",
        senha: senha,
        cpf: cpf,
        tokenCelular: deviceToken,
        dataNascimento: dataNascimento.toISOString().substring(0, 10),
      })
      .then((res) => {
        mostrarMensagem("Sucesso", "success", "Cadastro realizado!");
        setNome("");
        setEmail("");
        setCpf("");
        setSenha("");
        setDataNascimentoPlaceHolder(true);
        setDataNascimento(new Date());
        setRepetirSenha("");
        setNomeVazio(false);
        setEmailError(false);
        setError(false);
        setSenhasDiferentes(false);
        setSenhaLength(false);
      })
      .catch((error) => {
        if (error.response.data.error === "Email já cadastrado!") {
          setEmailError(true);
          setErrorMessage("Email ja cadastrado!");
        } else if (error.response.data.error.includes("senha")) setSenhaError(true)
        setError(true);
        setErrorMessage(error.response.data);
      });
  };

  const nomeError =
    errorMessage?.error ===
    "Nome inválido! Não pode ser vazio e deve ser completo.";
  const cpfError = errorMessage?.error === "CPF inválido!";

  return (
    <>
    
    <Header 
      icon={true} 
      onPress={() => navigation.goBack()} 
      iconNotifications={false}
    />
    <ScrollView
      contentContainerStyle={{
        width: screenWidth,
        flex: 1,
        backgroundColor: '#FFFFFF'
      }}
    >
      <KeyboardAvoidingView 
    flex={1}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <SafeAreaView
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "10%",
          marginBottom: "5%",
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
        <View style={[styles.containerTitle, { marginTop: 20 }]}>
          <Text style={styles.titleBody}>Cadastro</Text>
          <Text style={styles.subtitleBody}>
            Faça seu cadastro no nosso app!
          </Text>
        </View>
        <Form style={{ paddingTop: "10%" }}>
          {nomeError && (
            <Text
              style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
            >
              {errorMessage?.error}
            </Text>
          )}
          {nomeVazio && (
            <Text
              style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
            >
              {errorMessage?.error}
            </Text>
          )}
          <TextInput
            value={nome}
            onChange={(e) => setNome(e.nativeEvent.text)}
            placeholderTextColor="#878383"
            placeholder="Nome completo"
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
          />
          {emailError && (
            <Text style={{ color: "red", fontWeight: "bold" }}>
              {errorMessage?.error}
            </Text>
          )}

          <TextInput
            value={email}
            onChange={(e) => setEmail(e.nativeEvent.text)}
            placeholderTextColor="#878383"
            placeholder="Email"
            autoCapitalize="none"
            style={{
              backgroundColor: "#DCDCDC",
              width: "100%",
              borderRadius: 32,
              padding: 16,
              marginBottom: 12,
              color: "#000000",
              borderColor: emailError || (!email && "red"),
              borderWidth: emailError ? 1 : 0,
            }}
          />
          {cpfError && (
            <Text style={{ color: "red", fontWeight: "bold" }}>
              CPF inválido!
            </Text>
          )}
          {!cpfError && cpfVazio && (
            <Text style={{ color: "red", fontWeight: "bold" }}>
              CPF inválido!
            </Text>
          )}
          <TextInputMask
            type="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.nativeEvent.text)}
            placeholderTextColor="#878383"
            placeholder="CPF"
            style={{
              backgroundColor: "#DCDCDC",
              width: "100%",
              borderRadius: 32,
              padding: 16,
              marginBottom: 12,
              color: "#000000",
              borderColor: cpfError ? "red" : null,
              borderWidth: cpfError || cpfVazio ? 1 : 0,
            }}
          />

          <View style={{ width: "100%", marginBottom: 12 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={mostrarDataNascimento}
              style={{
                width: "100%",
                backgroundColor: "#DCDCDC",
                borderRadius: 32,
                padding: 16,
                borderColor: nomeError || (nomeVazio && "red"),
                borderWidth: nomeError || nomeVazio ? 1 : 0,
              }}
            >
              <Text style={{ color: "#878383" }}>
                {DataNascimentoPlaceHolder
                  ? "Data de Nascimento"
                  : dataNascimento.toLocaleDateString('pt-BR')}
              </Text>
            </TouchableOpacity>
          </View>

          <DatePicker
            modal
            open={dataNascimentoVisivel}
            date={dataNascimento}
            onConfirm={(date) => confirmarDataNascimento(date)}
            onCancel={esconderDataNascimento}
            maximumDate={dataMaxima}
            minimumDate={new Date(1900, 0, 1)}
            locale="pt-BR"
            mode="date"
            title="Selecione sua data de nascimento"
            confirmText="Confirmar"
            cancelText="Cancelar"
            theme="light"
          />

          {senhaError && (
            <Text
              style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
            >
              {errorMessage?.error}
            </Text>
          )}
          <InputPassword
            placeholder={"Senha"}
            value={senha}
            onChange={(e) => {
              setSenha(e.nativeEvent.text);
              setSenhaLength(e.nativeEvent.text.length > 0 && e.nativeEvent.text.length < 8);
            }}
            error={senhasDiferentes ? true : false}
          />
          {senhaLength && (
            <Text style={{ color: "red", fontWeight: "bold", marginBottom: 12 }}>
              A senha deve ter pelo menos 8 caracteres
            </Text>
          )}
          {repetirSenha && senha !== repetirSenha && (
            <Text style={{ color: "red", fontWeight: "bold" }}>
              As senhas são diferentes
            </Text>
          )}
          <InputPassword
            value={repetirSenha}
            placeholder={"Repetir senha"}
            error={senhasDiferentes ? true : false}
            onChange={(e) => setRepetirSenha(e.nativeEvent.text)}
          />
          {!senha ||
            senha !== repetirSenha ||
            senha.length < 8 ||
            !cpf ||
            cpf.length < 11 ? (
            <Button
              label={"Cadastrar"}
              backgroundColor={"#c0c0c0"}
              width={"100%"}
              textColor={"#1a1a1a"}
              padding={16}
              fontSize={16}
              borderRadius={32}
              fontWeight={"bold"}
              onPress={erroAoCadastrar}
            />
          ) : (
            <Button
              label={"Cadastrar"}
              backgroundColor={"#005098"}
              width={"100%"}
              textColor={"#FFFFFF"}
              padding={16}
              fontSize={16}
              borderRadius={32}
              fontWeight={"bold"}
              onPress={register}
            />
          )}
        </Form>
        <SocialLogin label={"Ou registre com"} />

        <TouchableOpacity style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "5%",
        }} onPress={toggleOverlay}>
          {modalVisible && (
            <Overlay
              overlayStyle={{ borderRadius: 20 }}
              isVisible={modalVisible}
              onBackdropPress={toggleOverlay}
            >
              <Modal>
                <Button
                  label={"Fechar"}
                  onPress={toggleOverlay}
                  backgroundColor={"#005098"}
                  width={"90%"}
                  textColor={"#FFFFFF"}
                  padding={16}
                  fontSize={16}
                  borderRadius={32}
                  marginBottom={5}
                  fontWeight={"bold"}
                />
              </Modal>
            </Overlay>
          )}

          <Text style={[styles.termText, { width: '68%' }]}>
            Ao se cadastrar, você concorda com nossos
            <Text style={styles.decorationTextTerm}>
              Termos e Política de Privacidade.
            </Text>
          </Text>
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.withouthRegister}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.withouthRegisterText}>
              Já possui uma conta?
            </Text>
            <Text style={styles.registerNowText}>Faça login agora!</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
    </ScrollView>
    </>
  );
}
