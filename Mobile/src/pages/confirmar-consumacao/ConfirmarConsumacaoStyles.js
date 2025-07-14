import { StatusBar } from "react-native";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginHorizontal: 16,
  },

  subtitle: {
    color: "black",
    fontSize: 14,
    marginHorizontal: 16,
  },

  card: {
    background: {
      alignItems: "center",
      marginVertical: 16,
    },
    container: {
      width: "90%",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#005098",
      backgroundColor: "#ffffff",
    },
    content: {
      flexDirection: "row",
      marginHorizontal: 16,
      marginVertical: 12,
      alignItems: "center",
    },
    textContainer: {
      marginLeft: 14,
      width: "80%",
    },
    product: {
      maxWidth: "90%",
      color: "#005098",
      fontWeight: "bold",
      fontSize: 16,
    },
    reward: {
      color: "black",
      fontWeight: "300",
    },
  },

  button: {
    container: {
      alignItems: "center",
      marginVertical: 5,
    },
  },
});
