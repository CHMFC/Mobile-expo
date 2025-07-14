import React, { useState } from "react";
import { View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../../components/input/Input";
import { Header } from "../../components/header/Header";
import { SafeAreaView } from "react-native";
import { Nav } from "../../components/nav/Nav";
import { Form } from "../../components/form/Form";
import { Button } from "../../components/button/Button";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { StatusBar } from "react-native";

export function CadastroRegulamento({ navigation, route }) {
  const infoLoja = route.params;
  const [regulamentoError, setRegulamentoError] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      regulamento: "",
    },
  });

  const onSubmit = (data) => {
    if (!data.regulamento) {
      setRegulamentoError(true);
    }

    navigation.navigate("cadastroDeLojaEndereco", {
      infoLoja: infoLoja,
      regulamento: data.regulamento,
    });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <Header
        title={"Endereço da Loja"}
        icon={true}
        onPress={() => navigation.goBack()}
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          paddingBottom: "25%",
        }}
      >
        <Form>
          <ScrollView contentContainerStyle={{ paddingBottom: '25%' }}>
            {errors?.regulamento && (
              <Text
                style={{
                  color: "red",
                  fontWeight: "bold",
                  maxWidth: "100%",
                }}
              >
                Regulamento não pode ser vazio
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  borderRadius={24}
                  title={"Regulamento"}
                  description={true}
                  onChangeText={onChange}
                  height={500}
                  value={value}
                  placeholder={
                    "Descreva para o cliente como funcionará a regra de pontos e tickets da sua loja"
                  }
                />
              )}
              name="regulamento"
            />

            {regulamentoError ? (
              <Button
                label={"Avançar"}
                backgroundColor={"#005098"}
                width={"100%"}
                textColor={"#FFFFFF"}
                padding={20}
                fontSize={16}
                borderRadius={50}
                fontWeight={"bold"}
                marginTop={16}
              />
            ) : (
              <Button
                onPress={handleSubmit(onSubmit)}
                label={"Avançar"}
                backgroundColor={"#005098"}
                width={"100%"}
                textColor={"#FFFFFF"}
                padding={20}
                fontSize={16}
                borderRadius={50}
                fontWeight={"bold"}
                marginTop={16}
              />
            )}
          </ScrollView>
        </Form>
      </View>
      <Nav />
    </SafeAreaView>
  );
}
