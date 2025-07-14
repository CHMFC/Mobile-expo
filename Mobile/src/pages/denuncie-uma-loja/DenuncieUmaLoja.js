import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    View,
    Text,
    TextInput,
} from "react-native";
import { Overlay, Avatar, CheckBox, Icon } from "react-native-elements";
import { Header } from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../../components/card/Card";
import Button from "../../components/button/Button";
import { Input } from "../../components/input/Input";
import { API_URL } from "../../const/apiUrl";

export default function DenuncieUmaLoja({ navigation }) {
    const [lojas, setLojas] = useState([]);
    const [razaoSocial, setRazaoSocial] = useState(null);
    const [geral, setGeral] = useState(null);
    const [fidelidade, setFidelidade] = useState(null);
    const [ocorrido, setOcorrido] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [loja, setLoja] = useState({});
    const [denuncia, setDenuncia] = useState(null);
    const [denunciaFinalizada, setDenunciaFinalizada] = useState(false);

    useEffect(() => {
        async function tokenUsuario() {
            const userToken = await AsyncStorage.getItem("token");

            await axios.get(`${API_URL.base}/lojas/recentes`, {
                headers: { Authorization: `Bearer ${userToken.slice(1, -1)}` },
                params: {
                    razaoSocial: razaoSocial
                }
            }).then(response => {
                setLojas(response?.data);
            }).catch(err => {
            }).finally(() => {
                setIsSearching(false);
            });
        }
        tokenUsuario();
    }, [isSearching]);

    const handleSearch = () => {
        setIsSearching(true);
    };

    const toggleOverlay = () => {
        setDenuncia(!denuncia);
        setRazaoSocial(null)
        setGeral(null)
        setFidelidade(null)
        setOcorrido("")
    };

    const enviarDenuncia = async () => {
        const userToken = await AsyncStorage.getItem("token");

        await axios.post(`${API_URL.base}/lojas/${loja?.id}/denuncia`, {
            "geral": geral,
            "fidelidade": fidelidade,
            "ocorrido": ocorrido
        }, {
            headers: {
                Authorization: `Bearer ${userToken.slice(1, -1)}`
            },
        }).then((res) => {
            setDenunciaFinalizada(true)
            setRazaoSocial(null)
            setGeral(null)
            setFidelidade(null)
            setOcorrido("")
            setTimeout(
                () => {
                    setDenunciaFinalizada(false)
                    setDenuncia(false)
                },
                3000
            );
        }).catch((error) => {
        });
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "white",
                paddingTop: StatusBar.currentHeight,
            }}
        >
            <Header icon={true} onPress={() => navigation.goBack()} />

            <ScrollView>
                <Text style={{
                    marginLeft: '5%',
                    marginTop: 12,
                    fontSize: 24,
                    fontWeight: "700",
                    height: 32,
                    color: "black"
                }}>Denuncie uma loja</Text>

                <View style={{
                    alignItems: "center",
                    borderRadius: 32,
                    marginHorizontal: 16,
                    marginVertical: 8,
                    backgroundColor: "#DCDCDC",
                    flexDirection: "row",
                    flexDirection: "row"
                }}>
                    <TextInput
                        placeholder="Razão Social"
                        style={{
                            width: "90%",
                            borderRadius: 32,
                            color: "black",
                            padding: 16
                        }}
                        placeholderTextColor="grey"
                        onChangeText={(text) => setRazaoSocial(text)}
                        returnKeyType={"search"}
                        onSubmitEditing={handleSearch}
                        value={razaoSocial}
                    />
                    <Icon
                        name='search'
                        type='font-awesome'
                        color="#878383"
                        size={24}
                        onPress={handleSearch}
                    />
                </View>

                <Text style={{
                    color: "black",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginLeft: '5%',
                    marginTop: 10
                }}>Lojas{razaoSocial ? ` com "${razaoSocial}"` : ' recentes'}</Text>
                {lojas.map((item) => (
                    <Card
                        item={item}
                        key={item?.id}
                        onPress={() => {
                            setLoja(item)
                            toggleOverlay()
                        }}
                    />
                ))}
            </ScrollView>
            <Nav />

            {denuncia && (
                <Overlay
                    isVisible={denuncia}
                    onBackdropPress={() => {
                        toggleOverlay();
                        setDenuncia(false);
                    }}
                    overlayStyle={{
                        width: '90%',
                        borderRadius: 16,
                        padding: 0
                    }}
                >
                    <ScrollView>
                        <View style={{ padding: 24, paddingBottom: 16 }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: "black", textAlign: "center" }}>
                                Denunciar loja
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: "Regular", color: "black", textAlign: "center" }}>
                                Nos conte o que aconteceu.
                            </Text>
                        </View>

                        <View style={{
                            width: '84%',
                            marginLeft: '7%',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Avatar
                                rounded
                                size={64}
                                source={{ uri: loja?.imagem }}
                                containerStyle={{ backgroundColor: "gray", marginRight: 16 }}
                            />
                            <Text
                                style={{
                                    width: '73%',
                                    fontSize: 18, color: 'black',
                                    fontWeight: 'bold', flexWrap: "wrap",
                                }}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >{loja?.nomeFantasia}</Text>
                        </View>

                        <View style={{ width: '90%', marginHorizontal: '5%' }}>
                            <CheckBox
                                checked={geral}
                                title="Atendimento Geral"
                                onPress={() => {
                                    setGeral(true)
                                    setFidelidade(false)
                                }}
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                            />
                            <CheckBox
                                checked={fidelidade}
                                title="Programa de Fidelização"
                                onPress={() => {
                                    setFidelidade(true)
                                    setGeral(false)
                                }}
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                            />

                            <Input
                                borderRadius={24}
                                title={"Ocorrido"}
                                description={true}
                                onChangeText={value => setOcorrido(value)}
                                height={250}
                                value={ocorrido}
                                placeholder={
                                    "Descreva o ocorrido"
                                }
                            />
                        </View>

                        <View style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            paddingBottom: 30
                        }}>
                            <View style={{ width: '85%', marginTop: 5 }}>
                                <Button
                                    disabled={(geral == null || fidelidade == null || ocorrido.length == 0) ? true : false}
                                    onPress={enviarDenuncia}
                                    label={"Enviar"}
                                    marginTop={24}
                                    backgroundColor={(geral == null || fidelidade == null || ocorrido.length == 0) ? "lightgrey" : "#005098"}
                                    width={"100%"}
                                    textColor={"#FFFFFF"}
                                    padding={16}
                                    fontSize={16}
                                    borderRadius={32}
                                    fontWeight={"bold"}
                                />

                                <Button
                                    onPress={() => {
                                        toggleOverlay();
                                        setDenuncia(false);
                                    }}
                                    label={"Cancelar"}
                                    marginTop={10}
                                    backgroundColor={"#DC143C"}
                                    width={"100%"}
                                    textColor={"#FFFFFF"}
                                    padding={16}
                                    fontSize={16}
                                    borderRadius={32}
                                    fontWeight={"bold"}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </Overlay>
            )}

            {denunciaFinalizada && (
                <Overlay
                    isVisible={denuncia}
                    onBackdropPress={() => {
                        toggleOverlay();
                        setDenuncia(false);
                        setDenunciaFinalizada(false);
                    }}
                    overlayStyle={{
                        width: '90%',
                        borderRadius: 16,
                        padding: 0
                    }}
                >
                    <View style={{ padding: 24, paddingVertical: 50, alignItems: "center" }}>
                        <Icon
                            name='envelope'
                            type='font-awesome'
                            color='#005098'
                            size={64}
                        />
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "black", marginTop: 20 }}>
                            Sua mensagem foi encaminhada para o e-mail do Scotter (lojista).
                        </Text>
                    </View>
                </Overlay>
            )}
        </SafeAreaView>
    );
}
