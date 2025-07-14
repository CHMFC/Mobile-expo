
import { memo } from "react";
import { View, StatusBar, Platform } from "react-native";

function StatusBarIosComponent({ color = "#005098", barStyle = "light-content" }) {
  return (
    <>
      <StatusBar barStyle={barStyle} />

      {Platform.OS === "ios" && (
        <View style={{ height: 50, backgroundColor: color }} />
      )}
    </>
  );
}

export const StatusBarIos = memo(StatusBarIosComponent);
