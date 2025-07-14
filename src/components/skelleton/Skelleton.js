import React, { useEffect, memo, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export const SkelletonComponent = ({ width, height, round, marginBottom }) => {
  const opacity = useRef(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          useNativeDriver: true,
          duration: 800,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          opacity: opacity.current,
          width: width,
          height: height,
          borderRadius: round,
          marginBottom: marginBottom,
        },
        styles.skelleton,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skelleton: {
    backgroundColor: "#EEEEEE",
  },
});
export const Skelleton = memo(SkelletonComponent);
