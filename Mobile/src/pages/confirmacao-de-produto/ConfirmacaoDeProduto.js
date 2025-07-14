import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  Platform,
  Alert,
} from "react-native";
import { styles } from "./ConfirmacaoDeProdutoStyles";
import { Text } from "react-native-elements";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import usePersist from "../../hooks/usePersist";
import axios from "axios";
import FormData from "form-data";
import {  useState } from "react";
import { API_URL } from "../../const/apiUrl";

export default function ConfirmacaoDeProduto({ route, navigation }) {
  const {
    id,
    nome,
    imagem,
    resgate,
    descricao,
    recompensa,
    razaoSocial,
    tipoPonto,
    endereco,
    permitirResgate,
  } = route.params;
  const { tokenStored } = usePersist();

  const [isLoading, setIsLoading] = useState(false);

  const mostrarMensagem = (mensagem) => {
    showMessage({
      message: "Sucesso",
      description: mensagem,
      type: "success",
    });
    
  };

  

  const criarProduto = async () => {
    setIsLoading(true);

    const data = new FormData();
    data.append("nome", nome);
    data.append("descricao", descricao);
    data.append("permiteResgate", permitirResgate);
    data.append("pontosConsumacao", recompensa ? recompensa : 0);
    data.append("pontosResgate", resgate ? resgate : 0);
    data.append("tiposPontos", tipoPonto);
    data.append("lojaId", id);
    data.append(
      "imagem",
      imagem
        ? {
          name: imagem.fileName,
          type: imagem.type,
          uri:
            Platform.OS === "android"
              ? imagem.uri
              : imagem.uri.replace("file://", ""),
        }
        : "null"
    );
    await axios
      .post(`${API_URL.base}/produtos/`, data, {
        headers: {
          Authorization: `Bearer ${tokenStored}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        mostrarMensagem("Produto criado!");

        setTimeout(() => {
          setIsLoading(false);
        }, 1200);

        setTimeout(
          () =>
            navigation.navigate("OpcoesLoja", { id: id }),
          1500
        );
      })
      .catch((error) => {
        setIsLoading(false);

        Alert.alert("Erro", "Falha ao criar produto");
      });
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{flex: 1, backgroundColor: "white"}}>
      <Header
        title={"FIDELIZE PE"}
        icon={true}
        onPress={() => navigation.goBack()}
      />
      <View>
      <FlashMessage
        textStyle={{
          fontSize: 16,
          textAlign: "center",
          flexWrap: "wrap",
          alignSelf: "center",
        }}
        titleStyle={{
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          flexWrap: "wrap",
          alignSelf: "center",
        }}
        style={{
          minHeight: 80,
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
        duration={1500}
      />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.text}>
        <Text style={styles.textH3}>Confirmar Informações</Text>
      </View>
        <View style={styles.details}>
          <View style={styles.textContainer}>
            <Text style={styles.textTitulo}>Nome do produto</Text>
            <Text style={styles.textInfoUsuario}>{nome}</Text>
            {recompensa && (
              <>
                <Text style={styles.textTitulo}>Recompensa</Text>
                <Text style={styles.textInfoUsuario}>
                  {recompensa ? recompensa : 0}{" "}
                  {tipoPonto === "produto" ? "tickets" : "pontos"}
                </Text>
              </>
            )}

            {resgate && (
              <>
                <Text style={styles.textTitulo}>Resgate</Text>
                <Text style={styles.textInfoUsuario}>
                  {resgate ? resgate : 0}{" "}
                  {tipoPonto === "produto" ? "tickets" : "pontos"}
                </Text>
              </>
            )}
            {descricao && (
              <>
                <Text style={styles.textTitulo}>Descrição</Text>
                <Text style={styles.textInfoUsuario}>{descricao}</Text>
              </>
            )}
            {imagem && (
              <>
                <Text style={styles.textImage}>Imagem escolhida</Text>
                <View>
                  <Image style={styles.image} source={{ uri: imagem.uri }} />
                </View>
              </>
            )}
          </View>
        </View>

        {!isLoading ? (
          <Button
            label={"Finalizar"}
            backgroundColor={"#005098"}
            borderRadius={25}
            onPress={criarProduto}
            fontSize={14}
            fontWeight="bold"
            textColor={"white"}
            width={250}
            padding={18}
            marginTop={12}
            marginBottom={12}
          />
        ) : (
          <Button
            label={"Carregando..."}
            backgroundColor={"#005098"}
            borderRadius={25}
            fontSize={14}
            fontWeight="bold"
            textColor={"white"}
            width={250}
            padding={18}
            marginTop={12}
            marginBottom={12}
          />
        )}
        <Button
          label={"Cancelar"}
          borderRadius={25}
          backgroundColor={"#DCDCDC"}
          onPress={() => navigation.goBack()}
          fontSize={14}
          fontWeight="bold"
          textColor={"black"}
          width={250}
          padding={18}
        />
      </ScrollView>
      </View>
      <Nav />
    </SafeAreaView>
  );
}
