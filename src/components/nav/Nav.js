import { memo } from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, SafeAreaView, View } from "react-native";
import { Text, Icon } from "react-native-elements";

export default function NavComponent({
  home,
  meusPedidos,
  RecompensaSelect,
  conta,
  completarCadastro
}) {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        position: "absolute",
        width: "100%",
        padding: 12,
        backgroundColor: "#005098",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "row",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
      }}
    >
      {home ? (
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon name="home" size={24} type="ionicon" color={"#ffffff"} />
          <Text style={{ color: "#ffffff", fontWeight: "100" }}>Home</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon
            name="home-outline"
            size={24}
            type="ionicon"
            color={"#ffffff"}
          />
          <Text style={{ color: "#ffffff", fontWeight: "100" }}>Home</Text>
        </TouchableOpacity>
      )}

      {meusPedidos ? (
        <TouchableOpacity onPress={() => navigation.navigate("meusPedidos")}>
          <Icon name="reader" size={24} color="#ffffff" type="ionicon" />
          <Text style={{ color: "#ffffff", fontWeight: "100" }}>Histórico</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("meusPedidos")}>
          <Icon
            name="reader-outline"
            size={24}
            color="#ffffff"
            type="ionicon"
          />
          <Text style={{ color: "#ffffff", fontWeight: "100" }}>Histórico</Text>
        </TouchableOpacity>
      )}

      {RecompensaSelect ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("RecompensaSelect")}
        >
          <Icon name="trophy" size={24} color="#ffffff" type="ionicon" />
          <Text style={{ color: "#ffffff", fontWeight: "100" }}>
            Recompensas
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate("RecompensaSelect")}
        >
          <Icon
            name="trophy-outline"
            size={24}
            color="#ffffff"
            type="ionicon"
          />
          <Text style={{ color: "#ffffff", fontWeight: "100" }}>
            Recompensas
          </Text>
        </TouchableOpacity>
      )}

      {conta ? (
        <TouchableOpacity onPress={() => navigation.navigate("Conta")}>
          <Icon name="person-circle" size={24} color="#ffffff" type="ionicon" />
          <Text style={{ color: "#ffffff", fontWeight: "100" }}>Conta</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("Conta")}>
          <Icon
            name="person-circle-outline"
            size={24}
            color="#ffffff"
            type="ionicon"
          />
          {completarCadastro ? (
            <View style={{
              backgroundColor: 'red', width: 10, height: 10,
              borderRadius: 5, position: "absolute", right: 0
            }}></View>
          ) : null}
          <Text style={{ color: "#ffffff", fontWeight: "100" }}>Conta</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

export const Nav = memo(NavComponent);
