import { Dimensions, StyleSheet, StatusBar } from "react-native";

const screenHeight = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: screenHeight,
    backgroundColor: "#ffffff",
    paddingTop: StatusBar.currentHeight,
  },

  button: {
    backgroundColor: "#005098",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    backgroundColor: "red",
  },

  otherButtons: {
    backgroundColor: "#FFFFFF",
    color: "#FFFFFF",
    width: "90%",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 20,
  },

  logo: {
    width: 35,
    height: 35,
  },

  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  descriptionContainer: {
    flexDirection: "row",
    margin: 16,
  },
});
