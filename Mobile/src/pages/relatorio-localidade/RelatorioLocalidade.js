import React, { useState, useEffect } from "react";

import { Header } from "../../components/header/Header";
import { Nav } from "../../components/nav/Nav";

import { SafeAreaView, View, Text, ScrollView, StatusBar } from "react-native";
import usePersist from "../../hooks/usePersist";

import axios from "axios";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Data } from "../../components/datas/Data";
import { API_URL } from "../../const/apiUrl";

export function RelatorioLocalidade({ navigation, route }) {
  const { lojaId } = route.params;

  const [dataFinalVisivel, setDataFinalVisivel] = useState(false);
  const [dataInicioVisivel, setDataInicioVisivel] = useState(false);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());

  const [dadosClientes, setDadosClientes] = useState([]);
  const [tokenCelular, setTokenCelular] = useState([]);

  const dataInicioTratada = `${dataInicio.getFullYear()}-${String(
    dataInicio.getMonth() + 1
  ).padStart(2, "0")}-${dataInicio.getDate().toString().padStart(2, "0")}`;

  const dataFinalTratada = `${dataFinal.getFullYear()}-${String(
    dataFinal.getMonth() + 1
  ).padStart(2, "0")}-${dataFinal.getDate().toString().padStart(2, "0")}`;

  const { tokenStored } = usePersist();

  useEffect(() => {
    async function pegarClientes() {
      await axios
        .get(
          `${API_URL.base}/lojas/${lojaId}/clientes/localizacao`,
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

          if (tokenCelular.length === 0) {
            res.data.forEach((item) =>
              setTokenCelular(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }
        })
        .catch((err) => {
          return null;
        } );
    }
    pegarClientes();
  }, [dataInicio, dataFinal]);

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
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <Header icon={true} onPress={() => navigation.goBack()} />

      <ScrollView>
        <View
          style={{
            alignItems: "center",
            marginVertical: 12,
          }}
        >
          <View style={{ flexDirection: "row", marginHorizontal: 12 }}>
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
          </View>

          <View style={{ width: "100%", marginTop: 20, paddingLeft: "5%" }}>
            {dadosClientes.map((cidade, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: "95%",
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      width: "100%",
                      fontSize: 18,
                      color: "#272727",
                      fontWeight: "bold",
                    }}
                  >
                    {cidade.nome}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#272727",
                    }}
                  >
                    {cidade.quantidadeClientes}{" "}
                    {cidade.quantidadeClientes == 1 ? "Cliente" : "Clientes"}
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: "lightgrey",
                      marginBottom: 4,
                      marginTop: 2,
                      borderRadius: 8,
                    }}
                  >
                    <View
                      style={{
                        width: `${(100 * cidade.porcentagemCidade) / 100}%`,
                        height: 25,
                        backgroundColor: `${cidade.nome == "Não Informado" ? "#EA3636" : "#1F5A9E"
                          }`,
                        justifyContent: "center",
                        alignItems: "flex-end",
                        paddingRight: 5,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        {cidade.porcentagemCidade}%
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Nav />
    </SafeAreaView>
  );
}
