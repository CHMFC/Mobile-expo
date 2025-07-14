import React, { useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import { Input } from "../../components/input/Input";
import { Header } from "../../components/header/Header";
import { Nav } from "../../components/nav/Nav";
import { Form } from "../../components/form/Form";
import { Button } from "../../components/button/Button";
import { StatusBar } from "react-native";

export function AtualizarRegulamento({ navigation, route }) {
  const {
    id,
    razaoSocial,
    nomeFantasia,
    cnpj,
    cpf,
    inscricaoEstadual,
    nomeResponsavel,
    numeroContato,
    categoria,
    ativa,
    pontos,
    expiracaoPontosConsumo,
    expiracaoPontosProduto,
    imagem,
    imagemAtual,
    comprovanteAtual,
    infoLoja,
  } = route.params;

  const [regulamento, setRegulamento] = useState(infoLoja?.regulamento);

  const onSubmit = () => {
    navigation.navigate("atualizarDadosLojaEndereco", {
      id: id,
      razaoSocial: razaoSocial,
      nomeFantasia: nomeFantasia,
      cnpj: cnpj,
      cpf: cpf,
      inscricaoEstadual: inscricaoEstadual,
      nomeResponsavel: nomeResponsavel,
      numeroContato: numeroContato,
      categoria: categoria,
      ativa: ativa,
      pontos: pontos,
      expiracaoPontosConsumo: expiracaoPontosConsumo,
      expiracaoPontosProduto: expiracaoPontosProduto,
      imagem: imagem,
      imagemAtual: imagemAtual,
      comprovanteAtual: comprovanteAtual,
      regulamento: regulamento,
      infoLoja: infoLoja,
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
          <ScrollView contentContainerStyle={{paddingBottom: '25%'}}>
            <Input
              borderRadius={24}
              title={"Regulamento"}
              description={true}
              onChangeText={(txt) => setRegulamento(txt)}
              height={500}
              value={regulamento}
              placeholder={""}
            />

            <Button
              onPress={() => onSubmit()}
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
          </ScrollView>
        </Form>
      </View>
      <Nav />
    </SafeAreaView>
  );
}
