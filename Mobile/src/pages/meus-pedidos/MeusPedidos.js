import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from "react-native";
import { styles } from "./meusPedidosStyle";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import usePersist from "../../hooks/usePersist";
import { PedidoCard } from "../../components/pedidoCard/PedidoCard";
import { Skelleton } from "../../components/skelleton/Skelleton";
import { SkelletonItens } from "../../const/skelletonItens";
import { Icon } from "react-native-elements";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Data } from "../../components/datas/Data";
import { API_URL } from "../../const/apiUrl";
import ScreenContainer from "../../components/screenContainer/ScreenContainer";


export default function MeusPedidos({ navigation, route }) {
  const [getData, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { tokenStored } = usePersist();

  const [dataFinalVisivel, setDataFinalVisivel] = useState(false);
  const [dataInicioVisivel, setDataInicioVisivel] = useState(false);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());

  const dataInicioTratada = `${dataInicio.getFullYear()}-${String(
    dataInicio.getMonth() + 1
  ).padStart(2, "0")}-${dataInicio.getDate().toString().padStart(2, "0")}`;

  const dataFinalTratada = `${dataFinal.getFullYear()}-${String(
    dataFinal.getMonth() + 1
  ).padStart(2, "0")}-${dataFinal.getDate().toString().padStart(2, "0")}`;

  const mostrarDataInicio = () => {
    setDataInicioVisivel(true);
  };

  const esconderDataInicio = () => {
    setDataInicioVisivel(false);
  };

  const mostrarDataFinal = () => {
    setDataFinalVisivel(true);
  };
  const esconderDataFinal = () => {
    setDataFinalVisivel(false);
  };

  const confirmarDataInicio = (date) => {
    setDataInicio(date);
    esconderDataInicio();
    setIsLoading(true);
  };

  const confirmarDataFinal = (date) => {
    setDataFinal(date);
    setIsLoading(true);
    esconderDataFinal();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const listaPedidos = async () => {
      await axios
        .get(`${API_URL.base}/usuario/pedidos`, {
          headers: { Authorization: `Bearer ${tokenStored}` },
          params: {
            dataInicio: dataInicioTratada,
            dataFim: dataFinalTratada,
          },
        })
        .then((res) => {
          setData(res?.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(true);
        });
    };
    listaPedidos();
  }, [dataInicio, dataFinal, isLoading, refreshing]);

  return (
    <ScreenContainer>
      <Header
        title={"FIDELIZE PE"}
        icon={true}
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 16,
            marginBottom: 10,
          }}
        >
          <Data
            data={`${dataInicio.getDate().toString().padStart(2, "0")}/${String(
              dataInicio.getMonth() + 1
            ).padStart(2, "0")}/${dataInicio.getFullYear()}`}
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
            data={`${dataFinal.getDate().toString().padStart(2, "0")}/${String(
              dataFinal.getMonth() + 1
            ).padStart(2, "0")}/${dataFinal.getFullYear()}`}
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
        </View>
        {isLoading ? (
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
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
          <View style={styles.containerProdutos}>
            {getData?.map((pedido) => (
              <PedidoCard pedido={pedido} key={pedido?.id} onRefresh={() => setIsLoading(true)} />
            ))}
          </View>
        )}
      </ScrollView>

      <Nav meusPedidos={true} />
    </ScreenContainer>
  );
}
