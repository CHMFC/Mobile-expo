import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { getDistance } from "geolib";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Overlay } from "react-native-elements";

// 1. Importações Corrigidas
import * as Location from 'expo-location';
import { AdImages } from "../../components/adImages/AdImages";
import { Card } from "../../components/card/Card";
import { CategoriesInfo } from "../../components/categoriesInfo/CategoriesInfo";
import Header from "../../components/header/Header";
import { InfoUser } from "../../components/infoUser/InfoUser";
import Nav from "../../components/nav/Nav";
import { PontosConta } from "../../components/pontosConta/PontosConta";
import { Skelleton } from "../../components/skelleton/Skelleton";
import { API_URL } from "../../const/apiUrl";
import { SkelletonItens } from "../../const/skelletonItens";
import useCategory from "../../hooks/useCategory";
import usePersist from "../../hooks/usePersist";
import useShop from "../../hooks/useShop";
import { styles } from "./homeStyle";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const { tokenStored, setTokenStored, setUserStored } = usePersist();
  const [getCategorias, setCategorias] = useState([]);
  const [getBanner, setBanner] = useState([]);
  const [getData, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [getUserData, setGetUserData] = useState([]);
  const [isFiltered, setIsFiltered] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [location, setLocation] = useState(null);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { setFilteredData, setGetAllData } = useShop();
  const { setSelectedCategory } = useCategory();
  const [isLoading, setIsLoading] = useState(true);
  const [infoPontos, setInfoPontos] = useState(false);
  const [infoTickets, setInfoTickets] = useState(false);
  const [complementarCadastro, setComplementarCadastro] = useState(false);

  const logout = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      setTokenStored("");
      setUserStored(null);
      setTimeout(() => navigation.navigate("Login"), 1700);
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  useEffect(() => {
    if (location) {
      const calculateDistances = (list) =>
        list.map((item) => {
          const distance = getDistance(
            { latitude: location.coords.latitude, longitude: location.coords.longitude },
            { latitude: parseFloat(item.endereco.latitude), longitude: parseFloat(item.endereco.longitude) }
          );
          return { ...item, distance };
        }).sort((a, b) => a.distance - b.distance);

      setData(calculateDistances(getData));
      setIsFiltered(calculateDistances(isFiltered));
    }
  }, [location]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Adicione aqui as funções que devem ser recarregadas
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    if (isFocused) {
      setCategoria("");
    }
  }, [isFocused]);

  useEffect(() => {
    const setupPermissionsAndLocation = async () => {
        // 2. Lógica de permissão e localização unificada com a API do Expo
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permissão para acessar a localização foi negada.');
            return;
        }

        try {
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        } catch (error) {
            console.error("Não foi possível obter a localização:", error);
        }
    };
    setupPermissionsAndLocation();
  }, [refreshing]);


  useEffect(() => {
    const fetchData = async () => {
        try {
            const storedToken = tokenStored || (await AsyncStorage.getItem("token"));
            if (!storedToken) return;

            const parsedToken = JSON.parse(storedToken);
            const authHeader = { headers: { Authorization: `Bearer ${parsedToken}` } };

            // Fetch Lojas
            axios.get(`${API_URL.base}/lojas`, authHeader)
                .then(res => {
                    setData(res.data);
                    setGetAllData(res.data);
                })
                .catch(err => console.error("Erro ao buscar lojas", err.response?.data || err.message))
                .finally(() => setIsStoreLoading(false));

            // Fetch UserData (pontos)
            axios.get(`${API_URL.base}/usuarios/pontos`, authHeader)
                .then(res => setGetUserData(res.data))
                .catch(err => console.error("Erro ao buscar pontos do usuário", err.response?.data || err.message))
                .finally(() => setIsLoading(false));
            
            // Fetch User from storage
            const userData = await AsyncStorage.getItem("userData");
            if(userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                if ((!parsedUser.bairro || !parsedUser.cidade || !parsedUser.genero) && !refreshing) {
                    setTimeout(() => setComplementarCadastro(true), 3000);
                }
            }
        } catch (error) {
            console.error("Erro geral no useEffect:", error);
        }
    };
    
    fetchData();

    // Fetch Banners e Categorias (não precisam de token)
    axios.get(`${API_URL.base}/banners`).then(res => setBanner(res.data)).catch(err => console.error("Erro ao buscar banners", err)).finally(() => setIsBannerLoading(false));
    axios.get(`${API_URL.base}/categorias`).then(res => {
        setCategorias(res.data);
        setSelectedCategory(res.data);
    }).catch(err => console.error("Erro ao buscar categorias", err)).finally(() => setIsCategoryLoading(false));

  }, [tokenStored, refreshing, isFocused]);


  const filteredData = (nome) => {
    try {
      setCategoria(nome);
      const filter = getData.filter((loja) => loja?.categoria?.nome === nome);
      setFilteredData(filter);
      setIsFiltered(filter);
    } catch (error) {
      console.error("Erro na função filteredData:", error);
    }
  };

  const exibirInfoPontos = () => setInfoPontos(!infoPontos);
  const exibirTicketsPontos = () => setInfoTickets(!infoTickets);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Header />
          <View
            style={{
              backgroundColor: "#005098",
              height: 400,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              alignItems: "center",
            }}
          >
            {isLoading ? (
              <ActivityIndicator
                style={{
                  height: 100,
                  width: "90%",
                  backgroundColor: "#dcdcdc",
                  borderRadius: 12,
                  marginBottom: 6,
                }}
                size="large"
                color="#1F5A9E"
              />
            ) : (
              <InfoUser
                imagem={user?.imagem}
                nome={user?.nome?.toUpperCase()}
                widthNav={76}
                texto="Meu perfil"
                onPress={() => navigation.navigate("Conta")}
              />
            )}
            {isLoading ? (
              <ActivityIndicator
                style={{
                  height: 150,
                  width: "90%",
                  backgroundColor: "#dcdcdc",
                  borderRadius: 12,
                }}
                size="large"
                color="#1F5A9E"
              />
            ) : (
              getUserData?.map((data, key) => (
                <View style={{ height: 300 }} key={key}>
                  <PontosConta
                    tipoPontos="Pontos"
                    marginBottom={5}
                    data={data}
                    width={"90%"}
                    info={exibirInfoPontos}
                    color="#1F5A9E"
                    onPress={() => {
                      navigation.navigate("HistoricoPontos", {
                        lojas: [data?.pontosManuais],
                        manuais: true,
                      });
                    }}
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
                            fontWeight: "600",
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
                    tipoPontos="Tickets"
                    data={data}
                    info={exibirTicketsPontos}
                    width={"90%"}
                    color="#1F5A9E"
                    onPress={() => {
                      navigation.navigate("HistoricoPontos", {
                        lojas: [data?.pontosProduto],
                      });
                    }}
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
                            fontWeight: "600",
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
                </View>
              ))
            )}
          </View>

          <View style={{ marginTop: -114 }}>
            {isBannerLoading ? (
              <SafeAreaView style={{ width: "100%", alignItems: "center" }}>
                <Skelleton width="90%" round={16} height={150} />
              </SafeAreaView>
            ) : (
              <FlatList
                data={getBanner}
                keyExtractor={(item) => item?.id}
                renderItem={({ item, index }) => (
                  <AdImages
                    banner={item?.imagem}
                    marginLeft={index === 0 ? 18 : 10}
                    marginRight={index === getBanner.length - 1 ? 18 : 10}
                  />
                )}
                snapToOffsets={[...Array(getBanner?.length)].map(
                  (_, index) => index * (width * 0.8 - 40) + (index - 1) * 40
                )}
                horizontal
                contentContainerStyle={{ alignItems: "center" }}
                snapToAlignment="start"
                decelerationRate="fast"
                onScroll={(event) => {
                  const position = event.nativeEvent.contentOffset.x;
                  setCurrentIndex((position / (width - 40)).toFixed(0));
                }}
                showsHorizontalScrollIndicator={false}
              />
            )}
            <View
              style={{
                flexDirection: "row",
                width,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              {getBanner?.map((banner, index) => (
                <View
                  key={index || banner?.id}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 50,
                    backgroundColor: currentIndex == index ? "#878383" : "#ccc",
                    marginLeft: 5,
                  }}
                />
              ))}
            </View>
          </View>

          <View style={[styles.categories.container, { marginTop: 0 }]}>
            <View style={[styles.categories.textContainer, { paddingTop: 2 }]}>
              <Text style={styles.categories.title}>Categorias</Text>
              <TouchableOpacity onPress={() => setCategoria("")}>
                <Text style={styles.categories.showMap}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            {isCategoryLoading ? (
              <SafeAreaView
                style={{
                  width: "100%",
                  alignItems: "flex-start",
                  flexDirection: "row",
                  marginLeft: "5%",
                  justifyContent: "space-between",
                }}
              >
                {SkelletonItens.slice(0, 5).map((item, key) => (
                  <Skelleton key={key} width={64} round={50} height={64} />
                ))}
              </SafeAreaView>
            ) : (
              <FlatList
                data={getCategorias}
                contentContainerStyle={{ alignItems: "flex-start" }}
                keyExtractor={(item) => item?.id}
                renderItem={({ item }) => (
                  <CategoriesInfo
                    categorieActive={item?.nome === categoria}
                    imagem={item?.imagem}
                    label={item?.nome}
                    onPress={() => filteredData(item?.nome)}
                  />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>

          <View style={styles.shop.container}>
            <View style={styles.categories.textContainer}>
              <Text style={styles.categories.title}>Lojas</Text>
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={() => navigation.navigate("TelaMapa")}
              >
                <Text style={styles.categories.showMap}>Ver mapa</Text>
              </TouchableOpacity>
            </View>
            {isStoreLoading ? (
              <SafeAreaView
                style={{
                  width: "100%",
                  alignItems: "center",
                }}
              >
                {SkelletonItens.slice(0, 5).map((_item, key) => (
                  <Skelleton
                    key={key}
                    width="90%"
                    marginBottom={12}
                    round={16}
                    height={72}
                  />
                ))}
              </SafeAreaView>
            ) : categoria ? (
              isFiltered?.map((item) => (
                <Card
                  userLocation={true}
                  item={item}
                  key={item?.id}
                  onPress={() =>
                    navigation.navigate("TelaLoja", {
                      id: item?.id,
                      pontosManuais: item?.pontosManuais,
                      pontosProdutos: item?.pontosProduto,
                    })
                  }
                />
              ))
            ) : (
              getData?.map((item) => (
                <Card
                  userLocation={true}
                  item={item}
                  key={item?.id}
                  onPress={() =>
                    navigation.navigate("TelaLoja", {
                      id: item?.id,
                      pontosManuais: item?.pontosManuais,
                      pontosProdutos: item?.pontosProduto,
                    })
                  }
                />
              ))
            )}
          </View>
        </ScrollView>

        <Nav
          home
          completarCadastro={
            !user?.bairro || !user?.cidade || !user?.genero
          }
        />
      </SafeAreaView>

      {complementarCadastro ? (
        <Overlay
          isVisible={complementarCadastro}
          onBackdropPress={() => {
            setComplementarCadastro(false);
          }}
          animationType='fade'
          overlayStyle={{
            width: "90%",
            borderRadius: 16,
            padding: 0,
          }}
        >
          <View style={{ padding: 24, paddingBottom: 16 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#005098" }}
            >
              Olá, complete seu cadastro agora.
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignContent: "stretch",
              borderTopColor: "#d3d3d390",
              borderTopWidth: 1,
            }}
          >
            <View
              style={{
                width: "50%",
                borderRightColor: "#d3d3d3",
                borderRightWidth: 0.5,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setComplementarCadastro(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#FF4500",
                    padding: 12,
                    textAlign: "center",
                  }}
                >
                  Agora não
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "50%",
                borderLeftColor: "#d3d3d3",
                borderLeftWidth: 0.5,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setComplementarCadastro(false);
                  navigation.navigate("ContaUsuario");
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "black",
                    color: "#3cb371",
                    padding: 12,
                    textAlign: "center",
                  }}
                >
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Overlay>
      ) : null}
    </>
  );
}
