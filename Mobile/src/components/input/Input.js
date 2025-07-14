import { Text } from "@rneui/base";
import { TextInput, SafeAreaView, View } from "react-native";
import { Icon } from "react-native-elements";
import { memo } from "react";
import { TextInputMask } from "react-native-masked-text";
import { styles } from "./InputStyle";

export default function InputComponent({
  placeholder,
  onChange,
  onChangeText,
  title,
  description,
  value,
  icon,
  iconName,
  onPress,
  padding,
  borderRadius,
  maskType,
  obrigatorio,
  keyboardType,
  disabled,
  height,
}) {
  return (
    <SafeAreaView
      style={{
        width: "100%",
        marginBottom: 8
      }}
    >
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          marginBottom: 0
        }}
      >
        <Text
          style={{
            marginLeft: 8,
            color: "black",
            fontSize: 14
          }}
        >
          {title}
        </Text>
        {obrigatorio && (
          <Text
            style={{
              color: "red",
            }}
          >
            *
          </Text>
        )}
      </View>
      <SafeAreaView
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          color: "#005098",
          backgroundColor: "#DCDCDC",
          borderRadius: 32,
          minHeight: 48,
          width: "100%"
        }}
      >
        {maskType ? (
          <SafeAreaView
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingRight: 16
            }}
          >
            <TextInputMask
              type={maskType}
              options={{
                maskType: "BRL",
                withDDD: true,
                dddMask: "(99) ",
              }}
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#878383"
              style={{ 
                flex: 1, 
                color: "#000000",
                paddingVertical: 12,
                paddingLeft: 16
              }}
              onChange={onChange}
              onChangeText={onChangeText}
              editable={disabled ? false : true}
            />
            {icon && (
              <Icon
                size={24}
                name={iconName}
                type="ionicon"
                onPress={onPress}
                style={{ marginRight: 16, paddingLeft: 8 }}
              />
            )}
          </SafeAreaView>
        ) : (
          <TextInput
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#878383"
            style={styles.passwordInput}
            onChange={onChange}
            onChangeText={onChangeText}
            multiline={description ? true : false}
            numberOfLines={description ? 5 : 1}
            autoCapitalize="none"
            editable={disabled ? false : true}
          />
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
}

export const Input = memo(InputComponent);
