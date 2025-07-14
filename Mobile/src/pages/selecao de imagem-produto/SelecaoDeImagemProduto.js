import { SafeAreaView, View, ScrollView, Image } from "react-native";
import { styles } from "./SelecaoDeImagemProdutoStyles";
import { Text } from "react-native-elements";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";

export default function SelecaoDeImagemProduto({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={"FIDELIZE PE"} icon={true} onPress={() => navigation.goBack()} />
      <View style={styles.textContainer}>
        <Text style={styles.textH3}>Cadastro de produtos</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image style={styles.image} source={require("../../assets/placeholder-image2.png")} />
          <Button
            label={"Escolher Imagem"}
            backgroundColor={"#DCDCDC"}
            borderRadius={20}
            onPress={() => navigation.navigate("ConfirmacaoDeProduto")}
            fontSize={14}
            fontWeight="bold"
            textColor={"black"}
            width={250}
            padding={15}
            marginTop={25}
            marginBottom={20}
            icon={"../../assets/upload-icon.png"}
          />
          <Button
            label={"Finalizar"}
            backgroundColor={"#005098"}
            borderRadius={20}
            onPress={() => navigation.navigate("ConfirmacaoDeProduto")}
            fontSize={14}
            fontWeight="bold"
            textColor={"white"}
            width={250}
            padding={15}
          />
        </View>
      </ScrollView>
      <Nav />
    </SafeAreaView>
  );
}
