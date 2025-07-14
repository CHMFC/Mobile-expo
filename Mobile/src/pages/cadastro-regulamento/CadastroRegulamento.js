import React, { useState } from "react";
import { View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import { SafeAreaView } from "react-native";
import Nav from "../../components/nav/Nav";
import Form from "../../components/form/Form";
import Button from "../../components/button/Button";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { StatusBar } from "react-native";

export function CadastroRegulamento({ navigation, route }) {
  // Extract the parameters from route.params
  const { data, categoria, ativa, imagem, comprovante } = route.params || {};
  
  const [regulamentoError, setRegulamentoError] = useState(false);
  const [comprovanteError, setComprovanteError] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      regulamento: "",
    },
  });

  const onSubmit = (formData) => {
    // Check if regulamento is empty
    if (!formData.regulamento) {
      setRegulamentoError(true);
      return;
    }
    
    // Check if comprovante is missing
    if (!comprovante) {
      setComprovanteError(true);
      return;
    }

    // Pass all the parameters to the next screen
    navigation.navigate("cadastroDeLojaEndereco", {
      ...data,
      categoria,
      ativa,
      imagem,
      comprovante,
      regulamento: formData.regulamento,
    });
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        backgroundColor="#005098"
        barStyle="light-content"
      />
      <Header
        title={"Regulamento da Loja"}
        icon={true}
        onPress={() => navigation.goBack()}
        iconNotifications={false}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: 24,
          paddingTop: 24
        }}
      >
        <View style={{ 
          flex: 1,
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 16
        }}>
          <Form>
            {errors?.regulamento && (
              <Text
                style={{
                  color: "red",
                  fontWeight: "bold",
                  maxWidth: "100%",
                  marginBottom: 8,
                  alignSelf: 'flex-start'
                }}
              >
                Regulamento não pode ser vazio
              </Text>
            )}
            
            {comprovanteError && (
              <Text
                style={{
                  color: "red",
                  fontWeight: "bold",
                  maxWidth: "100%",
                  marginBottom: 10,
                  alignSelf: 'flex-start'
                }}
              >
                Comprovante é obrigatório. Por favor, volte e adicione um comprovante.
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
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    borderRadius: 24,
                    padding: 16,
                    marginBottom: 16
                  }}
                />
              )}
              name="regulamento"
            />

            {regulamentoError || comprovanteError ? (
              <Button
                label={"Avançar"}
                backgroundColor={"#DCDCDC"}
                width={"100%"}
                textColor={"#FFFFFF"}
                padding={20}
                fontSize={16}
                borderRadius={50}
                fontWeight={"bold"}
                marginTop={16}
                disabled={true}
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
          </Form>
        </View>
      </ScrollView>
      <Nav />
    </View>
  );
}
