import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  scrollContent: {
    flexGrow: 1,
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

  skeletonContainer: {
    width: "100%",
    alignItems: "center",
  },

  info: {
    width: "60%",
  },
});
