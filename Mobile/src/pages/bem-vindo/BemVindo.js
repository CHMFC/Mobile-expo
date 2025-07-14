import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BemVindo({ route, navigation }) {
  const bemVindo = route.params.bemVindo;

  // Check if onboarding has been shown before when component mounts
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem("bemVindo");
        if (onboardingCompleted === "true") {
          // If onboarding was already completed, navigate to Home
          navigation.replace("Home", { token: route.params.token });
        }
      } catch (error) {
      }
    };
    
    checkOnboardingStatus();
  }, []);

  const Visualizacao = ({ selected }) => {
    let backgroundColor;
    backgroundColor = selected ? "#878383" : "#ccc";

    return (
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 16,
          marginHorizontal: 3,
          backgroundColor,
        }}
      ></View>
    );
  };

  const setStorage = async () => {
    try {
      await AsyncStorage.setItem("bemVindo", "true");
    } catch (error) {
    }
  };

  const Skip = ({ ...props }) => (
    <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
      <Text style={{ fontSize: 16, color: "white" }}>Pular</Text>
    </TouchableOpacity>
  );

  const Next = ({ ...props }) => (
    <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
      <Text style={{ fontSize: 16, color: "white" }}>Próximo</Text>
    </TouchableOpacity>
  );

  const Done = ({ ...props }) => (
    <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
      <Text style={{ fontSize: 16, color: "white" }}>Finalizar</Text>
    </TouchableOpacity>
  );

  return (
    <Onboarding
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Visualizacao}
      bottomBarColor="#005098"
      onSkip={() => {
        setStorage();
        navigation.replace("Home", { token: route.params.token });
      }}
      onDone={() => {
        setStorage();
        navigation.replace("Home", { token: route.params.token });
      }}
      pages={[
        {
          backgroundColor: "#005098",
          image: (
            <Image
              style={{
                width: "100%",
                height: "100%",
                marginTop: StatusBar.currentHeight,
              }}
              source={require("../../assets/apresentacao/tela1.png")}
            />
          ),
        },
        {
          backgroundColor: "#005098",
          image: (
            <Image
              style={{
                width: "100%",
                height: "100%",
                marginTop: StatusBar.currentHeight,
              }}
              source={require("../../assets/apresentacao/tela2.png")}
            />
          ),
        },
        {
          backgroundColor: "#005098",
          image: (
            <Image
              style={{
                width: "100%",
                height: "100%",
                marginTop: StatusBar.currentHeight,
              }}
              source={require("../../assets/apresentacao/tela3.png")}
            />
          ),
        },
      ]}
    />
  );
}
