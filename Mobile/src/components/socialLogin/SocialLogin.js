import { Text, TouchableOpacity, View, SafeAreaView,Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./socialLoginStyle";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { memo, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePersist from "../../hooks/usePersist";
import { API_URL } from "../../const/apiUrl";

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
        return null;
      }
    });
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:"698611291998-6c9bsgsmiluinjveif5v6ke1b8p81l5o.apps.googleusercontent.com",
      iosClientId: '698611291998-6c9bsgsmiluinjveif5v6ke1b8p81l5o.apps.googleusercontent.com', // client_id do tipo iOS
      scopes: ['profile', 'email'],
        
    });
  }, []);

  // async function loginGoogle() {
  //   // Check if your device supports Google Play
  //   await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  //   // Get the users ID token
  //   const { idToken } = await GoogleSignin.signIn();

  //   // Create a Google credential with the token
  //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  //   // Sign-in the user with the credential
  //   return auth().signInWithCredential(googleCredential);
  // }

  async function loginGoogle() {
    try {
      await GoogleSignin.hasPlayServices(); // não faz nada no iOS mas é seguro
      const userInfo = await GoogleSignin.signIn();
      
      return userInfo;
    } catch (error) {
      return null;
    }
  };



  
  async function loginFacebook() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);

    if (result.isCancelled) {
      throw "Usuário cancelou o processo de login";
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw "Alguma coisa deu errado ao obter o token de acesso";
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
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
                const user = res.data.user;
                
                await axios
                  .post(`${API_URL.base}/login`, {
                    nome: user.name,
                    email: user.email,
                    senha: "",
                    imagem: user.photo,
                    tipoCadastro: "GOOGLE",
                    uid_social: user.givenName,
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
                    
                    // Check AsyncStorage for onboarding status - replaced the old if condition
                    const checkOnboardingStatus = async () => {
                      try {
                        const onboardingCompleted = await AsyncStorage.getItem("bemVindo");
                        if (onboardingCompleted === "true") {
                          return navigation.navigate("Home", {
                            token: userData.token,
                          });
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
                              navigation.navigate("Home", { token: userData.token });
                            });
                        }
                      } catch (error) {
                        navigation.navigate("Home", { token: userData.token });
                      }
                    };

                    checkOnboardingStatus();
                  })
                  .catch((err) => {
                    return null;
                  });
              })
              .catch((erro) => {
                return null;
              })
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
                    
                    // Check AsyncStorage for onboarding status - replaced the old if condition
                    const checkOnboardingStatus = async () => {
                      try {
                        const onboardingCompleted = await AsyncStorage.getItem("bemVindo");
                        if (onboardingCompleted === "true") {
                          return navigation.navigate("Home", {
                            token: userData.token,
                          });
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
                  })
                  .catch((err) => {
                  });
              })
              .catch((erro) => {
                return null;
              })
          }
        >
          <Icon name="logo-facebook" color="black" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export const SocialLogin = memo(SocialLoginComponent);
