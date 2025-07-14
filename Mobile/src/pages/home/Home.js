import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  ScrollView,
  PermissionsAndroid,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Geolocation from "@react-native-community/geolocation";
import messaging from "@react-native-firebase/messaging";
import { useIsFocused } from "@react-navigation/native";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import { styles } from "./homeStyle";
import { AdImages } from "../../components/adImages/AdImages";
import { CategoriesInfo } from "../../components/categoriesInfo/CategoriesInfo";
import { InfoUser } from "../../components/infoUser/InfoUser";
import useShop from "../../hooks/useShop";
import useCategory from "../../hooks/useCategory";
import usePersist from "../../hooks/usePersist";
import { Card } from "../../components/card/Card";
import { Skelleton } from "../../components/skelleton/Skelleton";
import { SkelletonItens } from "../../const/skelletonItens";
import { registerDeviceForRemoteMessages } from "../../const/notifications";
import { PontosConta } from "../../components/pontosConta/PontosConta";
import { Icon, Overlay } from "react-native-elements";
import { getDistance } from "geolib";
import { API_URL } from "../../const/apiUrl"
import ScreenContainer from "../../components/screenContainer/ScreenContainer";


const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const { tokenStored, setTokenStored, setUserStored } = usePersist();
  const [getCategorias, setCategorias] = useState([]);
  const [getBanner, setBanner] = useState([]);
  const [getData, setData] = useState([]);
  const [user, setUser] = useState();
  const [getUserData, setGetUserData] = useState([]);
  const [isFiltered, setIsFiltered] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [location, setLocation] = useState(false);
  const [token, setToken] = useState("");
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(null);
  const { setFilteredData, setGetAllData } = useShop();
  const { setSelectedCategory } = useCategory();
  const [isLoading, setIsLoading] = useState(true);
  const [infoPontos, setInfoPontos] = useState(false);
  const [infoTickets, setInfoTickets] = useState(false);
  const [complementarCadastro, setComplementarCadastro] = useState(false);

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
      }).catch((error) => {
        return null;
      });
  };

  useEffect(() => {
    if (location) {
      const updatedData = getData.map((item) => {
        const distance = getDistance(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          {
            latitude: parseFloat(item.endereco.latitude),
            longitude: parseFloat(item.endereco.longitude),
          }
        );
        return {
          ...item,
          distance: distance,
        };
      });
      updatedData.sort((a, b) => a.distance - b.distance);
      setData(updatedData);
    }

    if (location) {
      const updatedFiltered = isFiltered.map((item) => {
        const distance = getDistance(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          {
            latitude: parseFloat(item.endereco.latitude),
            longitude: parseFloat(item.endereco.longitude),
          }
        );
        return {
          ...item,
          distance: distance,
        };
      });
      updatedFiltered.sort((a, b) => a.distance - b.distance);
      setIsFiltered(updatedFiltered);
    }
  }, [location]);

  const salvarToken = useCallback(async () => {
    const userData = await AsyncStorage.getItem("userData");

    if (userData?.id) {
      await axios
        .put(
          `${API_URL.base}/usuarios/${userData?.id}/tokenCelular`,
          {
            tokenCelular: userData?.tokenCelular,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenStored}`,
            },
          }
        )
        .catch((error) => {
          if (["jwt malformed", "jwt expired"].includes(error.response.data))
            logout();
          else return null;
        });
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setComplementarCadastro(false);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (token && isFocused) {
      setCategoria("");
    }
  }, [token, isFocused]);

  useEffect(() => {
    const fetchToken = async () => {
      const granted = await messaging().requestPermission();
      if (granted) {
        const fcmToken = await messaging().getToken();
        await AsyncStorage.setItem("fcmToken", fcmToken);

        const userData = await AsyncStorage.getItem("userData");
        const userToken = await AsyncStorage.getItem("token");
        const userId = JSON.parse(userData).id;

        await axios
          .put(
            `${API_URL.base}/usuarios/${userId}/tokenCelular`,
            {
              tokenCelular: fcmToken,
            },
            {
              headers: {
                Authorization: `Bearer ${userToken.slice(1, -1)}`,
              },
            }
          )
          .catch((error) => {
            if (["jwt malformed", "jwt expired"].includes(error.response.data))
              logout();
            else return null;
          });
      }
    };

    fetchToken();

    const onTokenRefreshListener = messaging().onTokenRefresh(
      async (newToken) => {
        await AsyncStorage.setItem("fcmToken", newToken);
        const fcmToken = await messaging().getToken();
        await AsyncStorage.setItem("fcmToken", fcmToken);

        const userData = await AsyncStorage.getItem("userData");
        const userId = JSON.parse(userData).id;

        await axios
          .put(
            `${API_URL.base}/usuarios/${userId}/tokenCelular`,
            {
              tokenCelular: fcmToken,
            },
            {
              headers: {
                Authorization: `Bearer ${tokenStored}`,
              },
            }
          )
          .catch((error) => {
            if (["jwt malformed", "jwt expired"].includes(error.response.data))
              logout();
            else return null;
          });
      }
    );

    return () => {
      onTokenRefreshListener();
    };
  }, []);

  useEffect(() => {
    const resgatarLojas = async () => {
      try {
        await axios
          .get(`${API_URL.base}/lojas`, {
            headers: {
              Authorization: tokenStored
                ? `Bearer ${tokenStored}`
                : `Bearer ${token}`,
            },
          })
          .then((res) => {
            setData(res?.data);
            setGetAllData(res?.data);
          })
          .catch((err) => {
            if (["jwt malformed", "jwt expired"].includes(err.response.data))
              logout();
            else return null;
          })
          .finally(() => setIsStoreLoading(false));
      } catch (error) {
        return null;
      }
    };
    if (token || tokenStored) {
      resgatarLojas();
    }

    async function atualizarUser() {
      const data = await AsyncStorage.getItem("userData");
      const result = JSON.parse(data);
      setUser(result || null);
    }

    if (!user) setTimeout(() => {
      atualizarUser();
    }, 500);

    if (
      user &&
      (!user?.bairro || !user?.cidade || !user?.genero) &&
      refreshing == null
    ) {
      setTimeout(() => {
        setComplementarCadastro(true);
      }, 3000);
    }
  }, [tokenStored, refreshing, !user?.nome, !user?.imagem]);

  useEffect(() => {
    async function getToken() {
      await AsyncStorage.getItem("token")
        .then((tokenThen) => {
          setToken(JSON.parse(tokenThen) || null);
          const getUser = async () => {
            await axios
              .get(
                `${API_URL.base}/usuarios/pontos`,
                {
                  headers: {
                    Authorization: `Bearer ${JSON.parse(tokenThen)}`,
                  },
                }
              )
              .then((res) => {
                setGetUserData(res?.data);
              })
              .catch((error) => {
                if (
                  ["jwt malformed", "jwt expired"].includes(error.response.data)
                )
                  logout();
                else return null;
              })
              .finally(() => {
                setIsLoading(false);
              });
          };
          getUser();
        })
        .catch((error) => {
          return null;
        });
    }
    getToken();
    registerDeviceForRemoteMessages().catch((error) => {
      return null;
    });

    async function resgatarBanner() {
      await axios
        .get(`${API_URL.base}/banners`)
        .then((res) => {
          setBanner(res?.data);
        })
        .catch((error) => {
          return null;
        })
        .finally(() => setIsBannerLoading(false));
    }
    resgatarBanner();

    async function resgatarCategorias() {
      const categorias = await axios
        .get(`${API_URL.base}/categorias`)
        .catch((error) => {
          return null;
        })
        .finally(() => setIsCategoryLoading(false));
      setCategorias(categorias?.data);
      setSelectedCategory(categorias?.data);
    }
    resgatarCategorias();

    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permissão para geolocalização",
            message: "Podemos acessar sua geolocalização?",
            buttonNeutral: "Perguntar depois",
            buttonNegative: "Não",
            buttonPositive: "Sim",
          }
        );
        if (granted === "granted") {
          return true;
        }
      } catch (err) {
        return false;
      }
      return true;
    };
    requestLocationPermission();

    const getLocation = async () => {
      const result = requestLocationPermission();
      result.then((res) => {
        if (res) {
          Geolocation.getCurrentPosition(
            (position) => {
              setLocation(position);
            },
            (error) => {
              setLocation(false);
            },
            { timeout: 10000, maximumAge: 10000 }
          );
        }
      });
    };
    getLocation();
  }, [refreshing, user]);

  const filteredData = (nome) => {
    try {
      setCategoria(nome);
      const filter = getData.filter((loja) => loja?.categoria?.nome === nome);
      setFilteredData(filter);
      setIsFiltered(filter);
    } catch (error) {
    }
  };

  const exibirInfoPontos = () => {
    setInfoPontos(!infoPontos);
  };

  const exibirTicketsPontos = () => {
    setInfoTickets(!infoTickets);
  };

  return (
    <ScreenContainer>
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
    </ScreenContainer>
  );
}
