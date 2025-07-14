import { ScrollView, View, SafeAreaView, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import { Text } from "@rneui/base";
import { styles } from "./ticketMedioDiarioStyle";
import Form from "../../components/form/Form";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import usePersist from "../../hooks/usePersist";
import axios from "axios";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { API_URL } from "../../const/apiUrl";

export default function TicketMedioDiario({ route, navigation }) {
  const { id } = route.params;
  const [getData, setData] = useState();
  const [inputCurvaA, setInputCurvaA] = useState();
  const [inputCurvaB, setInputCurvaB] = useState();
  const [inputCurvaC, setInputCurvaC] = useState();
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { tokenStored } = usePersist();

  async function salvar() {
    const formData = new FormData();

    const dadosAPI = {
      curvaA: inputCurvaA,
      curvaB: inputCurvaB,
      curvaC: inputCurvaC,
    };

    Object.entries(dadosAPI).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await axios
      .put(
        `${API_URL.base}/lojas/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${tokenStored}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        mostrarMensagem("Loja atualizada\nRedirecionando...");
        setTimeout(() => navigation.navigate("OpcoesLoja", { id: id }), 1500);
      })
      .catch((error) => {
        const errResponse =
          (error && error.response && error.response.data) ||
          (error && error.message);
      });
  }

  const mostrarMensagem = (mensagem) => {
    showMessage({
      message: "Sucesso",
      description: mensagem,
      type: "success",
      style: { height: "100%" },
      titleStyle: {
        fontWeight: "bold",
        fontSize: 20,
        justifyContent: "center",
        marginTop: "auto",
        alignSelf: "center",
      },
    });
  };

  useEffect(() => {
    const lojas = async () => {
      try {
        const response = await axios.get(
          `${API_URL.base}/lojas/${id}`,
          {
            headers: {
              Authorization: `Bearer ${tokenStored}`,
            },
          }
        );
        setInputCurvaA(response?.data.curvaA);
        setInputCurvaB(response?.data.curvaB);
        setInputCurvaC(response?.data.curvaC);
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    lojas();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#005098"}}
    >
      <Header
          title={"FIDELIZE PE"}
          icon={true}
          onPress={() => navigation.goBack()}
        />
      <ScrollView
        style={[
          { backgroundColor: "white", paddingTop: StatusBar.currentHeight },
        ]}
      >
        
        <View>
          <FlashMessage
            textStyle={{
              fontSize: 20,
              justifyContent: "center",
              alignSelf: "center",
              marginTop: "auto",
              textAlign: "center",
            }}
            duration={1500}
          />
        </View>

        <Text style={styles.title}>Ticket médo diário</Text>
        <Text style={styles.title2}>
          Valor médio que o cliente consome por dia.
        </Text>
        <View style={styles.container}>
          <Form>
            <Text style={styles.title3}>Curva A</Text>
            <Input
              value={inputCurvaA}
              title={`Acima de ${inputCurvaA ? inputCurvaA : "valor da Curva A"
                }`}
              placeholder={`${inputCurvaA ? inputCurvaA : "Valor da Curva A"}`}
              onChange={(e) => {
                setInputCurvaA(e.nativeEvent.text)
                setInputCurvaB(0)
                setInputCurvaC(0)
              }}
              keyboardType={"numeric"}
            />

            <Text style={styles.title3}>Curva B</Text>
            <Input
              value={inputCurvaB}
              title={`Entre ${inputCurvaB ? inputCurvaB : "valor da Curva B"
                } a ${inputCurvaA ? inputCurvaA : "valor da Curva A"}`}
              placeholder={`${inputCurvaB ? inputCurvaB : "Valor da Curva B"}`}
              onChange={(e) => {
                setInputCurvaB(parseFloat(e.nativeEvent.text) <= inputCurvaA ? e.nativeEvent.text : (e.nativeEvent.text && inputCurvaA))
                setInputCurvaC(parseFloat(e.nativeEvent.text) <= inputCurvaA ? (parseFloat(e.nativeEvent.text) - 0.01 >= 0 ? parseFloat(e.nativeEvent.text) - 0.01 : 0) : (e.nativeEvent.text && inputCurvaA - 0.01))
              }}
              keyboardType={"numeric"}
            />

            <Text style={styles.title3}>Curva C</Text>
            <Input
              value={inputCurvaC}
              disabled
              title={`Até ${inputCurvaC ? inputCurvaC : "valor da Curva C"}`}
              placeholder={`${inputCurvaC ? inputCurvaC : "Valor da Curva C"}`}
              keyboardType={"numeric"}
            />

            <Button
              onPress={salvar}
              label={"Salvar"}
              backgroundColor={"#005098"}
              width={"90%"}
              textColor={"#FFFFFF"}
              padding={16}
              fontSize={16}
              borderRadius={32}
              fontWeight={"bold"}
            />
          </Form>
        </View>
      </ScrollView>
      <Nav />
    </SafeAreaView>
  );
}
