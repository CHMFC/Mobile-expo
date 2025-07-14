import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import { styles } from "./loginStyles";
import { useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import InputPassword from "../../components/inputPassword/InputPassword";
import SocialLogin from "../../components/socialLogin/SocialLogin";
import Form from "../../components/form/Form";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import { API_URL } from "../../const/apiUrl";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const { setTokenStored, setUserStored } = usePersist();

  const pegarUsuario = async (userData) => {
    const token = userData.token;
    const instance = axios.create({
      baseURL: `${API_URL.base}/usuarios/${userData.user}`,
      headers: { Authorization: "Bearer " + token },
    });

    instance.get("/").then(async (response) => {
      try {
        const json = JSON.stringify(response.data);
        await AsyncStorage.setItem("userData", json);
        setUserStored(response.data);
      } catch (error) {

      }
    });
  };

  const userLogin = async () => {
    let regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Tratamento dos campos
    let emailUser = email;
    let senhaUser = senha;

    emailUser = emailUser.trim().toLowerCase();
    setEmail(emailUser);

    senhaUser = senhaUser.trim();
    setSenha(senhaUser);

    if (!email && !senha) {
      setError("Preencha os campos corretamente*");
      Keyboard.dismiss();
      return;
    }

    if (!regexEmail.test(emailUser) || !email) {
      setError("E-mail inválido*");
      Keyboard.dismiss();
      return;
    }

    if (!senha) {
      setError("Informe sua senha*");
      Keyboard.dismiss();
      return;
    }

    setError("");

    await axios
      .post(`${API_URL.base}/login`, {
        email: emailUser,
        senha: senhaUser,
        tipoCadastro: "EMAIL",
      })
      .then(async (res) => {
        const userData = {
          token: res.data.token,
          user: res.data.usuarioId,
        };
        await AsyncStorage.setItem("token", JSON.stringify(userData.token));
        setTokenStored(userData.token);
        pegarUsuario(userData);
        Keyboard.dismiss();

        // Check AsyncStorage for onboarding status
        const checkOnboardingStatus = async () => {
          try {
            const onboardingCompleted = await AsyncStorage.getItem("bemVindo");
            if (onboardingCompleted === "true") {
              return navigation.navigate("Home", { token: userData.token });
            } else {
              await axios
                .get(`${API_URL.base}/mensagensapresentacao`)
                .then((res) => {
                  return navigation.navigate("BemVindo", {
                    token: userData.token,
                    bemVindo: res.data,
                  });
                })
                .catch((error) => {
                  // If API fails, still navigate to Home as fallback
                  navigation.navigate("Home", { token: userData.token });
                });
            }
          } catch (error) {
            navigation.navigate("Home", { token: userData.token });
          }
        };

        checkOnboardingStatus();
        setEmail("");
        setSenha("");
      })
      .catch(async (err) => {
        setError("Usuário ou senha inválidos*");
        Keyboard.dismiss();
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={{ width: 180, height: 180 }}
          source={require("../../assets/logo-inicio.png")}
        />
      </View>

      <Form>
        <Text style={{ color: "red", fontWeight: "bold" }}>
          {error ? error : ""}
        </Text>
        <Input
          placeholder={"Email"}
          value={email}
          onChange={(e) => setEmail(e.nativeEvent.text)}
        />

        <InputPassword
          value={senha}
          placeholder={"Senha"}
          onChange={(e) => setSenha(e.nativeEvent.text)}
        />

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("TrocarSenha")}
          >
            <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>

        <Button
          label={"Login"}
          backgroundColor={"#005098"}
          width={"100%"}
          textColor={"#FFFFFF"}
          padding={16}
          fontSize={16}
          borderRadius={32}
          fontWeight={"bold"}
          onPress={userLogin}
        />
      </Form>

      <SocialLogin label={"Ou acesse com"} />

      <View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.withouthRegister}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.withouthRegisterText}>Sem cadastro?</Text>
          <Text style={styles.registerNowText}>Cadastre-se agora!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
