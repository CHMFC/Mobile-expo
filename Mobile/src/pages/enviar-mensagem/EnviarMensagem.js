import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";

import { Header } from "../../components/header/Header";
import { Nav } from "../../components/nav/Nav";
import { Button } from "../../components/button/Button";
import { Input } from "../../components/input/Input";

import axios from "axios";

import { Controller, useForm } from "react-hook-form";

import FlashMessage, { showMessage } from "react-native-flash-message";

import usePersist from "../../hooks/usePersist";
import { StatusBar } from 'react-native';
import { API_URL } from "../../const/apiUrl";

export function EnviarMensagem({ route, navigation }) {
  const { lojaId, tokenCelular } = route.params;
  const { tokenStored } = usePersist();

  const tokeCelularList = [...tokenCelular]
  const ResgateNotification = async (data) => {
    await axios
      .post(`${API_URL.base}/pushnotification`, {
        tokenCelular: tokeCelularList,
        title: data.titleMessage,
        body: data.bodyMessage,
      })
      .then((result) => {
        axios.put(`${API_URL.base}/lojas/${lojaId}/mensagens`,
          {},
          {
            headers: {
              Authorization: `Bearer ${tokenStored}`,
            },
          })
          .then()
          .catch(err => {
            return null;
          })
          .finally(() => {
            mostrarMensagem("Sucesso!", "Mensagem enviada!", "success");
          })
      })
      .catch((error) => {
        mostrarMensagem("Falha!", "Falha ao enviar mensagem!", "danger");
        return null;
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
        paddingTop: StatusBar.currentHeight
      },
    });
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", paddingTop: StatusBar.currentHeight }}>
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
      <View
        style={{
          width: "90%",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <View>
          <Text
            style={{
              color: "black",
              marginHorizontal: 8,
              fontWeight: "600",
              fontSize: 18,
              marginBottom: 12,
              width: "100%",
            }}
          >
            Mensagem para clientes selecionados
          </Text>
        </View>

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
      <Nav />
    </SafeAreaView>
  );
}
