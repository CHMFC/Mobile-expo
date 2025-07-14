import { SafeAreaView, TouchableOpacity, View, ScrollView } from "react-native";
import { styles } from "./UsuarioSemLojaStyles";
import { Text } from "react-native-elements";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import Button from "../../components/button/Button";

export default function UsuarioSemLoja({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={"FIDELIZE PE"} icon={true} onPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.middleContainer}>
          <Text style={styles.text}>Você não possui lojas cadastradas!</Text>
          <Button
            onPress={() => navigation.navigate("MinhasLojas")}
            label={"Cadastrar Loja"}
            backgroundColor={"#005098"}
            width={"90%"}
            textColor={"#FFFFFF"}
            padding={16}
            fontSize={16}
            borderRadius={32}
            fontWeight={"bold"}
          />
        </View>
      </ScrollView>
      <Nav />
    </SafeAreaView>
  );
}
