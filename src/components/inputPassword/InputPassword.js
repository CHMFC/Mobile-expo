import { memo, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./inputPasswordStyle";

export default function InputPasswordComponent({
  placeholder,
  onChange,
  value,
  error,
}) {
  const [hidePass, setHidePass] = useState(true);

  return (
    <View
      style={
        error
          ? {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              backgroundColor: "#DCDCDC",
              borderRadius: 50,
              marginBottom: 12,
              borderColor: error && "red",
              borderWidth: error ? 1 : 0,
            }
          : styles.passwordContainer
      }
    >
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#878383"
        secureTextEntry={hidePass}
        style={styles.passwordInput}
        onChange={onChange}
      />

      <TouchableOpacity
        style={styles.icon}
        onPress={() => setHidePass(!hidePass)}
      >
        {hidePass ? (
          <Icon name="eye" color="#878383" size={24} />
        ) : (
          <Icon name="eye-off" color="#878383" size={24} />
        )}
      </TouchableOpacity>
    </View>
  );
}

export const InputPassword = memo(InputPasswordComponent);
