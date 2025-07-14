import {
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  View,
  RefreshControl,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { styles } from "./ContaStyle";
import { Text, Avatar, Icon, Overlay, Image } from "react-native-elements";
import Nav from "../../components/nav/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import { PontosConta } from "../../components/pontosConta/PontosConta";
import Modal from "../../components/modal/Modal";
import Button from "../../components/button/Button";
import { API_URL } from "../../const/apiUrl";
import { StatusBarIos } from "../../components/statusBarIos/StatusBarIos";

export default function Conta({ navigation }) {
  const [user, setUser] = useState();
  const [getUserData, setGetUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { tokenStored, setTokenStored, setUserStored } = usePersist();
  const [infoPontos, setInfoPontos] = useState(false);
  const [infoTickets, setInfoTickets] = useState(false);
  const [termos, setTermos] = useState(false);

  useEffect(() => {
    async function atualizarUser() {
      const data = await AsyncStorage.getItem("userData");
      const result = JSON.parse(data);
      setUser(result || null);
    }
    atualizarUser();

    const getUser = async () => {
      await axios
        .get(`${API_URL.base}/usuarios/pontos`, {
          headers: { Authorization: `Bearer ${tokenStored}` },
        })
        .then((res) => {
          setGetUserData(res?.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    getUser();
  }, [refreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const logout = async () => {
    await GoogleSignin.signOut();
    await AsyncStorage.getAllKeys()
      .then((keys) => {
        AsyncStorage.multiRemove(keys);
        setTokenStored("");
        setUserStored(null);
        setTimeout(() => {
          navigation.navigate("Login");
        }, 1700);
      })
      .catch((error) => {
        return null;
      });
  };

  const exibirInfoPontos = () => {
    setInfoPontos(!infoPontos);
  };

  const exibirTicketsPontos = () => {
    setInfoTickets(!infoTickets);
  };

  const toggleOverlay = () => {
    setTermos(!termos);
  };

  return (
    <>
      <StatusBarIos />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.mainBox}>
            <View
              style={[
                styles.background,
                {
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: 20,
                  paddingTop: StatusBar.currentHeight - 20,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Ajuda");
                }}
              >
                <Image
                  source={require("../../assets/cards/ajuda2.png")}
                  style={{ width: 32, height: 32 }}
                />
                <Text style={{ color: "#ffffff" }}>Ajuda</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={logout}>
                <Icon name="log-out" type="ionicon" size={32} color={"#ffffff"} />
                <Text style={{ color: "#ffffff" }}>Sair</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <View style={{ position: "absolute", top: -50 }}>
                {user?.imagem ? (
                  <Avatar
                    rounded
                    size={104}
                    source={{ uri: user?.imagem }}
                    containerStyle={{ backgroundColor: "gray" }}
                  />
                ) : (
                  <Avatar
                    rounded
                    size={104}
                    icon={{ name: "user", type: "font-awesome" }}
                    containerStyle={{ backgroundColor: "gray" }}
                  />
                )}
              </View>
              <Text style={styles.nome}>{user?.nome?.toUpperCase()}</Text>
              {isLoading ? (
                <ActivityIndicator
                  style={{
                    height: 150,
                    width: "88%",
                    backgroundColor: "#ccc",
                    borderRadius: 32,
                  }}
                  size="large"
                  color="#005098"
                />
              ) : (
                getUserData?.map((data) => (
                  <SafeAreaView key={user?.id}>
                    <PontosConta
                      tipoPontos={"Pontos"}
                      marginBottom={5}
                      width={"88%"}
                      data={data}
                      info={exibirInfoPontos}
                      color={"#005098"}
                      onPress={() =>
                        navigation.navigate("HistoricoPontos", {
                          lojas: [data?.pontosManuais],
                          manuais: true,
                        })
                      }
                    />

                    <Overlay
                      isVisible={infoPontos}
                      onBackdropPress={exibirInfoPontos}
                      overlayStyle={{ width: "90%" }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View />

                          <Text
                            style={{
                              color: "black",
                              fontWeight: "700",
                              marginLeft: 8,
                            }}
                          >
                            Como funciona os pontos?
                          </Text>
                          <TouchableOpacity>
                            <Icon
                              name="close-outline"
                              type="ionicon"
                              size={32}
                              color="#000"
                              onPress={exibirInfoPontos}
                            />
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={{
                            textAlign: "auto",
                            color: "black",
                          }}
                        >
                          Adquirindo QUALQUER PRODUTO OU SERVIÇO, você ganhará
                          PONTOS que virarão benefícios, desde que validado no
                          regulamento de pontuação e fidelização do Scotter
                          (lojista) escolhido.
                        </Text>
                      </View>
                    </Overlay>

                    <PontosConta
                      tipoPontos={"Tickets"}
                      data={data}
                      color={"#005098"}
                      info={exibirTicketsPontos}
                      width={"88%"}
                      onPress={() =>
                        navigation.navigate("HistoricoPontos", {
                          lojas: [data?.pontosProduto],
                        })
                      }
                    />

                    <Overlay
                      isVisible={infoTickets}
                      onBackdropPress={exibirTicketsPontos}
                      overlayStyle={{ width: "90%" }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View />

                          <Text
                            style={{
                              color: "black",
                              fontWeight: "700",
                              marginLeft: 8,
                            }}
                          >
                            Como funciona os tickets?
                          </Text>
                          <TouchableOpacity>
                            <Icon
                              name="close-outline"
                              type="ionicon"
                              size={32}
                              color="#000"
                              onPress={exibirTicketsPontos}
                            />
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={{
                            textAlign: "auto",
                            color: "black",
                          }}
                        >
                          Em PRODUTOS E SERVIÇOS ESPECÍFICOS, você ganhará TICKETS
                          especiais, desde que validado no regulamento de
                          pontuação e fidelização do Scotter (lojista) escolhido.
                        </Text>
                      </View>
                    </Overlay>
                  </SafeAreaView>
                ))
              )}
              <SafeAreaView style={styles.buttons}>
                <TouchableOpacity
                  style={styles.buttonMinhasLojas}
                  onPress={() => navigation.navigate("MinhasLojas")}
                >
                  <Text style={styles.textButtonMinhasLojas}>Minhas empresas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonAlterDados}
                  onPress={() => navigation.navigate("ContaUsuario")}
                >
                  {!user?.bairro ||
                    !user?.cidade ||
                    !user?.genero ? (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: "red",
                        borderRadius: 5,
                        position: "absolute",
                        right: "33%",
                        top: "70%",
                      }}
                    ></View>
                  ) : null}
                  <Text style={styles.textButtonAlterarDados}>Alterar dados</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: "5%",
                  }}
                  onPress={toggleOverlay}
                >
                  {termos && (
                    <Overlay
                      overlayStyle={{ borderRadius: 20, alignItems: "center" }}
                      isVisible={termos}
                      onBackdropPress={toggleOverlay}
                    >
                      <Modal>
                        <Button
                          label={"Fechar"}
                          onPress={toggleOverlay}
                          backgroundColor={"#005098"}
                          width={"90%"}
                          textColor={"#FFFFFF"}
                          padding={16}
                          fontSize={16}
                          borderRadius={32}
                          marginBottom={5}
                          fontWeight={"bold"}
                        />
                      </Modal>
                    </Overlay>
                  )}

                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: "#005098",
                    }}
                  >
                    Termos e Política de Privacidade.
                  </Text>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          </View>
        </ScrollView>
        <Nav conta={true} />
      </SafeAreaView>
    </>
  );
}
