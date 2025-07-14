import { StatusBar } from "react-native";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    margin: 0,
    fontWeight: "bold",
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#005098",
  },

  textTitulo: {
    fontSize: 17,
    marginLeft: "5%",
    color: "#727272",
  },

  textImage: {
    marginTop: "7%",
    fontSize: 17,
    marginHorizontal: "5%",
    color: "#727272",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "2%",
  },

  textInfoUsuario: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: "5%",
  },

  scrollContainer: {
    width: "100%",
    marginTop: "2%",
    display: "flex",
    alignItems: "center",
    paddingBottom: "30%",
  },

  image: {
    width: undefined,
    height: undefined,
    aspectRatio: 2,
    resizeMode: "contain",
  },

  text: {
    width: "100%",
    display: "flex",
    marginLeft: "5%",
    marginBottom: "2%",
  },

  details: {
    display: "flex",
    alignItems: "center",
  },

  textContainer: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    padding: 10,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#DCDCDC",
  },

  textH3: {
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: "5%",
  },
});
