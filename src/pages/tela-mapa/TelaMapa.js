import { useEffect, useState } from "react";
import { FlatList, StatusBar, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { CategoriesInfo } from "../../components/categoriesInfo/CategoriesInfo";
import Header from "../../components/header/Header";
import useCategory from "../../hooks/useCategory";
import useShop from "../../hooks/useShop";

import * as Location from 'expo-location';

export default function TelaMapa({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [totalData, setTotalData] = useState([]);
  const [isFiltered, setIsFiltered] = useState([]);
  const [mapFilter, setMapFilter] = useState([]);
  const { getFilteredData, getAllData } = useShop();
  const { selectedCategory } = useCategory();

  useEffect(() => {
    try {
      setTotalData(getAllData);
      setIsFiltered(getFilteredData);
    } catch (error) {
      console.error(error);
    }
  }, [getAllData, getFilteredData]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('A permissão para acessar a localização foi negada');
        console.log('Permissão negada');
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        console.error("Erro ao obter localização:", error);
        setErrorMsg('Não foi possível obter a localização');
      }
    })();
  }, []);


  const filter = (nome) => {
    const filterData = getAllData.filter(
      (loja) => loja?.categoria?.nome === nome
    );
    setMapFilter(filterData);
    setTotalData([]); // Limpa os outros filtros para dar prioridade a este
    setIsFiltered([]);
  };
  return (
    <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <Header
        icon={true}
        title={"Lojas próximas"}
        onPress={() => navigation.goBack()}
      />
      {location && (
        <MapView
          style={{
            flex: 1,
          }}
          loadingEnabled={true}
          region={{
            latitude: latitude,
            longitude: longitude,

            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        >
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            title={"Você"}
            pinColor={"#005098"}
          />

          {mapFilter &&
            mapFilter.map((loja) => (
              <Marker
                key={loja?.id}
                coordinate={{
                  latitude: parseFloat(loja?.endereco?.latitude),
                  longitude: parseFloat(loja?.endereco?.longitude),
                }}
                title={loja?.razaoSocial}
              />
            ))}

          {isFiltered.length > 0
            ? isFiltered.map((loja) => (
                <Marker
                  key={loja?.id}
                  coordinate={{
                    latitude: parseFloat(loja?.endereco?.latitude),
                    longitude: parseFloat(loja?.endereco?.longitude),
                  }}
                  title={loja?.razaoSocial}
                />
              ))
            : totalData.map((loja) => (
                <Marker
                  key={loja?.id}
                  coordinate={{
                    latitude: parseFloat(loja?.endereco?.latitude),
                    longitude: parseFloat(loja?.endereco?.longitude),
                  }}
                  title={loja?.razaoSocial}
                />
              ))}
        </MapView>
      )}

      {!location && (
        <MapView
          style={{
            flex: 1,
          }}
          loadingEnabled={true}
          region={{
            latitude: -8.0563835,
            longitude: -34.8854503,

            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        >
          {mapFilter &&
            mapFilter.map((loja) => (
              <Marker
                key={loja?.id}
                coordinate={{
                  latitude: parseFloat(loja?.endereco?.latitude),
                  longitude: parseFloat(loja?.endereco?.longitude),
                }}
                title={loja?.razaoSocial}
              />
            ))}

          {isFiltered.length > 0
            ? isFiltered.map((loja) => (
                <Marker
                  key={loja?.id}
                  coordinate={{
                    latitude: parseFloat(loja?.endereco?.latitude),
                    longitude: parseFloat(loja?.endereco?.longitude),
                  }}
                  title={loja?.razaoSocial}
                />
              ))
            : totalData.map((loja) => (
                <Marker
                  key={loja?.id}
                  coordinate={{
                    latitude: parseFloat(loja?.endereco?.latitude),
                    longitude: parseFloat(loja?.endereco?.longitude),
                  }}
                  title={loja?.razaoSocial}
                />
              ))}
        </MapView>
      )}

      <View style={{ paddingVertical: 10 }}>
        <FlatList
          data={selectedCategory}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={{ alignItems: "center" }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoriesInfo
              imagem={item?.imagem}
              label={item?.nome}
              onPress={() => filter(item?.nome)}
            />
          )}
        />
      </View>
    </View>
  );
}
