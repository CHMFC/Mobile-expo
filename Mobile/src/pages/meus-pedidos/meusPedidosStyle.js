import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  containerProdutos: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    marginBottom: "25%",
    display: "flex",
    alignItems: "center",
  },

  card: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderColor: "#005098",
    elevation: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 8,
    padding: 12,
  },

  pedidoInfo: {
    marginLeft: "5%",
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "black",
  },
  subTitle: {
    color: "#005098",
    fontWeight: "700",
    fontSize: 15,
  },
  pontos: {
    color: "#777",
  },
  descricao: {
    color: "#777",
  },
});
