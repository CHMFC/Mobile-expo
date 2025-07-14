import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainUsers: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  mainContainer: {
    width: "100%",
    marginTop: "2%",
    display: "flex",
    alignItems: "center",
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
  infoShop: {
    container: {
      flexDirection: "row",
      marginHorizontal: 12,
      alignItems: "center",
    },
    textContainer: {
      marginHorizontal: 8,
    },
    textTitle: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
    },
    textSubtitle: {
      color: "black",
      fontSize: 12,
    },
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
