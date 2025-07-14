import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, RefreshControl, ScrollView } from "react-native";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/header/Header";
import useNotification from "../../hooks/useNotification";
import { Nav } from "../../components/nav/Nav";
import { StatusBar } from "react-native";

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
        console.error("Erro ao setar notificacoes no storageContext", error);
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
        console.log("NOTIFICACOES DO STORAGE", parseAllNotification);
      } catch (error) {
        console.error("Erro ao buscar notificacoes no storageContext", error);
      }
    };
    getAllNotificationsFromStorage();
  }, [refreshing, allNotifications]);

  return (
    <SafeAreaView
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flex: 1,
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flex: 1 }}
      >
        <Header icon={true} onPress={() => navigation.goBack()} />

        {allNotificationsFromStorage?.map((notification, key) => (
          <SafeAreaView
            key={key}
            style={{
              width: "90%",
              marginLeft: "5%",
              padding: 16,
              backgroundColor: "#FFFFFF",
              marginTop: 12,
              borderRadius: 5,
              elevation: 15,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {notification?.title}
            </Text>
            <Text>{notification?.text}</Text>
          </SafeAreaView>
        ))}
        <Nav />
      </ScrollView>
    </SafeAreaView>
  );
};
