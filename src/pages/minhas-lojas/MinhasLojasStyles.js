import { StatusBar } from "react-native";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    margin: 0,
    fontWeight: "bold",
    backgroundColor: "#ffffff",
    paddingTop: StatusBar.currentHeight,
  },

  textContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 16,
  },

  container: {
    paddingBottom: "30%",
  },

  info: {
    width: "60%",
  },
});
