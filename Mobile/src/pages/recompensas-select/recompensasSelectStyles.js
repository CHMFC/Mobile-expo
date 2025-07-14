import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
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
      padding: 16,
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
    textDescricao: {
      color: "black",
      fontWeight: "300",
    },
    textPoint: {
      color: "black",
      fontWeight: "300",
    },
  },
});
