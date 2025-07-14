import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import usePersist from "../../hooks/usePersist";

export const Carregando = ({ navigation }) => {
  const { userStored } = usePersist();
  useEffect(() => {
    const toHome = async () => {
      userStored === null || userStored === undefined ? navigation.navigate("Login") : navigation.navigate("Home");
    };
    toHome();
  }, [userStored]);

  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#005098" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
