import { View } from "react-native";
import { styles } from "./CadastrarPontosStyle";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { Text } from "react-native-elements";
import Form from "../../components/form/Form";

export default function CadastrarPontos({ navigation }) {
  return (
    <View>
      <Header title={"Fidelize PE"} icon={true} onPress={() => navigation.goBack()} />
      <Text style={{ paddingLeft: 16, fontSize: 24, fontWeight: "700", height: 32 }}>Cadastro de pontos</Text>
      <View
        style={[
          styles.mainContainer,
          {
            height: "84%",
            bottom: 56,
          },
        ]}
      >
        <Form>
          <Input title={"CPF do Cliente"} />
          <Input title={"Produto"} />
          <Input keyboardType="numeric" title={"Pontos"} />
          <Button
            backgroundColor={"#005098"}
            width={"90%"}
            textColor={"#FFFFFF"}
            padding={16}
            fontSize={16}
            borderRadius={32}
            fontWeight={"bold"}
            onPress={() => navigation.navigate("cadastrarPontosConfirmar")}
            label="Próximo"
          />
        </Form>
      </View>
      <Nav />
    </View>
  );
}
