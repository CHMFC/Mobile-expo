import { memo } from "react";
import { Image, Dimensions, View } from "react-native";
const { width } = Dimensions.get("window");

export const AdImagesComponent = ({ banner, marginLeft, marginRight }) => {
  return (
    <View
      style={{
        width: width * 0.8 - 20,
        height: width / 2.2,
        borderRadius: 12,
        marginLeft: marginLeft,
        marginRight: marginRight,
      }}
    >
      <Image
        source={{ uri: banner }}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "cover",
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export const AdImages = memo(AdImagesComponent);
