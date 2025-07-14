import { StyleSheet, Platform, StatusBar } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100, // Add padding to ensure content is visible above the bottom navigation
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 20,
  },
  picker: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 12,
    backgroundColor: "#DCDCDC",
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#005098",
  },
});
