import { View, SafeAreaView } from "react-native";
import { styles } from "./CadastrarPontosStyle";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { Text } from "react-native-elements";
import Form from "../../components/form/Form";

export default function CadastrarPontosConfirmar({ navigation }) {
  return (
    <SafeAreaView>
      <Header title={"Fidelize PE"} icon={true} onPress={() => navigation.goBack()} />
      <Text style={{ paddingLeft: 16, fontSize: 24, fontWeight: "700", height: 32 }}>Cadastro de pontos</Text>
      <View
        style={[
          styles.mainContainer,
          {
            height: "84%",
            bottom: 32,
          },
        ]}
      >
        <Form>
          <View style={styles.divDados}>
            <Text
              style={{
                paddingLeft: 16,
                marginTop: 10,
                fontSize: 24,
                height: 32,
              }}
            >
              CPF do cliente
            </Text>
            <Text
              style={{
                paddingLeft: 16,
                marginBottom: 10,
                fontSize: 24,
                fontWeight: "700",
                height: 32,
              }}
            >
              123.456.789-10
            </Text>
            <Text style={{ paddingLeft: 16, fontSize: 24, height: 32 }}>Produto</Text>
            <Text
              style={{
                paddingLeft: 16,
                marginBottom: 10,
                fontSize: 24,
                fontWeight: "700",
                height: 32,
              }}
            >
              Café Expresso
            </Text>
            <Text style={{ paddingLeft: 16, fontSize: 24, height: 32 }}>Pontos</Text>
            <Text
              style={{
                paddingLeft: 16,
                fontSize: 24,
                fontWeight: "700",
                height: 32,
              }}
            >
              5 Pontos
            </Text>
          </View>
          <Button
            backgroundColor={"#005098"}
            width={"90%"}
            textColor={"#FFFFFF"}
            padding={16}
            fontSize={16}
            borderRadius={32}
            fontWeight={"bold"}
            onPress={() => navigation.navigate("cadastrarPontosSucesso")}
            label="Confirmar"
          />
          <Button
            backgroundColor={"#D5D5D5"}
            width={"90%"}
            textColor={"#FFFFFF"}
            padding={16}
            fontSize={16}
            borderRadius={32}
            marginTop={16}
            fontWeight={"bold"}
            onPress={() => navigation.navigate("cadastrarPontos")}
            label="Cancelar"
          />
        </Form>
      </View>
      <Nav />
    </SafeAreaView>
  );
}
