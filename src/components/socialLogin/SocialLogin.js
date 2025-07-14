import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./socialLoginStyle";
// 1. As importações que causam erro foram comentadas
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { memo } from "react";
// import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "../../const/apiUrl";
import usePersist from "../../hooks/usePersist";

export default function SocialLoginComponent({ label }) {
  const navigation = useNavigation();
  const { setTokenStored, setUserStored } = usePersist();
  const pegarUsuario = async (userData) => {
    const token = userData.token;
    const instance = axios.create({
      baseURL: `${API_URL.base}/usuarios/${userData.user}`,
      timeout: 1000,
      headers: { Authorization: "Bearer " + token },
    });

    instance.get("/").then(async (response) => {
      try {
        const json = JSON.stringify(response.data);
        await AsyncStorage.setItem("userData", json);
        setUserStored(response.data)
      } catch (error) {
        console.error(error);
      }
    });
  };

  // 2. A configuração do Google Sign-In foi comentada
  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId:
  //       "449454344126-t068aih8p2s1ad8b7b9aak80rtrb8lpa.apps.googleusercontent.com",
  //   });
  // }, []);

  // 3. O corpo das funções de login foi comentado para evitar erros.
  //    Elas agora apenas avisam que a função está desativada.
  async function loginGoogle() {
    console.log("Login com Google temporariamente desativado.");
    // // Check if your device supports Google Play
    // await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // // Get the users ID token
    // const { idToken } = await GoogleSignin.signIn();

    // // Create a Google credential with the token
    // const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // // Sign-in the user with the credential
    // return auth().signInWithCredential(googleCredential);
  }

  async function loginFacebook() {
    console.log("Login com Facebook temporariamente desativado.");
    // // Attempt login with permissions
    // const result = await LoginManager.logInWithPermissions([
    //   "public_profile",
    //   "email",
    // ]);

    // if (result.isCancelled) {
    //   throw "Usuário cancelou o processo de login";
    // }

    // // Once signed in, get the users AccesToken
    // const data = await AccessToken.getCurrentAccessToken();

    // if (!data) {
    //   throw "Alguma coisa deu errado ao obter o token de acesso";
    // }

    // // Create a Firebase credential with the AccessToken
    // const facebookCredential = auth.FacebookAuthProvider.credential(
    //   data.accessToken
    // );

    // // Sign-in the user with the credential
    // return auth().signInWithCredential(facebookCredential);
  }
  return (
    <SafeAreaView style={styles.socialLoginContainer}>
      <Text style={styles.socialText}>{label}</Text>
      <View style={styles.socialLogin}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.socialContainer}
          // chama a função de login com o google
          onPress={() =>
            loginGoogle()
              .then(async (res) => {
                const user = res.user;

                await axios
                  .post(`${API_URL.base}/login`, {
                    nome: user.displayName,
                    email: user.email,
                    senha: "",
                    imagem: user.photoURL,
                    tipoCadastro: "GOOGLE",
                    uid_social: user.providerId,
                  })
                  .then(async (res) => {
                    const userData = {
                      token: res.data.token,
                      user: res.data.usuarioId,
                    };
                    await AsyncStorage.setItem(
                      "token",
                      JSON.stringify(userData.token)
                    );
                    setTokenStored(userData.token);
                    pegarUsuario(userData);
                    if (await AsyncStorage.getItem("bemVindo")) {
                      return navigation.navigate("Home", {
                        token: userData.token,
                      });
                    } else {
                      await axios
                        .get(
                          `${API_URL.base}/mensagensapresentacao`
                        )
                        .then((res) => {
                          return navigation.navigate("BemVindo", {
                            token: userData.token,
                            bemVindo: res.data,
                          });
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    }
                  })
                  .catch((err) => {
                    console.error("Ocorreu um erro ao cadastrar: ", err);
                  });
              })
              .catch((erro) => console.error("Ocorreu um erro:", erro))
          }
        >
          <Icon name="logo-google" color="black" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.socialContainer}
          onPress={() =>
            loginFacebook()
              .then(async (res) => {
                const user = res.user;

                await axios
                  .post(`${API_URL.base}/login`, {
                    nome: user.displayName,
                    email: user.email,
                    senha: "",
                    imagem: user.photoURL,
                    tipoCadastro: "FACEBOOK",
                    uid_social: user.providerId,
                  })
                  .then(async (res) => {
                    const userData = {
                      token: res.data.token,
                      user: res.data.usuarioId,
                    };
                    await AsyncStorage.setItem(
                      "token",
                      JSON.stringify(userData.token)
                    );
                    setTokenStored(userData.token);
                    pegarUsuario(userData);
                    if (await AsyncStorage.getItem("bemVindo")) {
                      return navigation.navigate("Home", {
                        token: userData.token,
                      });
                    } else {
                      await axios
                        .get(
                          `${API_URL.base}/mensagensapresentacao`
                        )
                        .then((res) => {
                          return navigation.navigate("BemVindo", {
                            token: userData.token,
                            bemVindo: res.data,
                          });
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    }
                  })
                  .catch((err) => {
                    console.error("Ocorreu um erro ao cadastrar: ", err);
                  });
              })
              .catch((erro) => console.error("Ocorreu um erro:", erro))
          }
        >
          <Icon name="logo-facebook" color="black" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export const SocialLogin = memo(SocialLoginComponent);
