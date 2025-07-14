import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainUsers: {
    width: "100%",
    height: "100%",
    top: 56,
  },
  mainContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  divUser: {
    width: "90%",
    height: "50%",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderRadius: 16,
    borderColor: "#005098",
    borderWidth: 1,
    marginTop: 8,
  },

  btnPontos: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#005098",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#005098",
  },

  loginButton: {
    backgroundColor: "#005098",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 32,
    marginBottom: 12,
  },
  textLoginButton: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  search: {
    container: {
      alignItems: "center",
      borderRadius: 32,
      marginHorizontal: 16,
      marginVertical: 8,
      backgroundColor: "#DCDCDC",
    },
    input: {
      width: "90%",
      borderRadius: 32,
      color: "black",
      paddingLeft: 16,
    },
  },
  card: {
    background: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 8,
    },
    container: {
      width: "90%",
      flexDirection: "row",
      height: 80,
      alignItems: "center",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#005098",
    },
    textShop: {
      color: "black",
      fontWeight: "bold",
      fontSize: 16,
    },
    textProduct: {
      color: "#005098",
      fontSize: 16,
      fontWeight: "bold",
    },
    textDate: {
      color: "black",
      fontWeight: "300",
    },
    pointContainer: {
      marginLeft: 70,
      marginBottom: 36,
    },
    textPoint: {
      color: "black",
      fontWeight: "300",
    },
  },
});
