import React, { useEffect, useState } from "react";
import { FlatList, View, PermissionsAndroid } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Header from "../../components/header/Header";
import { CategoriesInfo } from "../../components/categoriesInfo/CategoriesInfo";
import useShop from "../../hooks/useShop";
import Geolocation from "@react-native-community/geolocation";
import useCategory from "../../hooks/useCategory";
import { StatusBar } from "react-native";

export default function TelaMapa({ navigation }) {
  const [location, setLocation] = useState(false);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
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
    }
  }, []);

  useEffect(() => {
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
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    };
    requestLocationPermission();

    const getLocation = async () => {
      const result = requestLocationPermission();
      result.then((res) => {
        if (res) {
          Geolocation.getCurrentPosition(
            (position) => {
              setLocation(position);
              setLatitude(position?.coords?.latitude);
              setLongitude(position?.coords?.longitude);
            },
            (error) => {
              setLocation(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        }
      });
    };
    getLocation();
  }, []);

  const filter = (nome) => {
    const filterData = getAllData.filter(
      (loja) => loja?.categoria?.nome === nome
    );
    setMapFilter(filterData);
    setTotalData([]);
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
                title={loja?.nomeFantasia}
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
                  title={loja?.nomeFantasia}
                />
              ))
            : totalData.map((loja) => (
                <Marker
                  key={loja?.id}
                  coordinate={{
                    latitude: parseFloat(loja?.endereco?.latitude),
                    longitude: parseFloat(loja?.endereco?.longitude),
                  }}
                  title={loja?.nomeFantasia}
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
                title={loja?.nomeFantasia}
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
                  title={loja?.nomeFantasia}
                />
              ))
            : totalData.map((loja) => (
                <Marker
                  key={loja?.id}
                  coordinate={{
                    latitude: parseFloat(loja?.endereco?.latitude),
                    longitude: parseFloat(loja?.endereco?.longitude),
                  }}
                  title={loja?.nomeFantasia}
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
