import { SafeAreaView, StatusBar, View, Text, Linking } from "react-native";
import { Header } from "../../components/header/Header";
import Nav from "../../components/nav/Nav";

export default function SuportScottclub({ navigation }) {

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "white",
                paddingTop: StatusBar.currentHeight,
            }}
        >
            <Header icon={true} onPress={() => navigation.goBack()} />

            <Text style={{
                marginLeft: '5%',
                marginTop: 12,
                fontSize: 24,
                fontWeight: "700",
                height: 32,
                color: "black"
            }}>Suporte ScottClub</Text>

            <Text style={{
                color: "#005098",
                fontSize: 21,
                fontWeight: "bold",
                marginLeft: '5%',
                marginTop: 10
            }}>Contato</Text>

            <View style={{
                flexDirection: 'row',
                marginTop: 5
            }}>
                <Text style={{
                    color: "black",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginLeft: '5%',
                    marginRight: 8
                }}>E-mail:</Text>
                <Text style={{
                    color: "rgba(0, 80, 152, 0.75)",
                    fontSize: 16,
                    fontWeight: "bold"
                }}
                    onPress={() => Linking.openURL('mailto:contato@scottclub.com.br')}
                >contato@scottclub.com.br</Text>
            </View>
            <Nav />
        </SafeAreaView>
    );
}
