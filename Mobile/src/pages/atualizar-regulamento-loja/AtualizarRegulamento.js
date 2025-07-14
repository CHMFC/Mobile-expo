import React, { useState } from "react";
import { View, SafeAreaView, ScrollView, StatusBar } from "react-native";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import Form from "../../components/form/Form";
import Button from "../../components/button/Button";

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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        backgroundColor="#005098"
        barStyle="light-content"
      />
      <Header
        title={"Regulamento da Loja"}
        icon={true}
        onPress={() => navigation.goBack()}
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
          </Form>
        </View>
      </ScrollView>
      <Nav />
    </View>
  );
}
