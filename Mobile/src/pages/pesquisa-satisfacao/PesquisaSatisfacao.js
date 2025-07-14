import { useState, useEffect } from "react";
import { ScrollView, View, SafeAreaView, Alert } from "react-native";
import { Text } from "@rneui/base";
import { styles } from "./PesquisaSatisfacaoStyles";
import { Avatar, CheckBox } from "react-native-elements";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Form from "../../components/form/Form";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import("react-native-image-picker");
import usePersist from "../../hooks/usePersist";
import axios from "axios";
import { API_URL } from "../../const/apiUrl";

export default function PesquisaSatisfacao({ route, navigation }) {
    const { id } = route.params;
    const { tokenStored } = usePersist();

    const mostrarMensagem = (mensagem) => {
        showMessage({
            message: "Sucesso",
            description: mensagem,
            type: "success",
            style: { height: 100 },
            titleStyle: {
                fontWeight: "bold",
                fontSize: 20,
                justifyContent: "center",
                marginTop: "auto",
                alignSelf: "center",
            },
        });
    };

    const [loja, setLoja] = useState();
    const [atendimento, setAtendimento] = useState(0);
    const [limpeza, setLimpeza] = useState(0);
    const [qualidade, setQualidade] = useState(0);
    const [variedade, setVariedade] = useState(0);
    const [preco, setPreco] = useState(0);

    useEffect(() => {
        async function buscarDadosDaLoja() {
            await axios.get(
                `${API_URL.base}/lojas/${id}`
            ).then((response) => {
                setLoja(response?.data);
            }).catch((err) => {
                return null;
            });
        }
        buscarDadosDaLoja();
    }, []);

    const enviarPesquisa = async () => {
        const data = {
            "atendimento": atendimento,
            "limpeza": limpeza,
            "qualidade": qualidade,
            "variedade": variedade,
            "preco": preco
        }

        await axios.post(`${API_URL.base}/lojas/${id}/satisfacao`, data, {
            headers: {
                Authorization: `Bearer ${tokenStored}`
            },
        }).then((res) => {
            mostrarMensagem("Pesquisa finalizada");
            setTimeout(
                () => navigation.navigate("Home"),
                1700
            );
        }).catch((error) => {
            Alert.alert("Erro", "Falha ao enviar pesquisa!");
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={[styles.mainContainer, { backgroundColor: "white" }]}>
                <Header
                    title={"FIDELIZE PE"}
                    icon={true}
                    onPress={() => navigation.goBack()}
                />
                <View>
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
                </View>

                <View style={{
                    width: '80%',
                    marginLeft: '10%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15
                }}>
                    <Avatar
                        rounded
                        size={64}
                        source={{ uri: loja?.imagem }}
                        containerStyle={{ backgroundColor: "gray", marginRight: 16 }}
                    />
                    <Text
                        style={{
                            width: '66%',
                            fontSize: 18, color: 'black',
                            fontWeight: 'bold', flexWrap: "wrap",
                        }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >{loja?.nomeFantasia}</Text>
                </View>

                <View style={styles.container}>
                    <Form>
                        <View style={{
                            width: '100%',
                            borderWidth: 1,
                            borderRadius: 16,
                            borderColor: '#d3d3d3',
                            marginBottom: 10
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#545454',
                                fontWeight: 'bold',
                                marginHorizontal: 12,
                                marginTop: 10
                            }}>Atendimento</Text>

                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                paddingBottom: 5,
                            }}>
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={atendimento >= 1 ? true : false}
                                    onPress={() => { setAtendimento(1) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={atendimento >= 2 ? true : false}
                                    onPress={() => { setAtendimento(2) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={atendimento >= 3 ? true : false}
                                    onPress={() => { setAtendimento(3) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={atendimento >= 4 ? true : false}
                                    onPress={() => { setAtendimento(4) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={atendimento >= 5 ? true : false}
                                    onPress={() => { setAtendimento(5) }}
                                />
                            </View>
                        </View>

                        <View style={{
                            width: '100%',
                            borderWidth: 1,
                            borderRadius: 16,
                            borderColor: '#d3d3d3',
                            marginBottom: 10
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#545454',
                                fontWeight: 'bold',
                                marginHorizontal: 12,
                                marginTop: 10
                            }}>Limpeza</Text>

                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                paddingBottom: 5,
                            }}>
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={limpeza >= 1 ? true : false}
                                    onPress={() => { setLimpeza(1) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={limpeza >= 2 ? true : false}
                                    onPress={() => { setLimpeza(2) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={limpeza >= 3 ? true : false}
                                    onPress={() => { setLimpeza(3) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={limpeza >= 4 ? true : false}
                                    onPress={() => { setLimpeza(4) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={limpeza >= 5 ? true : false}
                                    onPress={() => { setLimpeza(5) }}
                                />
                            </View>
                        </View>

                        <View style={{
                            width: '100%',
                            borderWidth: 1,
                            borderRadius: 16,
                            borderColor: '#d3d3d3',
                            marginBottom: 10
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#545454',
                                fontWeight: 'bold',
                                marginHorizontal: 12,
                                marginTop: 10
                            }}>Qualidade</Text>

                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                paddingBottom: 5,
                            }}>
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={qualidade >= 1 ? true : false}
                                    onPress={() => { setQualidade(1) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={qualidade >= 2 ? true : false}
                                    onPress={() => { setQualidade(2) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={qualidade >= 3 ? true : false}
                                    onPress={() => { setQualidade(3) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={qualidade >= 4 ? true : false}
                                    onPress={() => { setQualidade(4) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={qualidade >= 5 ? true : false}
                                    onPress={() => { setQualidade(5) }}
                                />
                            </View>
                        </View>

                        <View style={{
                            width: '100%',
                            borderWidth: 1,
                            borderRadius: 16,
                            borderColor: '#d3d3d3',
                            marginBottom: 10
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#545454',
                                fontWeight: 'bold',
                                marginHorizontal: 12,
                                marginTop: 10
                            }}>Variedade</Text>

                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                paddingBottom: 5,
                            }}>
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={variedade >= 1 ? true : false}
                                    onPress={() => { setVariedade(1) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={variedade >= 2 ? true : false}
                                    onPress={() => { setVariedade(2) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={variedade >= 3 ? true : false}
                                    onPress={() => { setVariedade(3) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={variedade >= 4 ? true : false}
                                    onPress={() => { setVariedade(4) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={variedade >= 5 ? true : false}
                                    onPress={() => { setVariedade(5) }}
                                />
                            </View>
                        </View>

                        <View style={{
                            width: '100%',
                            borderWidth: 1,
                            borderRadius: 16,
                            borderColor: '#d3d3d3',
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#545454',
                                fontWeight: 'bold',
                                marginHorizontal: 12,
                                marginTop: 10
                            }}>Preço</Text>

                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                paddingBottom: 5,
                            }}>
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={preco >= 1 ? true : false}
                                    onPress={() => { setPreco(1) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={preco >= 2 ? true : false}
                                    onPress={() => { setPreco(2) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={preco >= 3 ? true : false}
                                    onPress={() => { setPreco(3) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={preco >= 4 ? true : false}
                                    onPress={() => { setPreco(4) }}
                                />
                                <CheckBox
                                    containerStyle={{
                                        padding: 0,
                                        justifyContent: "center",
                                        maxHeight: 36
                                    }}
                                    iconType='font-awesome'
                                    checkedIcon='star'
                                    uncheckedIcon='star'
                                    checkedColor='gold'
                                    size={32}
                                    checked={preco >= 5 ? true : false}
                                    onPress={() => { setPreco(5) }}
                                />
                            </View>
                        </View>

                        <Button
                            onPress={enviarPesquisa}
                            label={"Enviar"}
                            marginTop={24}
                            backgroundColor={"#005098"}
                            width={"100%"}
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
