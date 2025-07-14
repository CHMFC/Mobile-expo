import React, { memo, useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Avatar, Text, Icon, Overlay, CheckBox } from "react-native-elements";
import Button from "../../components/button/Button";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../const/apiUrl";

const PedidoCardComponent = ({ pedido, onRefresh }) => {
  const {
    id,
    lojaId,
    imagemProduto,
    loja,
    nomeProduto,
    pontos,
    tipo,
    dataValidacao,
    dataExpiracao,
    createdAt,
  } = pedido;

  const [pesquisaSatisfacao, setPesquisaSatisfacao] = useState(null);
  useEffect(() => {
    if (pedido.pesquisaSatisfacao[0]) {
      setPesquisaSatisfacao((pedido.pesquisaSatisfacao[0].atendimento
        + pedido.pesquisaSatisfacao[0].limpeza
        + pedido.pesquisaSatisfacao[0].qualidade
        + pedido.pesquisaSatisfacao[0].variedade
        + pedido.pesquisaSatisfacao[0].preco) / 5)
    };
  }, []);

  const [pesquisa, setPesquisa] = useState(false);
  const [pesquisaFinalizada, setPesquisaFinalizada] = useState(false);
  const [pesquisaErro, setPesquisaErro] = useState(null);

  const [atendimento, setAtendimento] = useState(0);
  const [limpeza, setLimpeza] = useState(0);
  const [qualidade, setQualidade] = useState(0);
  const [variedade, setVariedade] = useState(0);
  const [preco, setPreco] = useState(0);

  const avatarSource = imagemProduto
    ? { uri: imagemProduto }
    : require("../../assets/mapavazio.png");

  const toggleOverlay = () => {
    setPesquisa(!pesquisa);
  };

  const enviarPesquisa = async () => {
    const data = {
      "atendimento": atendimento,
      "limpeza": limpeza,
      "qualidade": qualidade,
      "variedade": variedade,
      "preco": preco,
      "pedidoId": id
    }

    const token = await AsyncStorage.getItem("token")

    await axios.post(`${API_URL.base}/lojas/${lojaId}/satisfacao`, data, {
      headers: {
        Authorization: `Bearer ${token.slice(1, -1)}`
      },
    }).then((res) => {
      setAtendimento(0)
      setLimpeza(0)
      setQualidade(0)
      setVariedade(0)
      setPreco(0)
      
      setPesquisa(false)
      setPesquisaErro(false)
      setPesquisaFinalizada(true)
      
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

  return (
    <>
      <View style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <View
          style={{
            width: "100%",
            paddingTop: 16,
            paddingBottom: 16,
            backgroundColor: "#FFFFFF",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
            paddingLeft: 8,
            borderBottomWidth: 0.5,
            borderBottomColor: "#005098",
          }}
        >
          <Avatar
            source={avatarSource}
            rounded
            size="medium"
            containerStyle={{ marginHorizontal: 8 }}
          />
          <View>
            <Text
              style={{
                maxWidth: "95%",
                color: "#000000",
                marginHorizontal: 16,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {loja?.nomeFantasia}
            </Text>
            {tipo === "manual" ? (
              <Text
                style={{
                  maxWidth: "95%",
                  color: "#005098",
                  marginHorizontal: 16,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {"Compra realizada"}
              </Text>
            ) : tipo === "e" || tipo === "em" ? (
              <Text
                style={{
                  maxWidth: "95%",
                  color: "#ff0000",
                  marginHorizontal: 16,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {`${tipo == 'em' ? "Ponto" : "Ticket"}${pontos < -1 ? "s" : null} expirados`}
              </Text>
            ) : (
              <Text
                style={{
                  maxWidth: "95%",
                  color: "#005098",
                  marginHorizontal: 16,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {nomeProduto}
              </Text>
            )}
            {pontos < 0 ? (
              <Text
                style={{
                  maxWidth: "95%",
                  color: "#ff0000",
                  marginHorizontal: 16,
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {tipo === "e" || tipo === "em" ? "" : "Produto resgatado\n"}
                {pontos}{" "}
                {tipo === 'em' ? "ponto" : "ticket"}
                {pontos < -1 ? "s" : null}
              </Text>
            ) : (
              <Text
                style={{
                  maxWidth: "95%",
                  color: "#00af2e",
                  marginHorizontal: 16,
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                +{pontos}{" "}
                {["manual", "manualResgate"].includes(tipo) ? "ponto" : "ticket"}
                {pontos > 1 ? "s" : null}
              </Text>
            )}
            {dataValidacao == null ? (
              tipo === "e" || tipo === "em" ? (
                <Text
                  style={{
                    maxWidth: "95%",
                    color: "#80808090",
                    marginHorizontal: 16,
                    fontSize: 14,
                  }}
                >
                  Expirados em {createdAt.substring(0, 2)} de{" "}
                  {
                    [
                      "JAN",
                      "FEV",
                      "MAR",
                      "ABR",
                      "MAI",
                      "JUN",
                      "JUL",
                      "AGO",
                      "SET",
                      "OUT",
                      "NOV",
                      "DEZ",
                    ][parseInt(createdAt.substring(3, 5)) - 1]
                  }{" "}
                  de {createdAt.substring(6, 10)}
                </Text>
              ) : (
                <Text
                  style={{
                    maxWidth: "95%",
                    color: "#FF000080",
                    marginHorizontal: 16,
                    fontSize: 14,
                  }}
                >
                  Em análise
                </Text>
              )
            ) : (
              <>
                <Text
                  style={{
                    maxWidth: "95%",
                    color: "#80808090",
                    marginHorizontal: 16,
                    fontSize: 14,
                  }}
                >
                  Aprovado em {dataValidacao.substring(0, 2)} de{" "}
                  {
                    [
                      "JAN",
                      "FEV",
                      "MAR",
                      "ABR",
                      "MAI",
                      "JUN",
                      "JUL",
                      "AGO",
                      "SET",
                      "OUT",
                      "NOV",
                      "DEZ",
                    ][parseInt(dataValidacao.substring(3, 5)) - 1]
                  }{" "}
                  de{" "}
                  {dataValidacao.substring(6, 10) +
                    " às " +
                    dataValidacao.substring(11, 16)}
                </Text>
                {dataExpiracao &&
                  new Date(
                    `${dataExpiracao.substring(6, 10)}-${dataExpiracao.substring(
                      3,
                      5
                    )}-${dataExpiracao.substring(0, 2)}`
                  ) >= new Date() ? (
                  <Text
                    style={{
                      maxWidth: "95%",
                      color: "#FF000080",
                      marginHorizontal: 16,
                      fontSize: 14,
                    }}
                  >
                    Expira em {dataExpiracao.substring(0, 2)} de{" "}
                    {
                      [
                        "JAN",
                        "FEV",
                        "MAR",
                        "ABR",
                        "MAI",
                        "JUN",
                        "JUL",
                        "AGO",
                        "SET",
                        "OUT",
                        "NOV",
                        "DEZ",
                      ][parseInt(dataExpiracao.substring(3, 5)) - 1]
                    }{" "}
                    de {dataExpiracao.substring(6, 10)}
                  </Text>
                ) : null}
              </>
            )}
          </View>
          {!["e", "em"].includes(tipo) && (pesquisaSatisfacao ? (
            <View style={{
              flexDirection: "row", alignItems: "center",
              position: "absolute", right: '5%', top: '4%',
              backgroundColor: '#FFFFFF', padding: 4, borderRadius: 8
            }}>
              <Text style={{
                fontSize: 18,
                lineHeight: 30,
                color: "black",
                fontWeight: "bold",
                marginRight: 5
              }}>{pesquisaSatisfacao.toFixed(1)}</Text>

              <Icon type='font-awesome' name='star' color='gold' />
            </View>
          ) : (
            <View style={{
              flexDirection: "row", alignItems: "center",
              position: "absolute", right: '5%', top: '6%',
              backgroundColor: '#FFFFFF', padding: 4, borderRadius: 8
            }}>
              <TouchableOpacity onPress={toggleOverlay}>
                <Icon type='font-awesome' name='star-o' color='lightgrey' />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

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
                      checked={atendimento >= 1 ? true : false}
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
                      checked={atendimento >= 2 ? true : false}
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
                      checked={atendimento >= 3 ? true : false}
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
                      checked={atendimento >= 4 ? true : false}
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
                      checked={atendimento >= 5 ? true : false}
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
                      checked={limpeza >= 1 ? true : false}
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
                      checked={limpeza >= 2 ? true : false}
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
                      checked={limpeza >= 3 ? true : false}
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
                      checked={limpeza >= 4 ? true : false}
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
                      checked={limpeza >= 5 ? true : false}
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
                      checked={qualidade >= 1 ? true : false}
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
                      checked={qualidade >= 2 ? true : false}
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
                      checked={qualidade >= 3 ? true : false}
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
                      checked={qualidade >= 4 ? true : false}
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
                      checked={qualidade >= 5 ? true : false}
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
                      checked={variedade >= 1 ? true : false}
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
                      checked={variedade >= 2 ? true : false}
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
                      checked={variedade >= 3 ? true : false}
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
                      checked={variedade >= 4 ? true : false}
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
                      checked={variedade >= 5 ? true : false}
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
                      checked={preco >= 1 ? true : false}
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
                      checked={preco >= 2 ? true : false}
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
                      checked={preco >= 3 ? true : false}
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
                      checked={preco >= 4 ? true : false}
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
                      checked={preco >= 5 ? true : false}
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
                    toggleOverlay()
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
          isVisible={pesquisaFinalizada}
          onBackdropPress={() => {
            toggleOverlay();
            setPesquisa(false);
            setPesquisaFinalizada(false);
            if (onRefresh) onRefresh();
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
            <Button
              label="OK"
              onPress={() => {
                toggleOverlay();
                setPesquisa(false);
                setPesquisaFinalizada(false);
                if (onRefresh) onRefresh();
              }}
              marginTop={24}
              backgroundColor={"#005098"}
              width={"60%"}
              textColor={"#FFFFFF"}
              padding={16}
              fontSize={16}
              borderRadius={32}
              fontWeight={"bold"}
            />
          </View>
        </Overlay>
      )}
    </>
  );
};

export const PedidoCard = memo(PedidoCardComponent);
