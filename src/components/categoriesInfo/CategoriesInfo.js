import { memo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";

export const CategoriesInfoComponent = ({ imagem, label, onPress, categorieActive }) => {
  return (
    <View style={[
      { justifyContent: "center", alignItems: "center", marginHorizontal: 4, padding:8 },  
      categorieActive ? {backgroundColor:'#f0f0f0', borderRadius: 16}: null]}>
      <TouchableOpacity
        style={{
          width: 64,
          height: 64,
          borderRadius: 36,
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <Image source={{ uri: imagem }} style={{ width: 64, height: 64, borderRadius: 24 }} />
      </TouchableOpacity>
      <Text style={[{ color: "#005098", maxWidth: 80, fontSize: 12 }, categorieActive ? {textDecorationLine:'underline', fontWeight:'bold'} : null]}>{label}</Text>
    </View>
  );
};

export const CategoriesInfo = memo(CategoriesInfoComponent);
