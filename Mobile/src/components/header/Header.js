import { memo } from "react";
import { View, SafeAreaView, TouchableOpacity, Platform } from "react-native";
import { Image, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import useNotification from "../../hooks/useNotification";
import { useNavigation } from "@react-navigation/native";
export default function HeaderComponent({ onPress, icon, iconNotifications, title }) {
  const navigation = useNavigation();
  const { notificationCount, setNotificationCount } = useNotification();

  const navigateToNotificationsAndResetCount = () => {
    try {
      navigation.navigate("Notificacoes");
      setNotificationCount(0);
    } catch (error) {
      
    }
  };
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 9,
        backgroundColor: "#005098",
        paddingVertical: 12,
        paddingHorizontal: 16,
      }}
    >
      {icon ? (
        <TouchableOpacity style={{ width: "10%" }} onPress={onPress}>
          <Icon name="chevron-back-outline" color="#ffffff" size={32} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: "10%" }}></View>
      )}

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "80%",
        }}
      >
        <Image
          source={require("../../assets/logo-header.png")}
          style={{ width: 150, height: 42 }}
        />
      </View>
      {iconNotifications == false ? (
        <View style={{ width: "10%" }}></View>
      ) : (
        <TouchableOpacity
          style={{ width: "10%" }}
          onPress={navigateToNotificationsAndResetCount}
        >
          <SafeAreaView>
            <Icon name="notifications-outline" color="#ffffff" size={28} />
            {notificationCount !== 0 && (
              <View
                style={{
                  backgroundColor: "red",
                  borderRadius: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  left: "35%",
                }}
              >
                <Text style={{
                  color: "#ffffff", borderRadius: 50,
                  lineHeight: 18, fontSize: 10,
                  paddingHorizontal: 6
                }}
                  numberOfLines={1} ellipsizeMode="clip"
                >{`${notificationCount}`.length <= 3 ? notificationCount : 999}</Text>
              </View>
            )}
          </SafeAreaView>
        </TouchableOpacity>
      )}
    </View>
  );
}

export const Header = memo(HeaderComponent);
