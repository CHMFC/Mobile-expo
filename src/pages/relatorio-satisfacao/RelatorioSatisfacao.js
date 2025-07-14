import axios from "axios";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Icon, Overlay } from "react-native-elements";
import { PieChart } from "react-native-gifted-charts";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Data } from "../../components/datas/Data";
import { Header } from "../../components/header/Header";
import { Nav } from "../../components/nav/Nav";
import usePersist from "../../hooks/usePersist";

// 1. Importações corrigidas
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { API_URL } from "../../const/apiUrl";

export function RelatorioSatisfacao({ navigation, route }) {
  const { lojaId, printUrl, lojaNome, lojaImagem } = route.params;

  // 2. Lógica de compartilhamento movida para uma função async
  const handleShare = async () => {
    if (!printUrl) {
      alert("URL do relatório não encontrada.");
      return;
    }

    const fileName = "relatorio-de-satisfacao.pdf";
    const localUri = FileSystem.cacheDirectory + fileName;

    try {
      // Baixa o arquivo para o dispositivo
      const { uri } = await FileSystem.downloadAsync(printUrl, localUri);

      // Verifica se o compartilhamento está disponível
      if (!(await Sharing.isAvailableAsync())) {
        alert("O compartilhamento não está disponível neste dispositivo.");
        return;
      }
      
      // Abre a tela de compartilhamento
      await Sharing.shareAsync(uri, {
        dialogTitle: "Compartilhar Relatório de Satisfação",
        mimeType: 'application/pdf', // Mude se o formato for outro
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      alert("Ocorreu um erro ao tentar compartilhar o relatório.");
    }
  };

  const [dadosClientes, setDadosClientes] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataFinalVisivel, setDataFinalVisivel] = useState(false);
  const [dataInicioVisivel, setDataInicioVisivel] = useState(false);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());

  const [tokenCelularAtivos, setTokenCelularAtivos] = useState(new Set());
  const [tokenCelularInativos, setTokenCelularInativos] = useState(new Set());

  const { tokenStored } = usePersist();

  const dataInicioTratada = `${dataInicio.getFullYear()}-${String(
    dataInicio.getMonth() + 1
  ).padStart(2, "0")}-${dataInicio.getDate().toString().padStart(2, "0")}`;

  const dataFinalTratada = `${dataFinal.getFullYear()}-${String(
    dataFinal.getMonth() + 1
  ).padStart(2, "0")}-${dataFinal.getDate().toString().padStart(2, "0")}`;

  const mostrarDataInicio = () => setDataInicioVisivel(true);
  const esconderDataInicio = () => setDataInicioVisivel(false);
  const mostrarDataFinal = () => setDataFinalVisivel(true);
  const esconderDataFinal = () => setDataFinalVisivel(false);

  const confirmarDataInicio = (date) => {
    setDataInicio(date);
    esconderDataInicio();
  };

  const confirmarDataFinal = (date) => {
    setDataFinal(date);
    esconderDataFinal();
  };

  useEffect(() => {
    if (!tokenStored || !lojaId) return;

    setIsLoading(true);
    async function pegarClientes() {
      try {
        const res = await axios.get(
          `${API_URL.base}/lojas/${lojaId}/pesquisaSatisfacao`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
            params: {
              dataInicio: dataInicioTratada,
              dataFim: dataFinalTratada,
            },
          }
        );
        setDadosClientes(res.data);
        setTokenCelularAtivos(new Set(res.data?.clientes?.respondeu?.clientes?.map(item => item.tokenCelular)));
        setTokenCelularInativos(new Set(res.data?.clientes?.naoRespondeu?.clientes?.map(item => item.tokenCelular)));
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    pegarClientes();
  }, [dataInicio, dataFinal, tokenStored, lojaId]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <Header icon={true} onPress={() => navigation.goBack()} />

      <ScrollView>
        <View
          style={{
            marginTop: 12,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 12,
              marginBottom: 12,
            }}
          >
            <Data
              data={`${dataInicio
                .getDate()
                .toString()
                .padStart(2, "0")}/${String(dataInicio.getMonth() + 1).padStart(
                  2,
                  "0"
                )}/${dataInicio.getFullYear()}`}
              periodo={"início"}
              onPress={mostrarDataInicio}
            />

            <DateTimePickerModal
              isVisible={dataInicioVisivel}
              mode="date"
              date={dataInicio}
              onConfirm={confirmarDataInicio}
              onCancel={esconderDataInicio}
              maximumDate={dataFinal}
            />
            <Data
              data={`${dataFinal
                .getDate()
                .toString()
                .padStart(2, "0")}/${String(dataFinal.getMonth() + 1).padStart(
                  2,
                  "0"
                )}/${dataFinal.getFullYear()}`}
              periodo={"final"}
              onPress={mostrarDataFinal}
            />
            <DateTimePickerModal
              isVisible={dataFinalVisivel}
              mode="date"
              date={dataFinal}
              onConfirm={confirmarDataFinal}
              onCancel={esconderDataFinal}
              minimumDate={dataInicio}
              maximumDate={new Date()}
            />

            <View
              style={{
                backgroundColor: "#1F5A9E",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 30,
                padding: 8,
                borderRadius: 32,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("RelatorioSatisfacaoShare", {
                    lojaId: lojaId,
                    dataComeco: dataInicioTratada,
                    dataFim: dataFinalTratada,
                    lojaNome: lojaNome,
                    lojaImagem: lojaImagem,
                  });
                  setCompartilhar(true);
                }}
              >
                <Icon
                  name="share-social-outline"
                  color="white"
                  type="ionicon"
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              width: "90%",
              backgroundColor: "#1F5A9E",
              padding: 20,
              borderRadius: 16,
              marginBottom: 12,
              height: 100,
            }}
          >
            <View style={{ flexDirection: "column", paddingHorizontal: 16 }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    marginBottom: 4,
                    fontWeight: "bold",
                  }}
                >
                  Total de Pesquisas
                </Text>
                <TouchableOpacity onPress={toggleOverlay}>
                  <Icon
                    name="alert-circle"
                    color="white"
                    type="ionicon"
                    size={16}
                    style={{ marginHorizontal: 4, marginTop: 4 }}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{ color: "white", fontSize: 22, fontWeight: "bold" }}
              >
                {dadosClientes?.totalPesquisas || 0}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "48%",
                backgroundColor: "#1F5A9E",
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 16,
                flexDirection: "row",
              }}
            >
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    marginBottom: 4,
                    fontWeight: "bold",
                  }}
                >
                  Respondidas
                </Text>
                <View style={{ flexDirection: "row", marginTop: 4 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "bold",
                      width: "75%",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {dadosClientes?.respondeu || 0}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: "48%",
                backgroundColor: "#3685e0",
                paddingVertical: 16,
                paddingHorizontal: 24,
                height: 100,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                Não respondidas
              </Text>
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    width: "75%",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {dadosClientes?.naoRespondeu || 0}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              paddingTop: 20,
              paddingLeft: 20,
            }}
          >
            <PieChart
              data={[
                {
                  value: dadosClientes?.porcentagens?.respondeu || 0,
                  color: "#1F5A9E",
                },
                {
                  value: 100 - dadosClientes?.porcentagens?.respondeu || 100,
                  color: "lightgrey",
                },
              ]}
              donut
              radius={80}
              innerRadius={60}
              centerLabelComponent={() => {
                return (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 24,
                        color: "#1F5A9E",
                        fontWeight: "bold",
                      }}
                    >
                      {dadosClientes?.porcentagens?.respondeu || 0}%
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#1F5A9E",
                        fontWeight: "bold",
                      }}
                    >
                      Respondidas
                    </Text>
                  </View>
                );
              }}
            />
            <PieChart
              data={[
                {
                  value: dadosClientes?.porcentagens?.naoRespondeu || 0,
                  color: "#3685e0",
                },
                {
                  value: 100 - dadosClientes?.porcentagens?.naoRespondeu || 100,
                  color: "lightgrey",
                },
              ]}
              donut
              radius={80}
              innerRadius={60}
              centerLabelComponent={() => {
                return (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 24,
                        color: "#3685e0",
                        fontWeight: "bold",
                      }}
                    >
                      {dadosClientes?.porcentagens?.naoRespondeu || 0}%
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#3685e0",
                        fontWeight: "bold",
                      }}
                    >
                      Não Respondidas
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>

        <View
          style={{
            width: "80%",
            marginHorizontal: "10%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "lightgrey",
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                lineHeight: 30,
                color: "black",
                fontWeight: "bold",
              }}
            >
              Atendimento
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 30,
                  color: "black",
                  fontWeight: "bold",
                  marginRight: 5,
                }}
              >
                {dadosClientes?.medias?.atendimento?.media.toFixed(1)}
              </Text>

              <Icon type="font-awesome" name="star" color="gold" />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "lightgrey",
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                lineHeight: 30,
                color: "black",
                fontWeight: "bold",
              }}
            >
              Limpeza
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 30,
                  color: "black",
                  fontWeight: "bold",
                  marginRight: 5,
                }}
              >
                {dadosClientes?.medias?.limpeza?.media.toFixed(1)}
              </Text>

              <Icon type="font-awesome" name="star" color="gold" />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "lightgrey",
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                lineHeight: 30,
                color: "black",
                fontWeight: "bold",
              }}
            >
              Qualidade
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 30,
                  color: "black",
                  fontWeight: "bold",
                  marginRight: 5,
                }}
              >
                {dadosClientes?.medias?.qualidade?.media.toFixed(1)}
              </Text>

              <Icon type="font-awesome" name="star" color="gold" />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "lightgrey",
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                lineHeight: 30,
                color: "black",
                fontWeight: "bold",
              }}
            >
              Variedade
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 30,
                  color: "black",
                  fontWeight: "bold",
                  marginRight: 5,
                }}
              >
                {dadosClientes?.medias?.variedade?.media.toFixed(1)}
              </Text>

              <Icon type="font-awesome" name="star" color="gold" />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                lineHeight: 30,
                color: "black",
                fontWeight: "bold",
              }}
            >
              Preço
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 30,
                  color: "black",
                  fontWeight: "bold",
                  marginRight: 5,
                }}
              >
                {dadosClientes?.medias?.preco?.media.toFixed(1)}
              </Text>

              <Icon type="font-awesome" name="star" color="gold" />
            </View>
          </View>
        </View>
      </ScrollView>

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text style={{ fontSize: 18, fontWeight: "Regular", color: "black" }}>
          Pedidos validados nos últimos 1 ano e 6 meses.
        </Text>
      </Overlay>
      <Nav />
    </SafeAreaView>
  );
}
