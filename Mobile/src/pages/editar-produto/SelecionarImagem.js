import { SafeAreaView, View } from "react-native";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";

export default function SelecionarImagem({ navigation }) {
  return (
    <SafeAreaView>
      <Header title={"FIDELIZE PE"} icon={true} />
      <View>
        <Button
          label={"Escolher imagem"}
          backgroundColor={"#005098"}
          width={"90%"}
          textColor={"#FFFFFF"}
          padding={16}
          fontSize={16}
          borderRadius={32}
          fontWeight={"bold"}
        />
        <Button
          label={"Confirmar"}
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
