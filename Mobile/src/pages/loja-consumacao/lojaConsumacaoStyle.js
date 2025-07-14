import { StatusBar } from "react-native";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: StatusBar.currentHeight,
  },

  containerProdutos: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    marginBottom: "25%",
    display: "flex",
    alignItems: "center",
  },
});
