import * as React from "react";
import { useState, useEffect } from "react";
import { View, SafeAreaView, Text, ScrollView } from "react-native";
import { Header } from "../../components/header/Header";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import { Icon, Avatar } from "react-native-elements";
import { PieChart } from "react-native-gifted-charts";


import { Data } from "../../components/datas/Data";
import { captureScreen } from "react-native-view-shot";
import { API_URL } from "../../const/apiUrl";

export function RelatorioSatisfacaoShare({ navigation, route }) {
    const { lojaId, dataComeco, dataFim, lojaNome, lojaImagem } = route.params;

    const [dadosClientes, setDadosClientes] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataFinal, setDataFinal] = useState(new Date());

    const { tokenStored } = usePersist();

    useEffect(() => {
        async function pegarClientes() {
            await axios
                .get(
                    `${API_URL.base}/lojas/${lojaId}/pesquisaSatisfacao`,
                    {
                        headers: { Authorization: `Bearer ${tokenStored}` },
                        params: {
                            dataInicio: dataComeco,
                            dataFim: dataFim,
                        },
                    }
                )
                .then((res) => {
                    setDadosClientes(res?.data);

                    res?.data?.clientes?.respondeu?.clientes?.forEach((item) =>
                        setTokenCelularAtivos(
                            (prevToken) => new Set([...prevToken, item?.tokenCelular])
                        )
                    );

                    res?.data?.clientes?.naoRespondeu?.clientes?.forEach((item) =>
                        setTokenCelularInativos(
                            (prevToken) => new Set([...prevToken, item?.tokenCelular])
                        )
                    );
                })
                .catch((err) => {
                    return null;
                });
        }
        pegarClientes();

        setTimeout(() => {
            captureScreen({
                format: "jpg",
                quality: 1,
                filename: "relatorio-de-genero",
                filenames: ["relatorio-de-genero"],
            }).then(
                (uri) => {
                    navigation.navigate("RelatorioSatisfacao", {
                        lojaId: lojaId,
                        printUrl: uri,
                        lojaNome: lojaNome,
                        lojaImagem: lojaImagem,
                    });
                },
                (error) => {
                    return null;
                }
            );
        }, 500);
    }, [dataInicio, dataFinal, isLoading]);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "white"
            }}
        >
            <Header icon={false} iconNotifications={false} onPress={() => navigation.goBack()} />

            <ScrollView>
                <View
                    style={{
                        width: "90%",
                        marginLeft: "5%",
                        marginBottom: 5,
                        paddingTop: 8,
                        paddingBottom: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        borderBottomColor: "#1F5A9E95",
                        borderBottomWidth: 1,
                    }}
                >
                    <Avatar
                        rounded
                        size={54}
                        source={{ uri: lojaImagem }}
                        containerStyle={{ backgroundColor: "gray", marginRight: 16 }}
                    />
                    <Text
                        style={{
                            width: "77%",
                            fontSize: 18,
                            color: "black",
                            fontWeight: "bold",
                            flexWrap: "wrap",
                        }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {lojaNome}
                    </Text>
                </View>
                <Text
                    style={{
                        width: "90%",
                        marginLeft: "5%",
                        marginBottom: -5,
                        fontSize: 18,
                        color: "black",
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    Relatório de Satisfação
                </Text>

                <View
                    style={{
                        marginTop: 12,
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            marginHorizontal: 12,
                            marginBottom: 12,
                        }}
                    >
                        <Data
                            data={`${dataComeco.substring(8, 10)}/${dataComeco.substring(5, 7)}/${dataComeco.substring(0, 4)}`}
                            periodo={"início"}
                            disabled
                        />
                        <Data
                            data={`${dataFim.substring(8, 10)}/${dataFim.substring(5, 7)}/${dataFim.substring(0, 4)}`}
                            periodo={"final"}
                            disabled
                        />
                    </View>

                    <View
                        style={{
                            width: "90%",
                            backgroundColor: "#1F5A9E",
                            padding: 20,
                            borderRadius: 16,
                            marginBottom: 12,
                            height: 100,
                        }}
                    >
                        <View style={{ flexDirection: "column", paddingHorizontal: 16 }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: 16,
                                        marginBottom: 4,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Total de Pesquisas
                                </Text>
                            </View>
                            <Text
                                style={{ color: "white", fontSize: 22, fontWeight: "bold" }}
                            >
                                {dadosClientes?.totalPesquisas || 0}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            width: "90%",
                            justifyContent: "space-between",
                        }}
                    >
                        <View
                            style={{
                                width: "48%",
                                backgroundColor: "#1F5A9E",
                                paddingVertical: 16,
                                paddingHorizontal: 24,
                                borderRadius: 16,
                                flexDirection: "row",
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: 16,
                                        marginBottom: 4,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Respondidas
                                </Text>
                                <View style={{ flexDirection: "row", marginTop: 4 }}>
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 18,
                                            fontWeight: "bold",
                                            width: "75%",
                                        }}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {dadosClientes?.respondeu || 0}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                width: "48%",
                                backgroundColor: "#3685e0",
                                paddingVertical: 16,
                                paddingHorizontal: 24,
                                height: 100,
                                borderRadius: 16,
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 15,
                                    marginBottom: 4,
                                    fontWeight: "bold",
                                }}
                            >
                                Não respondidas
                            </Text>
                            <View style={{ flexDirection: "row", marginTop: 4 }}>
                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: 18,
                                        fontWeight: "bold",
                                        width: "75%",
                                    }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {dadosClientes?.naoRespondeu || 0}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            paddingTop: 20,
                            paddingLeft: 20,
                        }}
                    >
                        <PieChart
                            data={[
                                {
                                    value: dadosClientes?.porcentagens?.respondeu || 0,
                                    color: "#1F5A9E",
                                },
                                {
                                    value: 100 - dadosClientes?.porcentagens?.respondeu || 100,
                                    color: "lightgrey",
                                },
                            ]}
                            donut
                            radius={80}
                            innerRadius={60}
                            centerLabelComponent={() => {
                                return (
                                    <View
                                        style={{ justifyContent: "center", alignItems: "center" }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                color: "#1F5A9E",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {dadosClientes?.porcentagens?.respondeu || 0}%
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#1F5A9E",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Respondidas
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                        <PieChart
                            data={[
                                {
                                    value: dadosClientes?.porcentagens?.naoRespondeu || 0,
                                    color: "#3685e0",
                                },
                                {
                                    value: 100 - dadosClientes?.porcentagens?.naoRespondeu || 100,
                                    color: "lightgrey",
                                },
                            ]}
                            donut
                            radius={80}
                            innerRadius={60}
                            centerLabelComponent={() => {
                                return (
                                    <View
                                        style={{ justifyContent: "center", alignItems: "center" }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                color: "#3685e0",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {dadosClientes?.porcentagens?.naoRespondeu || 0}%
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: "#3685e0",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Não Respondidas
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                    </View>
                </View>

                <View
                    style={{
                        width: "80%",
                        marginHorizontal: "10%",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: "lightgrey",
                            paddingVertical: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                lineHeight: 30,
                                color: "black",
                                fontWeight: "bold",
                            }}
                        >
                            Atendimento
                        </Text>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    lineHeight: 30,
                                    color: "black",
                                    fontWeight: "bold",
                                    marginRight: 5,
                                }}
                            >
                                {dadosClientes?.medias?.atendimento?.media.toFixed(1)}
                            </Text>

                            <Icon type="font-awesome" name="star" color="gold" />
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: "lightgrey",
                            paddingVertical: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                lineHeight: 30,
                                color: "black",
                                fontWeight: "bold",
                            }}
                        >
                            Limpeza
                        </Text>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    lineHeight: 30,
                                    color: "black",
                                    fontWeight: "bold",
                                    marginRight: 5,
                                }}
                            >
                                {dadosClientes?.medias?.limpeza?.media.toFixed(1)}
                            </Text>

                            <Icon type="font-awesome" name="star" color="gold" />
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: "lightgrey",
                            paddingVertical: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                lineHeight: 30,
                                color: "black",
                                fontWeight: "bold",
                            }}
                        >
                            Qualidade
                        </Text>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    lineHeight: 30,
                                    color: "black",
                                    fontWeight: "bold",
                                    marginRight: 5,
                                }}
                            >
                                {dadosClientes?.medias?.qualidade?.media.toFixed(1)}
                            </Text>

                            <Icon type="font-awesome" name="star" color="gold" />
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: "lightgrey",
                            paddingVertical: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                lineHeight: 30,
                                color: "black",
                                fontWeight: "bold",
                            }}
                        >
                            Variedade
                        </Text>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    lineHeight: 30,
                                    color: "black",
                                    fontWeight: "bold",
                                    marginRight: 5,
                                }}
                            >
                                {dadosClientes?.medias?.variedade?.media.toFixed(1)}
                            </Text>

                            <Icon type="font-awesome" name="star" color="gold" />
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                lineHeight: 30,
                                color: "black",
                                fontWeight: "bold",
                            }}
                        >
                            Preço
                        </Text>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    lineHeight: 30,
                                    color: "black",
                                    fontWeight: "bold",
                                    marginRight: 5,
                                }}
                            >
                                {dadosClientes?.medias?.preco?.media.toFixed(1)}
                            </Text>

                            <Icon type="font-awesome" name="star" color="gold" />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
