import { StatusBar } from "react-native";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingTop: StatusBar.currentHeight,
  },
  mainUsers: {
    width: "100%",
    height: "100%",
    top: 16,
    marginBottom: 64,
  },
  divUser: {
    width: "90%",
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    height: 72,
    borderColor: "#005098",
    borderWidth: 1,
    marginTop: 8,
  },
  logo: {
    width: 48,
    height: 48,
  },
  btnSwitch: {
    flex: 1,
    paddingRight: 40,
  },

  card: {
    container: {
      alignItems: "center",
      marginTop: 12,
    },
    button: {
      width: "90%",
      height: 72,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#005098",
    },
    avatarContainer: {
      marginHorizontal: 8,
    },
    textContainer: {
      marginHorizontal: 16,
    },
    product: {
      color: "#005098",
      fontWeight: "bold",
      fontSize: 16,
    },
    points: {
      color: "black",
      fontWeight: "300",
    },
  },
});
