import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  nomeLoja: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 20,
  },
  endLoja: {
    fontSize: 13,
    marginLeft: 20,
  },

  mainBox: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  title: {
    color: "#005098",
    fontSize: 18,
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#005098",
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
    fontSize: 14,
  },
  textBox: {
    flexDirection: "column",
  },
});
