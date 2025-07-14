import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Text, ScrollView } from "react-native";
import { Header } from "../../components/header/Header";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { Nav } from "../../components/nav/Nav";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import { Picker } from "@react-native-picker/picker";
import { Overlay } from "react-native-elements";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Controller, useForm } from "react-hook-form";
import { PieChart } from "react-native-gifted-charts";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Data } from "../../components/datas/Data";
import { API_URL } from "../../const/apiUrl";

export function RelatorioInatividade({ navigation, route }) {
  const { lojaId } = route.params;
  const { tokenStored } = usePersist();

  const [dadosClientes, setDadosClientes] = useState([]);
  const [tokenCelular, setTokenCelular] = useState([]);
  const [visible, setVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [dataFinalVisivel, setDataFinalVisivel] = useState(false);
  const [dataInicioVisivel, setDataInicioVisivel] = useState(false);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
              dataInicio: dataInicioTratada,
              dataFim: dataFinalTratada,
            },
          }
        )
        .then((res) => {
          setDadosClientes(res?.data);

          setTokenCelular([]);
          res.data.clientesInativos.forEach((item) =>
            setTokenCelular(
              (prevToken) => new Set([...prevToken, item?.tokenCelular])
            )
          );
        })
        .catch((err) => {
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    pegarClientes();
  }, [dataInicio, dataFinal, isLoading]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const ResgateNotification = async (data) => {
    await axios
      .post(`${API_URL.base}/pushnotification`, {
        tokenCelular: [...tokenCelular],
        title: data.titleMessage,
        body: data.bodyMessage,
      })
      .then(() => {
        mostrarMensagem("Sucesso!", "Mensagem enviada!", "success");
        toggleOverlay();
      })
      .catch((error) => {
        mostrarMensagem("Falha!", "Falha ao enviar mensagem!", "danger");
        toggleOverlay();
      });
  };

  const mostrarMensagem = (title, mensagem, type) => {
    showMessage({
      message: title,
      description: mensagem,
      type: type,
      style: { height: "100%" },
      titleStyle: {
        fontWeight: "bold",
        fontSize: 20,
        justifyContent: "center",
        marginTop: "auto",
        alignSelf: "center",
        textAlign: "center",
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Header icon={true} onPress={() => navigation.goBack()} />
      <FlashMessage
        textStyle={{
          fontSize: 20,
          justifyContent: "center",
          alignSelf: "center",
          marginTop: "auto",
          textAlign: "center",
        }}
        duration={2000}
      />
      <ScrollView>
        <View
          style={{
            alignItems: "center",
            marginVertical: 12,
            marginBottom: 80,
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
          <View
            style={{
              width: "90%",
              backgroundColor: "#1F5A9E",
              padding: 20,
              borderRadius: 16,
              marginBottom: 12,
              height: 100,
              marginTop: 12,
            }}
          >
            <View style={{ flexDirection: "column", paddingHorizontal: 16 }}>
              <Text style={{ color: "white", fontSize: 16, marginBottom: 4 }}>
                Clientes cadastrados
              </Text>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>
                {dadosClientes?.quantidadeClientes}
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
                Clientes inativos
              </Text>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>
                {dadosClientes?.quantidadeInativos}
              </Text>
            </View>
          </View>
          <Button
            width={"90%"}
            label={"Enviar mensagem"}
            backgroundColor={"#005098"}
            borderRadius={8}
            fontSize={18}
            textColor={"white"}
            padding={8}
            onPress={toggleOverlay}
          />
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
                  value: dadosClientes?.porcentagemInativos
                    ? dadosClientes?.porcentagemInativos
                    : 0,
                  color: "#1F5A9E",
                },
                {
                  value: dadosClientes?.porcentagemInativos
                    ? 100 - dadosClientes?.porcentagemInativos
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
                      {dadosClientes?.porcentagemInativos
                        ? dadosClientes?.porcentagemInativos
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
                      Inativos
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View style={{ width: "90%", alignItems: "center" }}>
          <Text
            style={{
              color: "black",
              marginHorizontal: 8,
              fontWeight: "600",
              fontSize: 20,
              marginBottom: 12,
            }}
          >
            Mensagem para clientes inativos
          </Text>

          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                borderRadius={25}
                title={"Titulo"}
                onChangeText={onChange}
                value={value}
                placeholder={"Insira o titulo da mensagem"}
              />
            )}
            name="titleMessage"
          />
          {errors.titleMessage && (
            <Text style={{ color: "red", marginBottom: 8 }}>
              Campo obrigatório.
            </Text>
          )}

          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                borderRadius={25}
                title={"Mensagem"}
                description={true}
                onChangeText={onChange}
                value={value}
                placeholder={"Insira a mensagem que será enviada"}
              />
            )}
            name="bodyMessage"
          />
          {errors.bodyMessage && (
            <Text style={{ color: "red", marginBottom: 8 }}>
              Campo obrigatório.
            </Text>
          )}

          <Button
            width={"100%"}
            label={"Enviar mensagem"}
            backgroundColor={"#005098"}
            borderRadius={8}
            fontSize={18}
            textColor={"white"}
            padding={8}
            onPress={handleSubmit(ResgateNotification)}
          />
        </View>
      </Overlay>
      <Nav />
    </SafeAreaView>
  );
}
