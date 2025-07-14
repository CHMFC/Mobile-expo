import { memo } from "react";
import { TouchableOpacity } from "react-native";
import { Avatar, Text } from "react-native-elements";
import styles from "../../pages/login/loginStyles";

export const RenderShopComponent = ({ item }) => {
  return (
    <TouchableOpacity style={styles.shop.card} onPress={() => navigation.navigate("ConfirmarConsumacao")}>
      <Avatar source={item.image} rounded size="medium" containerStyle={styles.shop.avatar} />
      <Text style={styles.shop.shopName}>{item.name}</Text>
    </TouchableOpacity>
  );
};

export const RenderShop = memo(RenderShopComponent);
