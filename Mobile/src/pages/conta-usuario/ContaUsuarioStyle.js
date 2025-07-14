import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingVertical: 24,
    paddingBottom: 120
  },

  inputs: {
    width: "90%",
    alignItems: "center",
    marginTop: 24
  },

  inputGroup: {
    width: "100%",
  },

  imageContainer: {
    alignItems: "center",
    marginBottom: 24
  },

  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#005098",
    borderRadius: 20,
    padding: 8
  },

  inputLabel: {
    color: "black",
    alignSelf: "flex-start",
    marginLeft: 8,
    marginTop: 12,
    marginBottom: 0,
    fontSize: 14
  },

  input: {
    backgroundColor: "#DCDCDC",
    width: "100%",
    borderRadius: 32,
    padding: 16,
    color: "#000000",
    minHeight: 48
  },

  pickerContainer: {
    backgroundColor: "#DCDCDC",
    width: "100%",
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 48,
    justifyContent: 'center'
  }
});
