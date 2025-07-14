import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    margin: 0,
    fontWeight: "bold",
  },

  scrollContainer: {
    display:"flex",
    alignItems:"center"
  },

  container: {
    width: "98%",
    marginTop: "2%",
    alignItems: "center",
    paddingBottom: "30%",
    marginHorizontal:"1%",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#DCDCDC",
  },

  image: {
    marginTop:"8%",
    width: 350,
    height: 350,
  },

  textContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "baseline",
    flexDirection: "column",
    marginLeft: "5%",
  },
  textH3: {
    fontSize: 25,
    fontWeight: "bold",
  },

  textH4: {
    fontSize: 15,
    marginLeft:"2%",
    color:"#727272"
  },
});