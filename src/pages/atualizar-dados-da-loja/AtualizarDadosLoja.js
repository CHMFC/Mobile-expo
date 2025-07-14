import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Icon, Overlay } from "react-native-elements";
import Button from "../../components/button/Button";
import Form from "../../components/form/Form";
import Header from "../../components/header/Header";
import Input from "../../components/input/Input";
import Nav from "../../components/nav/Nav";
import { API_URL } from "../../const/apiUrl";
import useCategory from "../../hooks/useCategory";
import usePersist from "../../hooks/usePersist";
import { styles } from "./atualizarDadosLojaStyles";

export default function AtualizarDadosLoja({ navigation, route }) {
    const { id, imagemAtual, comprovanteAtual } = route.params;
    const [razaoSocial, setRazaoSocial] = useState("");
    const [nomeFantasia, setNomeFantasia] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [cpf, setCpf] = useState("");
    const [inscricaoEstadual, setInscricaoEstadual] = useState("");
    const [nomeResponsavel, setNomeResponsavel] = useState("");
    const [numeroContato, setNumeroContato] = useState("");
    const [expiracaoPontosProduto, setExpiracaoPontosProduto] = useState("");
    const [expiracaoPontosConsumo, setExpiracaoPontosConsumo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [pontos, setPontos] = useState("");
    const [imagem, setImagem] = useState(null);
    const [inseridoImagem, setInseridoImagem] = useState("");
    const [ativa, setAtiva] = useState(true);
    const [visible, setVisible] = useState(false);

    const [infoLoja, setInfoLoja] = useState({});

    const { tokenStored } = usePersist();
    const { selectedCategory } = useCategory();

    useEffect(() => {
        if (!id || !tokenStored) return;
        async function resgatarDadosDaLoja() {
            try {
                const response = await axios.get(`${API_URL.base}/lojas/${id}`, {
                    headers: { Authorization: `Bearer ${tokenStored}` },
                });
                setInfoLoja(response.data);
            } catch (err) {
                console.log("Erro ao buscar dados da loja:", err);
            }
        }
        resgatarDadosDaLoja();
    }, [id, tokenStored]);

    const inserirImagemDaLoja = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Desculpe, precisamos da sua permissão para acessar a galeria!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImagem(result.assets[0]);
            setInseridoImagem("Inserido");
        }
    };

    function navegarLojaEndereco() {
        navigation.navigate("AtualizarRegulamento", {
            id,
            razaoSocial: razaoSocial || infoLoja.razaoSocial,
            nomeFantasia: nomeFantasia || infoLoja.nomeFantasia,
            cnpj: cnpj || infoLoja.cnpj,
            cpf: cpf || infoLoja.cpf,
            inscricaoEstadual: inscricaoEstadual || infoLoja.inscricaoEstadual,
            nomeResponsavel: nomeResponsavel || infoLoja.nomeResponsavel,
            numeroContato: numeroContato || infoLoja.numeroContato,
            categoria: categoria || infoLoja.categoriaId,
            ativa,
            pontos: pontos || infoLoja.regraDePontos,
            expiracaoPontosConsumo: expiracaoPontosConsumo || infoLoja.expiracaoPontosManuais,
            expiracaoPontosProduto: expiracaoPontosProduto || infoLoja.expiracaoPontos,
            imagem,
            imagemAtual,
            comprovanteAtual,
            infoLoja,
        });
    }

    const toggleOverlay = () => {
        setVisible(!visible);
    };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, height: "100%", paddingTop: StatusBar.currentHeight }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "white" }}
      >
        <Header
          title={"FIDELIZE PE"}
          icon={true}
          onPress={() => navigation.goBack()}
        />

        <Text style={styles.title}>Alterar dados da loja</Text>

        <View style={styles.container}>
          <Form>
            <Input
              title={"Razão Social"}
              onChangeText={(text) => setRazaoSocial(text)}
              placeholder={infoLoja.razaoSocial}
              disabled={true}
            />
            <Input
              title={"Nome Fantasia"}
              onChangeText={(text) => setNomeFantasia(text)}
              placeholder={infoLoja.nomeFantasia}
              disabled={true}
            />

            {infoLoja.cnpj && (
              <Input
                title={"CNPJ"}
                maskType={"cnpj"}
                onChangeText={(text) => setCnpj(text)}
                placeholder={infoLoja.cnpj}
                disabled={true}
              />
            )}

            {infoLoja.cpf && (
              <Input
                title={"CPF"}
                maskType={"cpf"}
                onChangeText={(text) => setCpf(text)}
                value={infoLoja.cpf}
                disabled={true}
              />
            )}
            <Input
              title={"Inscrição Estadual"}
              onChangeText={(text) => setInscricaoEstadual(text)}
              value={inscricaoEstadual}
              placeholder={infoLoja.inscricaoEstadual}
            />
            <Input
              title={"Nome do responsável"}
              onChangeText={(text) => setNomeResponsavel(text)}
              value={nomeResponsavel}
              placeholder={infoLoja.nomeResponsavel}
            />
            <Input
              title={"Número para contato"}
              onChangeText={(text) => setNumeroContato(text)}
              value={numeroContato}
              placeholder={infoLoja.numeroContato}
              maskType={"cel-phone"}
            />

            <Text style={styles.label}>Selecione a categoria</Text>
            <View style={styles.picker}>
              <Picker
                style={{ color: "#005098", width: "100%" }}
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
              >
                <Picker.Item label="Categoria da Empresa" value="" />
                {selectedCategory.map((data) => (
                  <Picker.Item
                    label={data?.nome}
                    value={data?.id}
                    key={data?.id}
                  />
                ))}
              </Picker>
            </View>

            <Input
              title={"Expiração de tickets"}
              placeholder={`${infoLoja.expiracaoPontos} dias`}
              maskType={"only-numbers"}
              onChangeText={(item) => setExpiracaoPontosProduto(item)}
              value={expiracaoPontosProduto}
            />

            <Input
              title={"Expiração de pontos"}
              placeholder={`${infoLoja.expiracaoPontosManuais} dias`}
              maskType={"only-numbers"}
              onChangeText={(item) => setExpiracaoPontosConsumo(item)}
              value={expiracaoPontosConsumo}
            />

            <Button
              activeOpacity={1}
              onPress={() => inserirImagemDaLoja()}
              label={
                inseridoImagem
                  ? "✔️ Imagem inserida"
                  : "Escolher imagem da loja"
              }
              backgroundColor={inseridoImagem ? "#7AFF9B" : "#DCDCDC"}
              width={"100%"}
              textColor={inseridoImagem ? "#313131" : "#515151"}
              padding={24}
              fontSize={16}
              borderRadius={32}
              fontWeight={"bold"}
              marginBottom={16}
            />

            <SafeAreaView
              style={{
                width: "100%",
                borderColor: "#dcdcdc",
                borderWidth: 1,
                borderRadius: 25,
                marginHorizontal: 8,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  display: "flex",
                  padding: 8,
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text>Regra de pontos</Text>
                </View>
                <TouchableOpacity onPress={toggleOverlay}>
                  <Icon
                    name="information-circle"
                    type="ionicon"
                    size={24}
                    color={"#005098"}
                    style={{ marginLeft: "5%", elevation: 10 }}
                  />
                </TouchableOpacity>
              </View>

              <Overlay
                isVisible={visible}
                overlayStyle={{ width: "90%" }}
                onBackdropPress={toggleOverlay}
              >
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    Como funciona a regra de pontos?
                  </Text>
                  <Text>
                    Você define aqui quantos pontos o seu cliente ganhará a cada
                    real gasto, bem como, qual será o benefício e com quantos
                    pontos ele ganhará. {"\n\n"}Exemplos: {"\n\n"}1 real = 1
                    ponto {"\n"}1 real = 2 pontos {"\n"}E assim em diante.
                  </Text>
                </View>
              </Overlay>

              <SafeAreaView style={{ width: "90%" }}>
                <Input
                  placeholder={`${infoLoja.regraDePontos}`}
                  title={"Pontos"}
                  onChangeText={(text) => setPontos(text)}
                  value={pontos}
                  keyboardType={"numeric"}
                />
              </SafeAreaView>
            </SafeAreaView>

            <Button
              onPress={navegarLojaEndereco}
              label={"Avançar"}
              backgroundColor={"#005098"}
              width={"100%"}
              textColor={"#FFFFFF"}
              padding={20}
              fontSize={16}
              borderRadius={50}
              fontWeight={"bold"}
              marginTop={16}
            />
          </Form>
        </View>
      </ScrollView>
      <Nav />
    </KeyboardAvoidingView>
  );
}
