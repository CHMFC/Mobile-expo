import React, { useState, useEffect } from "react";

import { Header } from "../../components/header/Header";

import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import usePersist from "../../hooks/usePersist";
import { Image, Overlay, Avatar } from "react-native-elements";

import { Controller, useForm } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { PieChart } from "react-native-gifted-charts";

import { captureScreen } from "react-native-view-shot";
import { StatusBar } from "react-native";
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

export function RelatorioAniversariantesShare({ navigation, route }) {
  const { lojaId, mesAniverssario, lojaNome, lojaImagem } = route.params;

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
            params: { mes: mesAniverssario },
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

          setTimeout(() => {
            captureScreen({
              format: "jpg",
              quality: 1,
              filename: "relatorio-dos-aniversariantes",
              filenames: ["relatorio-dos-aniversariantes"],
            }).then(
              (uri) => {
                navigation.navigate("RelatorioAniversariantes", {
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
  }, [mes]);

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
            alignItems: "center",
            marginBottom: 80,
          }}
        >
          <Text
            style={{
              width: "90%",
              marginTop: 10,
              marginBottom: 20,
              fontSize: 20,
              color: "#1F5A9E",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Aniversariantes de {meses[`${mesAniverssario}`]}
          </Text>
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
    </SafeAreaView>
  );
}
