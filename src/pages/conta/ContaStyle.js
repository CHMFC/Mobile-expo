import { StatusBar } from "react-native";
import { StyleSheet, Dimensions } from "react-native";
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: StatusBar.currentHeight,
  },
  mainBox: {
    width: screenWidth,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: screenHeight,
  },

  background: {
    width: screenWidth,
    height: "20%",
    backgroundColor: "#005098",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  content: {
    width: screenWidth,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  nome: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: "20%",
    marginBottom: 8,
  },

  buttons: {
    width: "90%",
  },

  buttonMinhasLojas: {
    display: "flex",
    marginTop: "4%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#005098",
    borderRadius: 50,
    padding: 16,
  },
  buttonAlterDados: {
    display: "flex",
    marginTop: "4%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#005098",
    padding: 16,
    color: "#005098",
  },

  textButtonMinhasLojas: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  textButtonAlterarDados: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#005098",
  },
});
