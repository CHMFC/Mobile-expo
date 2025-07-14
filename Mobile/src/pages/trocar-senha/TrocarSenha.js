import {
    Text,
    TouchableOpacity,
    View,
    Keyboard,
    Alert
} from "react-native";
import { styles } from "./trocarSenhaStyles";
import { useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import InputPassword from "../../components/inputPassword/InputPassword";
import Form from "../../components/form/Form";
import axios from "axios";
import { Icon } from "react-native-elements";
import { API_URL } from "../../const/apiUrl";
import Header from "../../components/header/Header";
import ScreenContainer from "../../components/screenContainer/ScreenContainer";

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [totp, setTotp] = useState("");
    const [totpView, setTotpView] = useState(false);
    const [error, setError] = useState("");

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
            setError("Informe a senha*");
            Keyboard.dismiss();
            return;
        }

        setError("");
        await axios
            .put(`${API_URL.base}/usuarios/senha`, {
                email: emailUser,
                senha: senhaUser,
                totp: totp
            }).then(res => {
                Alert.alert(
                    "Código de verificação",
                    res.data.message,
                    [
                        { text: "OK" }
                    ]
                );

                setTotpView(true)

                if (res.data.message === "Senha atualizada!") {
                    setEmail("")
                    setSenha("")
                    setTotp("")
                    setTotpView(false)
                    navigation.navigate("Login")
                }

            }).catch(err => {
                setError(err.response.data.message);
                Keyboard.dismiss();
            });
    };

    const reenviarCodigo = async () => {
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
            setError("Informe a senha*");
            Keyboard.dismiss();
            return;
        }

        setError("");
        await axios
            .put(`${API_URL.base}/usuarios/senha`, {
                email: emailUser,
                senha: senhaUser
            }).then(res => {
                Alert.alert(
                    "Código de verificação",
                    res.data.message,
                    [
                        { text: "OK" }
                    ]
                );

                setTotpView(true)

                if (res.data.message === "Senha atualizada!") {
                    setEmail("")
                    setSenha("")
                    setTotp("")
                    setTotpView(false)
                    navigation.navigate("Login")
                }

            }).catch(err => {
                setError(err.response.data.message);
                Keyboard.dismiss();
            });
    };

    return (
        <ScreenContainer style={styles.container}>
            <Header icon={true} onPress={() => navigation.goBack()} iconNotifications={false} />
            <View style={styles.containerTitle}>
                <Text style={styles.titleBody}>Alterar senha</Text>
                <Text style={styles.subtitleBody}>
                    Atualize sua senha!
                </Text>
            </View>

            <View style={styles.formContainer}>
                <Form>
                    {error ? (<Text style={{ color: "red", fontWeight: "bold" }}>
                        {error ? error : ""}
                    </Text>) : null}
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
                    {totpView ? (
                        <View style={{
                            width: '80%',
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: 'center',
                            marginBottom: 20,
                        }}>
                            <Input
                                placeholder={"Código de verificação"}
                                value={totp}
                                onChange={(e) => setTotp(e.nativeEvent.text)}
                                hide={totpView}
                                keyboardType={'numeric'}
                            />
                            <TouchableOpacity style={{
                                width: 60, height: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }} onPress={() => {
                                setTotp(null)
                                reenviarCodigo()
                            }}>
                                <View style={{
                                    backgroundColor: '#005098',
                                    width: '100%', height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 10,
                                    borderRadius: 30
                                }}>
                                    <Icon name="refresh-outline" size={32} type="ionicon" color={"#ffffff"} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                    <Button
                        label={"Enviar"}
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
            </View>
        </ScreenContainer>
    );
}
