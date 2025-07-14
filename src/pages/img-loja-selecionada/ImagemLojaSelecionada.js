import { SafeAreaView, View, ScrollView, Image } from "react-native";
import { styles } from "./ImagemLojaSelecionadaStyles";
import { Text } from "react-native-elements";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";

export default function ImagemLojaSelecionada({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={"FIDELIZE PE"} icon={true} onPress={() => navigation.goBack()} />
      <View style={styles.textContainer}>
        <Text style={styles.textH3}>Cadastro de Loja</Text>
        <Text style={styles.textH4}>Essa imagem representará sua loja</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image style={styles.image} source={require("../../assets/lorem-ipsum-image.jpg")} />
          <Button
            label={"Escolher Imagem"}
            backgroundColor={"#DCDCDC"}
            borderRadius={20}
            onPress={() => navigation.navigate("ConfirmaçãoCadastroLoja")}
            fontSize={14}
            fontWeight="bold"
            textColor={"black"}
            width={250}
            padding={15}
            marginTop={20}
            marginBottom={20}
            icon={"../../assets/upload-icon.png"}
          />
          <Button
            label={"Finalizar"}
            backgroundColor={"#005098"}
            borderRadius={20}
            onPress={() => navigation.navigate("ConfirmaçãoCadastroLoja")}
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
