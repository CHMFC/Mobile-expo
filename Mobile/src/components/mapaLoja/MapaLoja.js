import React, { memo } from "react";
import MapView, { Marker } from "react-native-maps";

export const MapaLojaComponent = ({ loja }) => {
  return (
    <MapView
      style={{ height: 160 }}
      loadingEnabled={true}
      region={{
        latitude: parseFloat(loja?.endereco?.latitude),
        longitude: parseFloat(loja?.endereco?.longitude),

        latitudeDelta: 0.04,
        longitudeDelta: 0.05,
      }}
    >
      <Marker
        coordinate={{
          latitude: parseFloat(loja?.endereco?.latitude),
          longitude: parseFloat(loja?.endereco?.longitude),
        }}
        title={loja?.nomeFantasia}
      />
    </MapView>
  );
};

export const MapaLoja = memo(MapaLojaComponent);
