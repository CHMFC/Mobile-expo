import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerTitle: {
    alignItems: "flex-start",
    width: "70%",
  },

  titleBody: {
    color: "#000000",
    fontSize: 28,
    fontWeight: "400",
  },

  subtitleBody: {
    color: "#727272",
    fontSize: 14,
    fontWeight: "600",
  },

  termContainer: {
    width: "68%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },

  termText: {
    textAlign: "center",
    color: "black",
  },

  decorationTextTerm: {
    textDecorationLine: "underline",
    color: "#005098",
  },

  withouthRegister: {
    textAlign: "center",
  },

  withouthRegisterText: {
    color: "#000000",
    fontWeight: "700",
    marginTop: "5%",
  },

  registerNowText: {
    color: "#005098",
    fontWeight: "600",
    textAlign: "center",
  },

  picker: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 12,
    backgroundColor: "#DCDCDC",
    borderRadius: 50,
  },
});
