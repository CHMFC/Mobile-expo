import { memo } from "react";
import { SafeAreaView } from "react-native";
import { styles } from "./formStyle";

export default function FormComponent({ children }) {
  return <SafeAreaView style={styles.formContainer}>{children}</SafeAreaView>;
}

export const Form = memo(FormComponent);
