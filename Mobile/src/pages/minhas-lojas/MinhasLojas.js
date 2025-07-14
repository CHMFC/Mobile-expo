import { SafeAreaView, View, ScrollView, RefreshControl, Platform } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { styles } from "./MinhasLojasStyles";
import { Text } from "react-native-elements";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import Button from "../../components/button/Button";
import Card from "../../components/card/Card";
import { Skelleton } from "../../components/skelleton/Skelleton";
import { SkelletonItens } from "../../const/skelletonItens";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import { API_URL } from "../../const/apiUrl";

export default function MinhasLojas({ navigation }) {
  const { tokenStored, userStored } = usePersist();
  const [getData, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const lojas = async () => {
      try {
        const response = await axios.get(
          `${API_URL.base}/usuarios/lojas`,
          {
            headers: {
              Authorization: `Bearer ${tokenStored}`,
            },
          }
        );
        setData(response?.data);
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    lojas();
  }, [refreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        title={"FIDELIZE PE"}
        icon={true}
        onPress={() => navigation.goBack()}
      />
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.textContainer}>
          <Text h4 style={styles.text}>
            Lojas cadastradas
          </Text>
          <Button
            label={"Cadastrar"}
            backgroundColor={"#005098"}
            borderRadius={5}
            onPress={() => navigation.navigate("cadastroDeLojaSemLoja")}
            fontSize={14}
            textColor={"white"}
            width={"30%"}
            padding={12}
          />
        </View>

        {isLoading ? (
          <View style={styles.skeletonContainer}>
            {SkelletonItens.map((item, index) => (
              <Skelleton
                key={index}
                width={"90%"}
                marginBottom={12}
                round={16}
                height={72}
              />
            ))}
          </View>
        ) : (
          <View style={styles.container}>
            {getData.length === 0 && (
              <Text style={{ textAlign: "center", fontSize: 22 }}>
                Nenhuma loja cadastrada
              </Text>
            )}
            {getData
              .filter(
                (loja) =>
                  userStored.id === loja?.usuarioId ||
                  loja?.funcionarios[0]?.ativo
              )
              .map((loja) =>
                <Card
                  key={loja?.id}
                  item={loja}
                  onPress={() =>
                    navigation.navigate("OpcoesLoja", { id: loja?.id })
                  }
                />
              )}
          </View>
        )}
      </ScrollView>
      <Nav />
    </View>
  );
}
