import React, { useState, useEffect } from "react";

import { Header } from "../../components/header/Header";
import { Nav } from "../../components/nav/Nav";
import { Button } from "../../components/button/Button";
import { Input } from "../../components/input/Input";

import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import usePersist from "../../hooks/usePersist";
import { Image, Overlay, Icon } from "react-native-elements";

import { Controller, useForm } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { PieChart } from "react-native-gifted-charts";

import Share from "react-native-share";
import { API_URL } from "../../const/apiUrl";

const meses = {
  "01": "Janeiro",
  "02": "Fevereiro",
  "03": "Março",
  "04": "Abril",
  "05": "Maio",
  "06": "Junho",
  "07": "Julho",
  "08": "Agosto",
  "09": "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
};

export function RelatorioAniversariantes({ navigation, route }) {
  const { lojaId, printUrl, lojaNome, lojaImagem, mensagensQuantidade } = route.params;
  const [compartilhar, setCompartilhar] = useState(false);

  if (printUrl && compartilhar) {
    setCompartilhar(false);

    Share.open({
      title: "Compartilhar via",
      message: "Relatório de Clientes Aniversariantes",
      url: printUrl,
      filename: "relatorio-dos-aniversariantes",
      filenames: ["relatorio-dos-aniversariantes"],
    })
      .then((res) => {
      })
      .catch((err) => {
        if (err && `${err}` != "Error: User did not share") return null;
      });
  }

  const mesAtual = new Date().getMonth() + 1;
  const mesString = mesAtual.toString().padStart(2, "0");
  const [dadosClientes, setDadosClientes] = useState([]);
  const [tokenCelular, setTokenCelular] = useState([]);
  const [visible, setVisible] = useState(false);
  const [mes, setMes] = useState(mesString);

  const { tokenStored } = usePersist();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    async function pegarClientes() {
      await axios
        .get(
          `${API_URL.base}/lojas/${lojaId}/clientes/aniversariantes`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
            params: { mes: mes },
          }
        )
        .then((res) => {
          setDadosClientes(res?.data);

          setTokenCelular([]);
          res.data.aniversariantes.forEach((item) =>
            setTokenCelular(
              (prevToken) => new Set([...prevToken, item?.tokenCelular])
            )
          );
        })
        .catch((err) => {
          return null;
        });
    }

    pegarClientes();
  }, [mes]);

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
            marginBottom: 80,
          }}
        >
          <View
            style={{
              width: "100%",
              marginLeft: "5%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                paddingHorizontal: 12,
                width: "100%",
                marginBottom: 16,
              }}
            >
              <Picker
                style={{ color: "#1F5A9E", width: "75%" }}
                selectedValue={mes}
                dropdownIconColor={"#1F5A9E"}
                onValueChange={(itemValue) => setMes(itemValue)}
              >
                <Picker.Item label="Janeiro" value={"01"} />
                <Picker.Item label="Fevereiro" value={"02"} />
                <Picker.Item label="Março" value={"03"} />
                <Picker.Item label="Abril" value={"04"} />
                <Picker.Item label="Maio" value={"05"} />
                <Picker.Item label="Junho" value={"06"} />
                <Picker.Item label="Julho" value={"07"} />
                <Picker.Item label="Agosto" value={"08"} />
                <Picker.Item label="Setembro" value={"09"} />
                <Picker.Item label="Outubro" value={"10"} />
                <Picker.Item label="Novembro" value={"11"} />
                <Picker.Item label="Dezembro" value={"12"} />
              </Picker>
              <View
                style={{
                  width: "75%",
                  backgroundColor: "#1F5A9E",
                  padding: 0.3,
                }}
              />
            </View>

            <View
              style={{
                backgroundColor: "#1F5A9E",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: -75,
                padding: 8,
                borderRadius: 32,
                height: 42,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("RelatorioAniversariantesShare", {
                    lojaId: lojaId,
                    mesAniverssario: mes,
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
              <Text style={{ color: "white", fontSize: 16, marginBottom: 4 }}>
                Clientes cadastrados
              </Text>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>
                {dadosClientes?.clientes}
              </Text>
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
              <Text style={{ color: "white", fontSize: 16, marginBottom: 4 }}>
                Aniversariantes
              </Text>
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "600",
                    width: "90%",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {dadosClientes?.quantidadeAniversariantes}
                </Text>
                {mensagensQuantidade > 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EnviarMensagem", {
                        lojaId: lojaId,
                        tokenCelular: tokenCelular,
                      })
                    }
                  >
                    <Image
                      source={require("../../assets/cards/mensagem.png")}
                      style={{
                        width: 28,
                        height: 28,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              height: 260,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 20,
              paddingLeft: 20,
            }}
          >
            <PieChart
              data={[
                {
                  value: dadosClientes.porcentagenAniversariantes
                    ? dadosClientes.porcentagenAniversariantes
                    : 0,
                  color: "#1F5A9E",
                },
                {
                  value: dadosClientes.porcentagenAniversariantes
                    ? 100 - dadosClientes.porcentagenAniversariantes
                    : 100,
                  color: "lightgrey",
                },
              ]}
              donut
              radius={100}
              innerRadius={70}
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
                      {dadosClientes.porcentagenAniversariantes
                        ? dadosClientes.porcentagenAniversariantes
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
                      Aniversariantes
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#1F5A9E",
                        fontWeight: "bold",
                      }}
                    >
                      {meses[mes]}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>

      <Nav />
    </SafeAreaView>
  );
}
