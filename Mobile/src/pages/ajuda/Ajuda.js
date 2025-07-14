import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    View,
    Text,
    Dimensions,
} from "react-native";
import { Header } from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { styles } from "./AjudaStyle";
import OpcoesLojaButton from "../../components/opcoesLojaButton/OpcoesLojaButton";
import ScreenContainer from "../../components/screenContainer/ScreenContainer";

const screenWidth = Dimensions.get("window").width;

export default function Ajuda({ navigation }) {
    const [user, setUser] = useState();

    useEffect(() => {
        async function atualizarUser() {
            const data = await AsyncStorage.getItem("userData");
            const result = JSON.parse(data);
            setUser(result || null);
        }
        atualizarUser();
    }, []);

    return (
        <ScreenContainer>
            <Header icon={true} onPress={() => navigation.goBack()} />

            <ScrollView>
                <Text style={styles.title}>Ajuda</Text>

                <View style={{ width: '100%', flexDirection: "column" }}>
                    <View
                        style={{
                            width: screenWidth,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <OpcoesLojaButton
                            onPress={() => { navigation.navigate("SuporteScottclub") }}
                            label="Suporte ScottClub"
                        />
                    </View>

                    <View
                        style={{
                            marginTop: 1,
                            width: screenWidth,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <OpcoesLojaButton
                            onPress={() => { navigation.navigate("DenuncieUmaLoja") }}
                            label="Fale com um Scotter (lojista)"
                        />
                    </View>

                </View>
            </ScrollView>
            <Nav />
        </ScreenContainer>
    );
}
