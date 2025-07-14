import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "25%",
  },

  formContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  forgotPasswordContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  forgotPassword: {
    color: "#005098",
    fontSize: 12,
    textDecorationLine: "underline",
    marginBottom: 16,
  },

  withouthRegister: {
    marginTop: "5%",
  },

  withouthRegisterText: {
    color: "#000000",
    fontWeight: "700",
    textAlign: "center",
  },

  registerNowText: {
    color: "#005098",
    fontWeight: "600",
    textAlign: "center",
  },
});
