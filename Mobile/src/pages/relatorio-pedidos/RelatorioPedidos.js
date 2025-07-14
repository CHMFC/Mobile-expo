import React, { useState, useEffect, useCallback } from "react";

import usePersist from "../../hooks/usePersist";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  Text,
  SafeAreaView,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";

import Header from "../../components/header/Header";
import { Data } from "../../components/datas/Data";
import Nav from "../../components/nav/Nav";

import axios from "axios";
import { HistoricoCard } from "../../components/historicoCard/HistoricoCard";
import { SkelletonItens } from "../../const/skelletonItens";
import { Skelleton } from "../../components/skelleton/Skelleton";
import { StatusBar } from "react-native";
import { API_URL } from "../../const/apiUrl";

export default function RelatorioPedidos({ navigation, route }) {
  const { lojaId, consumo } = route.params;

  const { tokenStored } = usePersist();

  const [isLoading, setIsLoading] = useState(true);
  const [dataFinalVisivel, setDataFinalVisivel] = useState(false);
  const [dataInicioVisivel, setDataInicioVisivel] = useState(false);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [dataFinal, setDataFinal] = useState(new Date());
  const [getData, setData] = useState([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
    async function resgatarExtrato() {
      await axios
        .get(
          `${API_URL.base}/lojas/${lojaId}/extrato/${consumo ? "consumo" : "resgate"
          }`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
            params: {
              dataInicio: dataInicioTratada,
              dataFim: dataFinalTratada,
            },
          }
        )
        .then((response) => {
          setData(response?.data?.pedidos);
        })
        .catch((err) => {
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    resgatarExtrato();
  }, [dataInicio, dataFinal, refreshing]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#005098",
        flex: 1,
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header icon={true} onPress={() => navigation.goBack()} />

        <Text
          style={{
            color: "black",
            fontWeight: "bold",
            paddingVertical: 12,
            paddingHorizontal: 24,
            fontSize: 16,
          }}
        >
          {consumo ? "Recompensas" : "Resgates"}
        </Text>

        <View style={{ flexDirection: "row" }}>
          <Data
            data={`${dataInicio.getDate().toString().padStart(2, "0")}/${String(
              dataInicio.getMonth() + 1
            ).padStart(2, "0")}/${dataInicio.getFullYear()}`}
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
            data={`${dataFinal.getDate().toString().padStart(2, "0")}/${String(
              dataFinal.getMonth() + 1
            ).padStart(2, "0")}/${dataFinal.getFullYear()}`}
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
        <View style={{ paddingBottom: "16%" }}>
          {isLoading ? (
            <SafeAreaView
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              {SkelletonItens.map((item, index) => (
                <Skelleton
                  key={index}
                  width={"90%"}
                  marginBottom={12}
                  round={16}
                  height={72}
                />
              ))}
            </SafeAreaView>
          ) : (
            <View>
              {getData?.map((item, key) => (
                <HistoricoCard item={item} key={key} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      </View>
      <Nav />
    </SafeAreaView>
  );
}
