import React, { createContext, useEffect, useState, useMemo } from "react";
export const NotificationContext = createContext({});
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../const/apiUrl";

import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Overlay, Avatar, CheckBox, Icon } from "react-native-elements";
import Form from "../components/form/Form";
import Button from "../components/button/Button";
import("react-native-image-picker");
import axios from "axios";

export default function NotificationContextProvider({ children }) {
  const [allNotifications, setAllNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificacao, setNotificacao] = useState({});
  const [pesquisa, setPesquisa] = useState(null);
  const [pesquisaFinalizada, setPesquisaFinalizada] = useState(false);
  const [pesquisaErro, setPesquisaErro] = useState(null);

  const [loja, setLoja] = useState();
  const [atendimento, setAtendimento] = useState(null);
  const [limpeza, setLimpeza] = useState(null);
  const [qualidade, setQualidade] = useState(null);
  const [variedade, setVariedade] = useState(null);
  const [preco, setPreco] = useState(null);

  useEffect(() => {
    setAtendimento(null)
    setLimpeza(null)
    setQualidade(null)
    setVariedade(null)
    setPreco(null)

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const messageObject = {
        text: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        avatar: remoteMessage.notification.android.imageUrl,
        createdAt: new Date(),
        data: remoteMessage.data.data ? JSON.parse(remoteMessage.data.data) : null,
      };

      if (messageObject?.data?.pedidoValidado) {
        setNotificacao(messageObject)
        setTimeout(() => {
          setPesquisa(true);
        }, 500);

        if (pesquisa != null) {
          if (pesquisa) {
            setPesquisa(false);
            enviarPesquisa().then(() => {
              setPesquisa(false);
            }).catch(err => {return null})
          } else {
            setPesquisa(false);
          }
        }
      }

      if (!allNotifications.some((notif) => notif.createdAt === messageObject.createdAt)) {
        setAllNotifications((prevState) => [...prevState, messageObject]);
        setNotificationCount((prevCount) => prevCount + 1);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [allNotifications]);

  const toggleOverlay = () => {
    setPesquisa(!pesquisa);
    setAtendimento(null)
    setLimpeza(null)
    setQualidade(null)
    setVariedade(null)
    setPreco(null)
  };

  const enviarPesquisa = async () => {
    const data = {
      "atendimento": atendimento,
      "limpeza": limpeza,
      "qualidade": qualidade,
      "variedade": variedade,
      "preco": preco,
      "pedidoId": notificacao?.data?.pedidoId
    }

    const token = await AsyncStorage.getItem("token")

    await axios.post(`${API_URL.base}/lojas/${notificacao?.data?.lojaId}/satisfacao`, data, {
      headers: {
        Authorization: `Bearer ${token.slice(1, -1)}`
      },
    }).then((res) => {
      setPesquisaFinalizada(true)
      setAtendimento(null)
      setLimpeza(null)
      setQualidade(null)
      setVariedade(null)
      setPreco(null)
      setTimeout(
        () => {
          setPesquisaFinalizada(false)
          setPesquisa(false)
        },
        5000
      );
    }).catch((error) => {
      if (error.response.data.message == "O dono ou um funcionário da loja não pode avaliar a loja!") {
        setPesquisaErro(true);
        setPesquisaFinalizada(true)
        setAtendimento(0)
        setLimpeza(0)
        setQualidade(0)
        setVariedade(0)
        setPreco(0)
        setTimeout(() => {
          setPesquisaFinalizada(false)
          setPesquisa(false)
          setPesquisaErro(false)
        }, 5000);
      } else return null;
    });
  };

  useEffect(() => {
    async function buscarDadosDaLoja() {
      await axios.get(
        `${API_URL.base}/lojas/${notificacao?.data?.lojaId}`
      ).then((response) => {
        setLoja(response?.data);
      }).catch((err) => {
          
      });
    }
    if (notificacao?.data?.lojaId) buscarDadosDaLoja();
  }, [pesquisa]);

  return (
    <>
      <NotificationContext.Provider
        value={{ allNotifications, notificationCount, setNotificationCount }}
      >
        {children}
      </NotificationContext.Provider>

      {pesquisa ? (
        <Overlay
          isVisible={pesquisa}
          onBackdropPress={() => {
            toggleOverlay();
            setPesquisa(false);
          }}
          overlayStyle={{
            width: '90%',
            borderRadius: 16,
            padding: 0
          }}
        >
          <ScrollView>
            <View style={{ padding: 24, paddingBottom: 16 }}>
              {["consumo", "manual"].includes(notificacao.data?.tipo) ? (
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
                  Você recebeu {notificacao.data?.pontos}{notificacao.data?.tipo == "consumo" ? ' ticket' : ' ponto'}{notificacao.data?.pontos > 1 || notificacao.data?.pontos < -1 ? 's' : ''}. Parabéns!
                </Text>
              ) : (
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
                  Você resgatou um produto. Parabéns!
                </Text>
              )}

              <Text style={{ fontSize: 16, fontWeight: "bold", color: "black", marginTop: 8 }}>
                Como foi sua experiência conosco?
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "Regular", color: "black" }}>
                Nos ajude a melhorar respondendo a pesquisa abaixo.
              </Text>
            </View>

            <View style={{
              width: '80%',
              marginLeft: '7%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Avatar
                rounded
                size={64}
                source={{ uri: loja?.imagem }}
                containerStyle={{ backgroundColor: "gray", marginRight: 16 }}
              />
              <Text
                style={{
                  width: '66%',
                  fontSize: 18, color: 'black',
                  fontWeight: 'bold', flexWrap: "wrap",
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >{loja?.nomeFantasia}</Text>
            </View>

            <View style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              paddingBottom: 30
            }}>
              <View style={{ width: '85%', marginTop: 5 }}>
                <View style={{
                  width: '100%',
                  alignItems: "center",
                  marginBottom: 10
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: '#545454',
                    fontWeight: 'bold',
                    marginHorizontal: 12,
                    marginVertical: 4
                  }}>Atendimento</Text>
                  <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    paddingBottom: 2,
                  }}>
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={atendimento && atendimento >= 1 ? true : false}
                      onPress={() => { setAtendimento(1) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={atendimento && atendimento >= 2 ? true : false}
                      onPress={() => { setAtendimento(2) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={atendimento && atendimento >= 3 ? true : false}
                      onPress={() => { setAtendimento(3) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={atendimento && atendimento >= 4 ? true : false}
                      onPress={() => { setAtendimento(4) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={atendimento && atendimento >= 5 ? true : false}
                      onPress={() => { setAtendimento(5) }}
                    />
                  </View>
                </View>
                <View style={{
                  width: '100%',
                  alignItems: "center",
                  marginBottom: 10
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: '#545454',
                    fontWeight: 'bold',
                    marginHorizontal: 12,
                    marginVertical: 4
                  }}>Limpeza</Text>
                  <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    paddingBottom: 2,
                  }}>
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={limpeza && limpeza >= 1 ? true : false}
                      onPress={() => { setLimpeza(1) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={limpeza && limpeza >= 2 ? true : false}
                      onPress={() => { setLimpeza(2) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={limpeza && limpeza >= 3 ? true : false}
                      onPress={() => { setLimpeza(3) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={limpeza && limpeza >= 4 ? true : false}
                      onPress={() => { setLimpeza(4) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={limpeza && limpeza >= 5 ? true : false}
                      onPress={() => { setLimpeza(5) }}
                    />
                  </View>
                </View>
                <View style={{
                  width: '100%',
                  alignItems: "center",
                  marginBottom: 10
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: '#545454',
                    fontWeight: 'bold',
                    marginHorizontal: 12,
                    marginVertical: 4
                  }}>Qualidade</Text>
                  <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    paddingBottom: 2,
                  }}>
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={qualidade && qualidade >= 1 ? true : false}
                      onPress={() => { setQualidade(1) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={qualidade && qualidade >= 2 ? true : false}
                      onPress={() => { setQualidade(2) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={qualidade && qualidade >= 3 ? true : false}
                      onPress={() => { setQualidade(3) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={qualidade && qualidade >= 4 ? true : false}
                      onPress={() => { setQualidade(4) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={qualidade && qualidade >= 5 ? true : false}
                      onPress={() => { setQualidade(5) }}
                    />
                  </View>
                </View>
                <View style={{
                  width: '100%',
                  alignItems: "center",
                  marginBottom: 10
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: '#545454',
                    fontWeight: 'bold',
                    marginHorizontal: 12,
                    marginVertical: 4
                  }}>Variedade</Text>
                  <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    paddingBottom: 2,
                  }}>
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={variedade && variedade >= 1 ? true : false}
                      onPress={() => { setVariedade(1) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={variedade && variedade >= 2 ? true : false}
                      onPress={() => { setVariedade(2) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={variedade && variedade >= 3 ? true : false}
                      onPress={() => { setVariedade(3) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={variedade && variedade >= 4 ? true : false}
                      onPress={() => { setVariedade(4) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={variedade && variedade >= 5 ? true : false}
                      onPress={() => { setVariedade(5) }}
                    />
                  </View>
                </View>
                <View style={{
                  alignItems: "center",
                  borderColor: '#d3d3d3',
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: '#545454',
                    fontWeight: 'bold',
                    marginHorizontal: 12,
                    marginVertical: 4
                  }}>Preço</Text>
                  <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    paddingBottom: 2,
                  }}>
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={preco && preco >= 1 ? true : false}
                      onPress={() => { setPreco(1) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={preco && preco >= 2 ? true : false}
                      onPress={() => { setPreco(2) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={preco && preco >= 3 ? true : false}
                      onPress={() => { setPreco(3) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={preco && preco >= 4 ? true : false}
                      onPress={() => { setPreco(4) }}
                    />
                    <CheckBox
                      containerStyle={{
                        padding: 0,
                        justifyContent: "center",
                        maxHeight: 28
                      }}
                      iconType='font-awesome'
                      checkedIcon='star'
                      uncheckedIcon='star-o'
                      checkedColor='gold'
                      size={28}
                      checked={preco && preco >= 5 ? true : false}
                      onPress={() => { setPreco(5) }}
                    />
                  </View>
                </View>
                <Button
                  disabled={(atendimento == 0 || limpeza == 0 || qualidade == 0
                    || variedade == 0 || preco == 0) ? true : false}
                  onPress={enviarPesquisa}
                  label={"Enviar"}
                  marginTop={24}
                  backgroundColor={(atendimento == 0 || limpeza == 0 || qualidade == 0
                    || variedade == 0 || preco == 0) ? "lightgrey" : "#005098"}
                  width={"100%"}
                  textColor={"#FFFFFF"}
                  padding={16}
                  fontSize={16}
                  borderRadius={32}
                  fontWeight={"bold"}
                />

                <Button
                  onPress={() => {
                    setPesquisa(false)
                  }}
                  label={"Não quero responder"}
                  marginTop={10}
                  backgroundColor={"#DC143C"}
                  width={"100%"}
                  textColor={"#FFFFFF"}
                  padding={16}
                  fontSize={16}
                  borderRadius={32}
                  fontWeight={"bold"}
                />
              </View>
            </View>
          </ScrollView>
        </Overlay>
      ) : null}

      {pesquisaFinalizada && (
        <Overlay
          isVisible={pesquisa}
          onBackdropPress={() => {
            toggleOverlay();
            setPesquisa(false);
            setPesquisaFinalizada(false);
          }}
          overlayStyle={{
            width: '90%',
            borderRadius: 16,
            padding: 0
          }}
        >
          <View style={{ padding: 24, paddingVertical: 50, alignItems: "center" }}>
            {!pesquisaErro ? (
              <Icon
                name='smile-o'
                type='font-awesome'
                color='#005098'
                size={64}
              />
            ) : (
              <Icon
                name='exclamation-triangle'
                type='font-awesome'
                color='red'
                size={64}
              />
            )}
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "black", marginTop: 20, textAlign: "center" }}>
              {!pesquisaErro ? "Agradecemos sua opinião!" : "Você não pode avaliar esta loja!\nPorque você é o dono ou um funcionário!"}
            </Text>
          </View>
        </Overlay>
      )}
    </>
  );
}