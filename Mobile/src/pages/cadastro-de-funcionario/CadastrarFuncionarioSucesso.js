import { View, SafeAreaView } from "react-native";
import Button from "../../components/button/Button";
import { Icon, Text } from "react-native-elements";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";

export default function CadastrarFuncionarioSucesso({ navigation }) {
  return (
    <SafeAreaView>
      <Header icon={false} title={"FIDELIZE PE"} />

      <View
        style={{
          width: "100%",
          height: "86%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          bottom: 64,
        }}
      >
        <Icon name="checkmark-circle-outline" type="ionicon" color="#005098" size={96} />
        <Text style={{ color: "#005098", fontSize: 22, marginTop: 12, marginBottom: 12 }}>
          Funcionário cadastrado com sucesso!
        </Text>
        <Button
          label={"Voltar ao menu"}
          onPress={() => navigation.navigate("Login")}
          backgroundColor={"#005098"}
          width={"90%"}
          textColor={"#FFFFFF"}
          padding={16}
          fontSize={16}
          borderRadius={32}
          fontWeight={"bold"}
        />
      </View>
      <Nav />
    </SafeAreaView>
  );
}
