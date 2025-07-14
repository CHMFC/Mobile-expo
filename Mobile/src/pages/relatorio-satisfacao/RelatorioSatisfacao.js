import * as React from "react";
import { useState, useEffect } from "react";
import { View, SafeAreaView, Text, ScrollView, Dimensions } from "react-native";
import { Header } from "../../components/header/Header";
import { Nav } from "../../components/nav/Nav";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import { Icon, Image, Overlay } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { PieChart } from "react-native-gifted-charts";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Data } from "../../components/datas/Data";

import Share from "react-native-share";
import { StatusBar } from "react-native";
import { API_URL } from "../../const/apiUrl";

export function RelatorioSatisfacao({ navigation, route }) {
  const { lojaId, printUrl, lojaNome, lojaImagem } = route.params;
  const [compartilhar, setCompartilhar] = useState(false);

  if (printUrl && compartilhar) {
    setCompartilhar(false);

    Share.open({
      title: "Compartilhar via",
      message: "Relatório de Satisfação",
      url: printUrl,
      filename: "relatorio-de-satisfacao",
      filenames: ["relatorio-de-satisfacao"],
    })
      .then((res) => {
      })
      .catch((err) => {
        if (err && `${err}` != "Error: User did not share") return null;
      });
  }

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
          `${API_URL.base}/lojas/${lojaId}/pesquisaSatisfacao`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
            params: {
              dataInicio: dataInicioTratada,
              dataFim: dataFinalTratada,
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
  }, [dataInicio, dataFinal, isLoading]);

  const toggleOverlay = () => {
    setVisible(!visible);
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
              data={`${dataInicio
                .getDate()
                .toString()
                .padStart(2, "0")}/${String(dataInicio.getMonth() + 1).padStart(
                  2,
                  "0"
                )}/${dataInicio.getFullYear()}`}
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
              data={`${dataFinal
                .getDate()
                .toString()
                .padStart(2, "0")}/${String(dataFinal.getMonth() + 1).padStart(
                  2,
                  "0"
                )}/${dataFinal.getFullYear()}`}
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

            <View
              style={{
                backgroundColor: "#1F5A9E",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 30,
                padding: 8,
                borderRadius: 32,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("RelatorioSatisfacaoShare", {
                    lojaId: lojaId,
                    dataComeco: dataInicioTratada,
                    dataFim: dataFinalTratada,
                    lojaNome: lojaNome,
                    lojaImagem: lojaImagem,
                  });
                  setCompartilhar(true);
                }}
              >
                <Icon
                  name="share-social-outline"
                  color="white"
                  type="ionicon"
                  size={24}
                />
              </TouchableOpacity>
            </View>
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
                <TouchableOpacity onPress={toggleOverlay}>
                  <Icon
                    name="alert-circle"
                    color="white"
                    type="ionicon"
                    size={16}
                    style={{ marginHorizontal: 4, marginTop: 4 }}
                  />
                </TouchableOpacity>
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

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text style={{ fontSize: 18, fontWeight: "Regular", color: "black" }}>
          Pedidos validados nos últimos 1 ano e 6 meses.
        </Text>
      </Overlay>
      <Nav />
    </SafeAreaView>
  );
}
