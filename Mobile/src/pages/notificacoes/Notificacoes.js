import React, { useCallback, useEffect, useState } from "react";
import { View, RefreshControl, ScrollView } from "react-native";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/header/Header";
import useNotification from "../../hooks/useNotification";
import Nav from "../../components/nav/Nav";
import ScreenContainer from "../../components/screenContainer/ScreenContainer";

export const Notificacoes = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [allNotificationsFromStorage, setAllNotificationsFromStorage] =
    useState([]);
  const { allNotifications } = useNotification();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const setNotificationToStorage = async () => {
      try {
        const allNotificationsToStringfy = JSON.stringify(allNotifications);
        await AsyncStorage.setItem("notification", allNotificationsToStringfy);
      } catch (error) {
      }
    };
    setNotificationToStorage();

    const getAllNotificationsFromStorage = async () => {
      try {
        const getAllNotificationFromStorage = await AsyncStorage.getItem(
          "notification"
        );
        const parseAllNotification = JSON.parse(getAllNotificationFromStorage);
        setAllNotificationsFromStorage(parseAllNotification);
      } catch (error) {
        return null;
      }
    };
    getAllNotificationsFromStorage();
  }, [refreshing, allNotifications]);

  return (
    <ScreenContainer>
      <Header 
        icon={true} 
        onPress={() => navigation.goBack()} 
        iconNotifications={false}
      />
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={{ paddingTop: 16 }}>
          {allNotificationsFromStorage?.length > 0 ? (
            allNotificationsFromStorage?.map((notification, key) => (
              <View
                key={key}
                style={{
                  width: "90%",
                  marginLeft: "5%",
                  padding: 16,
                  backgroundColor: "#FFFFFF",
                  marginBottom: 12,
                  borderRadius: 5,
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>
                  {notification?.title}
                </Text>
                <Text style={{ color: "#333" }}>{notification?.text}</Text>
              </View>
            ))
          ) : (
            <View style={{ 
              width: "90%", 
              marginLeft: "5%",
              alignItems: "center", 
              justifyContent: "center", 
              paddingTop: 40 
            }}>
              <Text style={{ fontSize: 16, color: "#666" }}>
                Nenhuma notificação disponível
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <Nav />
    </ScreenContainer>
  );
};
