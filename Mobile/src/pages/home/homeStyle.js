import { StatusBar } from "react-native";
import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },

  ad: {
    container: {
      width: screenWidth * 0.8,
      height: screenWidth / 2.6,
      borderRadius: 12,
      marginHorizontal: 10,
      backgroundColor: "red",
    },
    image: {
      flex: 1,
      resizeMode: "cover",
    },
  },

  categories: {
    container: {
      marginVertical: 8,
    },
    textContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
    },
    title: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      padding: 8,
    },
    showMap: {
      color: "#005098",
      padding: 4,
    },
  },

  shop: {
    container: {
      flex: 1,
      marginBottom: "25%",
    },
    title: {
      color: "black",
      fontWeight: "bold",
      fontSize: 16,
      marginVertical: 4,
    },
  },
});
