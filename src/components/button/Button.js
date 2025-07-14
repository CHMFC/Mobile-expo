import { memo } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function ButtonComponent({
  onPress,
  label,
  backgroundColor,
  borderRadius,
  padding,
  width,
  textColor,
  fontWeight,
  fontSize,
  marginTop,
  marginBottom,
  disabled
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={{
        backgroundColor: backgroundColor,
        width: width,
        alignItems: "center",
        justifyContent: "center",
        padding: padding,
        borderRadius: borderRadius,
        marginBottom: marginBottom,
        marginTop: marginTop,
        elevation: 10,
      }}
      onPress={onPress}
    >
      <Text style={{ color: textColor, fontWeight: fontWeight, fontSize: fontSize }}>{label}</Text>
    </TouchableOpacity>
  );
}

export const Button = memo(ButtonComponent);
