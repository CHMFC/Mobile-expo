import { memo } from "react";
import { ScrollView, View, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";
import { Text } from "react-native-elements";
import { loremIpsum } from "../../const/loremIpsum";
import { styles } from "./modalStyle";
import Pdf from 'react-native-pdf';

export default function ModalComponent({ children }) {
  const source = { uri: 'https://storage.googleapis.com/fidelizepe/Teste PDF/documentoComprovacao/1690245947977_SCOTTCLUB-POLÃTICA&TERMOSJUL2023V4.pdf', cache: true };

  return (
    <SafeAreaView style={styles.modal}>
      <ScrollView contentContainerStyle={{ paddingLeft: 5, paddingRight: 5 }}>
        {/* {loremIpsum.map((info) => (
          <View key={info.id} >
            {info.title && <Text style={{ fontWeight: '700', marginTop: 10, marginBottom: 5 }}>{info.title}</Text>}
            {info.subtittle && <Text style={{ fontWeight: '700', marginBottom: 5 }}>{info.subtittle}</Text>}
            {info.tipo != 'manual' ? (
              info.paragrafo && <Text style={{ marginBottom: 10, textAlign: 'justify' }}>{info.paragrafo}{info.email && <Text style={{ color: "#005098" }}>{info.email}</Text>}</Text>
            ) : (
              <Text style={{ marginBottom: 10, textAlign: 'justify' }}>{info.paragrafo1}{<Text style={{ color: "#005098" }}>{info.email}</Text>}{info.paragrafo2}</Text>
            )}
          </View>
        ))} */}

        <Pdf
          trustAllCerts={false}
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
          }}
          onPageChanged={(page, numberOfPages) => {
          }}
          onError={(error) => {
          }}
          onPressLink={(uri) => {
          }}
          style={{
            flex: 1,
            width: 400,
            height: 540,
            marginLeft: -23,
            marginTop: -16
          }} />
      </ScrollView>
      {children}
    </SafeAreaView>
  );
}

export const Modal = memo(ModalComponent);
