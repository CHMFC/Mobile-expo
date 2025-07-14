import React, { useState, useEffect } from "react";
import { Dimensions, TouchableOpacity } from "react-native";

import { Header } from "../../components/header/Header";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Data } from "../../components/datas/Data";

import { SafeAreaView, View, Text, ScrollView } from "react-native";
import usePersist from "../../hooks/usePersist";
import { Image, Avatar } from "react-native-elements";

import axios from "axios";

import { BarChart } from "react-native-gifted-charts";

import { captureScreen } from "react-native-view-shot";
import { StatusBar } from "react-native";
import { API_URL } from "../../const/apiUrl";

export function RelatorioFaixaEtariaShare({ navigation, route }) {
  const { lojaId, dataComeco, dataFim, lojaNome, lojaImagem } = route.params;
  const [width, setWidth] = useState(Dimensions.get("window").width);

  const [dadosClientes, setDadosClientes] = useState([]);

  const [dataFinalVisivel, setDataFinalVisivel] = useState(false);
  const [dataInicioVisivel, setDataInicioVisivel] = useState(false);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());

  const [tokenCelular18a24anos, setTokenCelular18a24anos] = useState([]);
  const [tokenCelular25a34anos, setTokenCelular25a34anos] = useState([]);
  const [tokenCelular35a44anos, setTokenCelular35a44anos] = useState([]);
  const [tokenCelular45a54anos, setTokenCelular45a54anos] = useState([]);
  const [tokenCelular55a64anos, setTokenCelular55a64anos] = useState([]);
  const [tokenCelular65mais, setTokenCelular65mais] = useState([]);

  const { tokenStored } = usePersist();

  const dataInicioTratada = `${dataInicio.getFullYear()}-${String(
    dataInicio.getMonth() + 1
  ).padStart(2, "0")}-${dataInicio.getDate().toString().padStart(2, "0")}`;

  const dataFinalTratada = `${dataFinal.getFullYear()}-${String(
    dataFinal.getMonth() + 1
  ).padStart(2, "0")}-${dataFinal.getDate().toString().padStart(2, "0")}`;

  useEffect(() => {
    async function pegarClientes() {
      await axios
        .get(
          `${API_URL.base}/lojas/${lojaId}/clientes/faixaetaria`,
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

          if (tokenCelular18a24anos?.length === 0) {
            res?.data?.de18a24anos?.clientes.forEach((item) =>
              setTokenCelular18a24anos(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          if (tokenCelular25a34anos?.length === 0) {
            res?.data?.de25a34anos?.clientes?.forEach((item) =>
              setTokenCelular25a34anos(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          if (tokenCelular35a44anos?.length === 0) {
            res?.data?.de35a44anos?.clientes?.forEach((item) =>
              setTokenCelular35a44anos(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          if (tokenCelular45a54anos?.length === 0) {
            res?.data?.de45a54anos?.clientes?.forEach((item) =>
              setTokenCelular45a54anos(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          if (tokenCelular55a64anos?.length === 0) {
            res?.data?.de55a64anos?.clientes?.forEach((item) =>
              setTokenCelular55a64anos(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          if (tokenCelular65mais?.length === 0) {
            res?.data?.mais65anos?.clientes?.forEach((item) =>
              setTokenCelular65mais(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          setTimeout(() => {
            captureScreen({
              format: "jpg",
              quality: 1,
              filename: "relatorio-de-faixa-etaria",
              filenames: ["relatorio-de-faixa-etaria"],
            }).then(
              (uri) => {
                navigation.navigate("RelatorioFaixaEtaria", {
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
        })
        .catch((err) => {
          return null;
        });
    }
    pegarClientes();
  }, [dataInicio, dataFinal]);

  useEffect(() => {
    Dimensions.addEventListener("change", ({ window: { width, height } }) => {
      setWidth(width);
    });
  }, []);

  const mostrarDataInicio = () => {
    setDataInicioVisivel(true);
  };

  const esconderDataInicio = () => {
    setDataInicioVisivel(false);
  };

  const mostrarDataFinal = () => {
    setDataFinalVisivel(true);
  };
  const esconderDataFinal = () => {
    setDataFinalVisivel(false);
  };

  const confirmarDataInicio = (date) => {
    setDataInicio(date);
    esconderDataInicio();
    setIsLoading(true);
  };

  const confirmarDataFinal = (date) => {
    setDataFinal(date);
    setIsLoading(true);
    esconderDataFinal();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Header
        icon={false}
        iconNotifications={false}
        onPress={() => navigation.goBack()}
      />

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
          Relatório de Faixa Etária
        </Text>

        <View
          style={{
            alignItems: "center",
            marginVertical: 12,
            marginBottom: 60,
          }}
        >
          <View style={{ flexDirection: "row", marginHorizontal: 12 }}>
            <Data
              data={`${dataComeco.substring(8, 10)}/${dataComeco.substring(
                5,
                7
              )}/${dataComeco.substring(0, 4)}`}
              periodo={"início"}
              onPress={mostrarDataInicio}
            />
            <DateTimePickerModal
              isVisible={dataInicioVisivel}
              mode="date"
              date={dataInicio}
              onConfirm={confirmarDataInicio}
              onCancel={esconderDataInicio}
              maximumDate={dataFinal}
            />
            <Data
              data={`${dataFim.substring(8, 10)}/${dataFim.substring(
                5,
                7
              )}/${dataFim.substring(0, 4)}`}
              periodo={"final"}
              onPress={mostrarDataFinal}
            />
            <DateTimePickerModal
              isVisible={dataFinalVisivel}
              mode="date"
              date={dataFinal}
              onConfirm={confirmarDataFinal}
              onCancel={esconderDataFinal}
              minimumDate={dataInicio}
              maximumDate={new Date()}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-between",
              marginVertical: 12,
            }}
          >
            <View
              style={{
                width: "48%",
                backgroundColor: "#f19b3e",
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                De 18 a 24 anos
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
                  {dadosClientes?.de18a24anos?.quantidadeClientes}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "48%",
                backgroundColor: "#f13e6a",
                paddingVertical: 16,
                paddingHorizontal: 24,
                height: 100,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                De 25 a 34 anos
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
                  {dadosClientes?.de25a34anos?.quantidadeClientes}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: "48%",
                backgroundColor: "#13ac3b",
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                De 35 a 44 anos
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
                  {dadosClientes?.de35a44anos?.quantidadeClientes}
                </Text>
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
                  fontSize: 16,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                De 45 a 54 anos
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
                  {dadosClientes?.de45a54anos?.quantidadeClientes}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: "48%",
                backgroundColor: "#1F5A9E",
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                De 55 a 64 anos
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
                  {dadosClientes?.de55a64anos?.quantidadeClientes}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "48%",
                backgroundColor: "#7f4ecf",
                paddingVertical: 16,
                paddingHorizontal: 24,
                height: 100,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                65 anos +
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
                  {dadosClientes?.mais65anos?.quantidadeClientes}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {
          <View
            style={{
              display: "flex",
              width: "90%",
              marginTop: -60,
              marginLeft: width <= 400 ? 18 : 40,
              marginBottom: 0,
            }}
          >
            <View
              style={{
                height: 32,
              }}
            >
              <View
                style={{
                  marginLeft: width <= 400 ? -5 : -40,
                  marginTop: width <= 400 ? -65 : -90,
                }}
              >
                <BarChart
                  horizontal
                  barWidth={24}
                  height={width <= 400 ? 354 : width * 0.9}
                  maxValue={100}
                  initialSpacing={0}
                  spacing={0}
                  labelsExtraHeight={0}
                  noOfSectionsBelowXAxis={2}
                  barBorderRadius={8}
                  hideYAxisText={true}
                  hideRules={true}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  disablePress={true}
                  stackData={[
                    {
                      stacks: [
                        {
                          value: dadosClientes?.de18a24anos?.porcentagem
                            ? dadosClientes?.de18a24anos?.porcentagem
                            : 0,
                          color: "#f19b3e",
                          marginBottom: 0,
                        },
                        {
                          value: dadosClientes?.de25a34anos?.porcentagem
                            ? dadosClientes?.de25a34anos?.porcentagem
                            : 0,
                          color: "#f13e6a",
                          marginBottom: 2,
                        },
                        {
                          value: dadosClientes?.de35a44anos?.porcentagem
                            ? dadosClientes?.de35a44anos?.porcentagem
                            : 0,
                          color: "#13ac3b",
                          marginBottom: 2,
                        },
                        {
                          value: dadosClientes?.de45a54anos?.porcentagem
                            ? dadosClientes?.de45a54anos?.porcentagem
                            : 0,
                          color: "#3685e0",
                          marginBottom: 2,
                        },
                        {
                          value: dadosClientes?.de55a64anos?.porcentagem
                            ? dadosClientes?.de55a64anos?.porcentagem
                            : 0,
                          color: "#1F5A9E",
                          marginBottom: 2,
                        },
                        {
                          value: dadosClientes?.mais65anos?.porcentagem
                            ? dadosClientes?.mais65anos?.porcentagem
                            : 0,
                          color: "#7f4ecf",
                          marginBottom: 2,
                        },
                        {
                          value: Math.abs(
                            100 -
                            (dadosClientes?.de18a24anos?.porcentagem
                              ? dadosClientes?.de18a24anos?.porcentagem
                              : 0) -
                            (dadosClientes?.de25a34anos?.porcentagem
                              ? dadosClientes?.de25a34anos?.porcentagem
                              : 0) -
                            (dadosClientes?.de35a44anos?.porcentagem
                              ? dadosClientes?.de35a44anos?.porcentagem
                              : 0) -
                            (dadosClientes?.de45a54anos?.porcentagem
                              ? dadosClientes?.de45a54anos?.porcentagem
                              : 0) -
                            (dadosClientes?.de55a64anos?.porcentagem
                              ? dadosClientes?.de55a64anos?.porcentagem
                              : 0) -
                            (dadosClientes?.mais65anos?.porcentagem
                              ? dadosClientes?.mais65anos?.porcentagem
                              : 0)
                          ),
                          color: "#5f6368",
                          marginBottom: 2,
                        },
                      ],
                    },
                  ]}
                />
              </View>
            </View>

            <View
              style={{
                marginHorizontal: 5,
                display: "flex",
              }}
            >
              {dadosClientes?.de18a24anos?.porcentagem ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#f19b3e",
                        borderRadius: 16,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 30,
                        color: "#f19b3e",
                        fontWeight: "bold",
                      }}
                    >
                      18 anos - 24 anos
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 30,
                      color: "#f19b3e",
                      fontWeight: "bold",
                    }}
                  >
                    {dadosClientes?.de18a24anos?.porcentagem}%
                  </Text>
                </View>
              ) : null}
              {dadosClientes?.de25a34anos?.porcentagem ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#f13e6a",
                        borderRadius: 16,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 30,
                        color: "#f13e6a",
                        fontWeight: "bold",
                      }}
                    >
                      25 anos - 34 anos
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 30,
                      color: "#f13e6a",
                      fontWeight: "bold",
                    }}
                  >
                    {dadosClientes?.de25a34anos?.porcentagem}%
                  </Text>
                </View>
              ) : null}
              {dadosClientes?.de35a44anos?.porcentagem ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#13ac3b",
                        borderRadius: 16,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 30,
                        color: "#13ac3b",
                        fontWeight: "bold",
                      }}
                    >
                      35 anos - 44 anos
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 30,
                      color: "#13ac3b",
                      fontWeight: "bold",
                    }}
                  >
                    {dadosClientes?.de35a44anos?.porcentagem}%
                  </Text>
                </View>
              ) : null}
              {dadosClientes?.de45a54anos?.porcentagem ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#3685e0",
                        borderRadius: 16,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 30,
                        color: "#3685e0",
                        fontWeight: "bold",
                      }}
                    >
                      45 anos - 54 anos
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 30,
                      color: "#3685e0",
                      fontWeight: "bold",
                    }}
                  >
                    {dadosClientes?.de45a54anos?.porcentagem}%
                  </Text>
                </View>
              ) : null}
              {dadosClientes?.de55a64anos?.porcentagem ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#1F5A9E",
                        borderRadius: 16,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 30,
                        color: "#1F5A9E",
                        fontWeight: "bold",
                      }}
                    >
                      55 anos - 64 anos
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 30,
                      color: "#1F5A9E",
                      fontWeight: "bold",
                    }}
                  >
                    {dadosClientes?.de55a64anos?.porcentagem}%
                  </Text>
                </View>
              ) : null}
              {dadosClientes?.mais65anos?.porcentagem ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#7f4ecf",
                        borderRadius: 16,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 30,
                        color: "#7f4ecf",
                        fontWeight: "bold",
                      }}
                    >
                      65 anos +
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 30,
                      color: "#7f4ecf",
                      fontWeight: "bold",
                    }}
                  >
                    {dadosClientes?.mais65anos?.porcentagem}%
                  </Text>
                </View>
              ) : null}
              {Math.round(
                (100 -
                  (dadosClientes?.de18a24anos?.porcentagem
                    ? dadosClientes?.de18a24anos?.porcentagem
                    : 0) -
                  (dadosClientes?.de25a34anos?.porcentagem
                    ? dadosClientes?.de25a34anos?.porcentagem
                    : 0) -
                  (dadosClientes?.de35a44anos?.porcentagem
                    ? dadosClientes?.de35a44anos?.porcentagem
                    : 0) -
                  (dadosClientes?.de45a54anos?.porcentagem
                    ? dadosClientes?.de45a54anos?.porcentagem
                    : 0) -
                  (dadosClientes?.de55a64anos?.porcentagem
                    ? dadosClientes?.de55a64anos?.porcentagem
                    : 0) -
                  (dadosClientes?.mais65anos?.porcentagem
                    ? dadosClientes?.mais65anos?.porcentagem
                    : 0) +
                  Number.EPSILON) *
                100
              ) /
                100 >
                0.1 ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#5f6368",
                        borderRadius: 16,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 30,
                        color: "#5f6368",
                        fontWeight: "bold",
                      }}
                    >
                      Nenhuma faixa
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 30,
                      color: "#5f6368",
                      fontWeight: "bold",
                    }}
                  >
                    {Math.round(
                      (100 -
                        (dadosClientes?.de18a24anos?.porcentagem
                          ? dadosClientes?.de18a24anos?.porcentagem
                          : 0) -
                        (dadosClientes?.de25a34anos?.porcentagem
                          ? dadosClientes?.de25a34anos?.porcentagem
                          : 0) -
                        (dadosClientes?.de35a44anos?.porcentagem
                          ? dadosClientes?.de35a44anos?.porcentagem
                          : 0) -
                        (dadosClientes?.de45a54anos?.porcentagem
                          ? dadosClientes?.de45a54anos?.porcentagem
                          : 0) -
                        (dadosClientes?.de55a64anos?.porcentagem
                          ? dadosClientes?.de55a64anos?.porcentagem
                          : 0) -
                        (dadosClientes?.mais65anos?.porcentagem
                          ? dadosClientes?.mais65anos?.porcentagem
                          : 0) +
                        Number.EPSILON) *
                      100
                    ) / 100}
                    %
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}
