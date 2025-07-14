import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  ScrollView,
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
import Input from "../../components/input/Input";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { API_URL } from "../../const/apiUrl";

const screenWidth = Dimensions.get("window").width;

export default function Register({ navigation }) {
  const [nome, setNome] = useState("");
  const [nomeVazio, setNomeVazio] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [senhaError, setSenhaError] = useState(false);
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [dataMaxima, setDataMaxima] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() - 18))
  );
  const [dataNascimentoVisivel, setDataNascimentoVisivel] = useState(false);
  const [DataNascimentoPlaceHolder, setDataNascimentoPlaceHolder] =
    useState(true);
  const [cpfVazio, setCpfVazio] = useState(false);
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [senhasDiferentes, setSenhasDiferentes] = useState(false);
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
        console.log("Teste");
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
        console.log(error.response.data);
        setErrorMessage(error.response.data);
      });
  };

  console.log(emailError);
  const nomeError =
    errorMessage?.error ===
    "Nome inválido! Não pode ser vazio e deve ser completo.";
  const cpfError = errorMessage?.error === "CPF inválido!";

  return (
    <ScrollView
      contentContainerStyle={{
        width: screenWidth,
        flex: 1,
        backgroundColor: '#FFFFFF'
      }}
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
        <View style={styles.containerTitle}>
          <Text style={styles.titleBody}>Cadastro</Text>
          <Text style={styles.subtitleBody}>
            Faça seu cadastro no nosso app!
          </Text>
        </View>
        <Form>
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
            onChange={(e) => setSenha(e.nativeEvent.text)}
            error={senhasDiferentes ? true : false}
          />
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
    </ScrollView>
  );
}
