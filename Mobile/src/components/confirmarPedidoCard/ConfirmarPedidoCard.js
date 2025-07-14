import React, { memo } from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { Avatar, Text } from "react-native-elements";

const styles = {
  container: {
    width: "100%",
    height: 96,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#dcdcdc",
  },
  button: {
    width: "100%",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#000000",
  },
  textButton: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
};

const ConfirmarPedidoCardComponent = ({ pedido, onPress, onPressDelete }) => {
  const { imagemProduto, cliente, nomeProduto, pontos, dataValidacao } = pedido;
  const avatarSource = imagemProduto
    ? { uri: imagemProduto }
    : require("../../assets/mapavazio.png");
  return (
    <SafeAreaView
      style={{ width: "100%", alignItems: "center", marginTop: 12 }}
    >
      <View style={styles.container} activeOpacity={0.6}>
        <SafeAreaView
          style={{ display: "flex", flexDirection: "row", padding: 8 }}
        >
          <Avatar source={avatarSource} rounded size="medium" />
          <View
            style={{
              marginHorizontal: 8,
              display: "flex",
              flexDirection: "column",
              width: "60%",
            }}
          >
            <Text
              style={{
                color: "black",
                fontWeight: "bold",
                letterSpacing: 0.3,
                fontSize: 16,
              }}
            >
              {cliente.nome.toUpperCase()}
            </Text>
            <Text
              style={{
                color: "black",
                letterSpacing: 0.3,
                fontSize: 14,
                maxWidth: "100%",
              }}
            >
              {nomeProduto}
            </Text>
            {pontos > 1 ? (
              <Text
                style={{ color: "black", letterSpacing: 0.3, fontSize: 12 }}
              >
                {pontos} tickets
              </Text>
            ) : (
              <Text
                style={{ color: "black", letterSpacing: 0.3, fontSize: 12 }}
              >
                {pontos} ticket
              </Text>
            )}
          </View>
        </SafeAreaView>
        <SafeAreaView style={{ paddingRight: 8 }}>
          {dataValidacao === null ? (
            <View>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#005098" }]}
                onPress={onPress}
              >
                <Text style={styles.textButton}>Validar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "red", marginTop: 4 },
                ]}
                onPress={onPressDelete}
              >
                <Text style={styles.textButton}>Remover</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#818181" }]}
              disabled={!!dataValidacao}
            >
              <Text style={styles.textButton}>Validado</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

export const ConfirmarPedidoCard = memo(ConfirmarPedidoCardComponent);
