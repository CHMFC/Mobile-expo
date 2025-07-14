import { Text } from "@rneui/base";
import { TextInput, SafeAreaView, View } from "react-native";
import { Icon } from "react-native-elements";
import { memo } from "react";
import { TextInputMask } from "react-native-masked-text";

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
        marginBottom: 16,
      }}
    >
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            marginLeft: 18,
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
          padding: 8 || padding,
          backgroundColor: "#DCDCDC",
          borderRadius: borderRadius ? borderRadius : 50,
        }}
      >
        {maskType ? (
          <SafeAreaView
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "90%",
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
              style={{ width: "100%", color: "#000000" }}
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
              />
            )}
          </SafeAreaView>
        ) : (
          <TextInput
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#878383"
            style={{
              width: "100%",
              color: "#000000",
              height: height,
            }}
            keyboardType={keyboardType}
            multiline={description ? true : false}
            numberOfLines={description ? 5 : 1}
            onChange={onChange}
            onChangeText={onChangeText}
            textAlignVertical={description ? "top" : "center"}
            editable={disabled ? false : true}
          />
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
}

export const Input = memo(InputComponent);
