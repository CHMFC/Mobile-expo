import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, Text, ScrollView } from "react-native";
import { Header } from "../../components/header/Header";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import { Avatar } from "react-native-elements";
import { PieChart } from "react-native-gifted-charts";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Data } from "../../components/datas/Data";

import { captureScreen } from "react-native-view-shot";
import { StatusBar } from "react-native";
import { API_URL } from "../../const/apiUrl";

export function RelatorioClienteShare({ navigation, route }) {
  const { lojaId, dataComeco, dataFim, lojaNome, lojaImagem } = route.params;

  const [dadosClientes, setDadosClientes] = useState([]);
  const [visible, setVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [dataFinalVisivel, setDataFinalVisivel] = useState(false);
  const [dataInicioVisivel, setDataInicioVisivel] = useState(false);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());

  const [tokenCelularAtivos, setTokenCelularAtivos] = useState([]);
  const [tokenCelularInativos, setTokenCelularInativos] = useState([]);

  const { tokenStored } = usePersist();

  const dataInicioTratada = `${dataInicio.getFullYear()}-${String(
    dataInicio.getMonth() + 1
  ).padStart(2, "0")}-${dataInicio.getDate().toString().padStart(2, "0")}`;

  const dataFinalTratada = `${dataFinal.getFullYear()}-${String(
    dataFinal.getMonth() + 1
  ).padStart(2, "0")}-${dataFinal.getDate().toString().padStart(2, "0")}`;

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

  useEffect(() => {
    async function pegarClientes() {
      await axios
        .get(
          `${API_URL.base}/lojas/${lojaId}/clientes`,
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

          res?.data?.clientesAtivos?.forEach((item) =>
            setTokenCelularAtivos(
              (prevToken) => new Set([...prevToken, item?.tokenCelular])
            )
          );

          res?.data?.clientesInativos?.forEach((item) =>
            setTokenCelularInativos(
              (prevToken) => new Set([...prevToken, item?.tokenCelular])
            )
          );

          setTimeout(() => {
            captureScreen({
              format: "jpg",
              quality: 1,
              filename: "relatorio-de-clientes",
              filenames: ["relatorio-de-clientes"],
            }).then(
              (uri) => {
                navigation.navigate("RelatorioCliente", {
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
        });
    }
    pegarClientes();
  }, [dataInicio, dataFinal, isLoading]);

  const toggleOverlay = () => {
    setVisible(!visible);
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
            marginBottom: 10,
            paddingTop: 20,
            paddingBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            borderBottomColor: "#1F5A9E95",
            borderBottomWidth: 1,
          }}
        >
          <Avatar
            rounded
            size={64}
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
            fontSize: 18,
            color: "black",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Relatório de Clientes
        </Text>

        <View
          style={{
            marginTop: 12,
            alignItems: "center",
            marginBottom: 80,
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
                  Clientes cadastrados
                </Text>
              </View>
              <Text
                style={{ color: "white", fontSize: 22, fontWeight: "bold" }}
              >
                {dadosClientes?.quantidadeClientes}
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
                  Clientes ativos
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
                    {dadosClientes?.quantidadeClientesAtivos}
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
                  fontSize: 16,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                Clientes inativos
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
                  {dadosClientes?.quantidadeInativos}
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
                  value: dadosClientes?.porcentagemAtivos
                    ? dadosClientes?.porcentagemAtivos
                    : 0,
                  color: "#1F5A9E",
                },
                {
                  value: dadosClientes?.porcentagemAtivos
                    ? 100 - dadosClientes?.porcentagemAtivos
                    : 100,
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
                        fontSize: 22,
                        color: "#1F5A9E",
                        fontWeight: "bold",
                      }}
                    >
                      {dadosClientes?.porcentagemAtivos
                        ? dadosClientes?.porcentagemAtivos
                        : 0}
                      %
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#1F5A9E",
                        fontWeight: "bold",
                      }}
                    >
                      Clientes
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#1F5A9E",
                        fontWeight: "bold",
                      }}
                    >
                      Ativos
                    </Text>
                  </View>
                );
              }}
            />
            <PieChart
              data={[
                {
                  value: dadosClientes?.porcentagemInativos
                    ? dadosClientes?.porcentagemInativos
                    : 0,
                  color: "#3685e0",
                },
                {
                  value: dadosClientes?.porcentagemInativos
                    ? 100 - dadosClientes?.porcentagemInativos
                    : 100,
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
                        fontSize: 22,
                        color: "#3685e0",
                        fontWeight: "bold",
                      }}
                    >
                      {dadosClientes?.porcentagemInativos
                        ? dadosClientes?.porcentagemInativos
                        : 0}
                      %
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#3685e0",
                        fontWeight: "bold",
                      }}
                    >
                      Clientes
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#3685e0",
                        fontWeight: "bold",
                      }}
                    >
                      Inativos
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
