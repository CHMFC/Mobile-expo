import { Picker } from "@react-native-picker/picker";
import { CheckBox, Icon, Overlay, Text } from "@rneui/themed";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View
} from "react-native";
import Button from "../../components/button/Button";
import Form from "../../components/form/Form";
import Header from "../../components/header/Header";
import Input from "../../components/input/Input";
import Nav from "../../components/nav/Nav";
import useCategory from "../../hooks/useCategory";
import { styles } from "./cadastroDeLojaSemLojaStyle";

export default function CadastroDeLojaSemLoja({ navigation }) {
  const { selectedCategory } = useCategory();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      razaoSocial: "", nomeFantasia: "", cnpj: "", cpf: "",
      inscricaoEstadual: "", nomeResponsavel: "", numeroContato: "",
      pontos: "", expiracaoPontosProduto: "", expiracaoPontosConsumo: "",
    },
  });

  const [categoria, setCategoria] = useState("");
  const [imagem, setImagem] = useState(null);
  const [inseridoImagem, setInseridoImagem] = useState("");
  const [comprovante, setComprovante] = useState(null);
  const [inseridoComprovante, setInseridoComprovante] = useState("");
  const [ativa] = useState(true);
  const [categoriaError, setCategoriaError] = useState(false);
  const [imagemError, setImagemError] = useState(false);
  const [comprovanteError, setComprovanteError] = useState(false);
  const [selectedIndex, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const inserirImagemDaLoja = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para escolher uma imagem.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
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

  const inserirComprovante = () => {
    Alert.alert(
      "Selecione a fonte da imagem",
      "",
      [
        { text: "Galeria", onPress: () => pickImageFrom("gallery") },
        { text: "Câmera", onPress: () => pickImageFrom("camera") },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const pickImageFrom = async (source) => {
    let result;
    const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        allowsEditing: true,
    };

    if (source === 'gallery') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria.');
            return;
        }
        result = await ImagePicker.launchImageLibraryAsync(options);
    } else { 
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à sua câmera.');
            return;
        }
        result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.canceled) {
        setComprovante(result.assets[0]);
        setInseridoComprovante("Inserido");
    }
  };

  function navegarLojaEndereco(data) {
    let hasError = false;
    if (!categoria) {
      setCategoriaError(true);
      hasError = true;
    } else {
      setCategoriaError(false);
    }
    if (!imagem) {
      setImagemError(true);
      hasError = true;
    } else {
      setImagemError(false);
    }
    if (!comprovante) {
      setComprovanteError(true);
      hasError = true;
    } else {
      setComprovanteError(false);
    }

    if (!hasError) {
      navigation.navigate("CadastroRegulamento", {
        data,
        categoria,
        ativa,
        imagem,
        comprovante,
      });
    }
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  
  return (
    <SafeAreaView
      style={{ backgroundColor: "white", paddingTop: StatusBar.currentHeight }}
    >
      <ScrollView>
        <Header
          title={"Informações da Loja"}
          icon={true}
          onPress={() => navigation.goBack()}
        />

        <View style={styles.container}>
          <Form>
            {errors.razaoSocial && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                Preencha corretamente
              </Text>
            )}

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title={"Razão Social"}
                  obrigatorio={true}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    backgroundColor: "#DCDCDC",
                    width: "100%",
                    borderRadius: 32,
                    padding: 16,
                    marginBottom: 12,
                    color: "#000000",
                    borderColor: errors.razaoSocial && "red",
                    borderWidth: errors.razaoSocial ? 1 : 0,
                  }}
                />
              )}
              name="razaoSocial"
            />
            {errors.nomeFantasia && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                Preencha corretamente
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title={"Nome Fantasia"}
                  obrigatorio={true}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    backgroundColor: "#DCDCDC",
                    width: "100%",
                    borderRadius: 32,
                    padding: 16,
                    marginBottom: 12,
                    color: "#000000",
                    borderColor: errors.nomeFantasia && "red",
                    borderWidth: errors.nomeFantasia ? 1 : 0,
                  }}
                />
              )}
              name="nomeFantasia"
            />

            {errors.cnpj && selectedIndex === 0 && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                Preencha com um CNPJ válido
              </Text>
            )}
            {errors.cpf && selectedIndex === 1 && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                Preencha com um CPF válido
              </Text>
            )}
            <View>
              <Text
                style={{ color: "black", letterSpacing: 0.5, fontSize: 16 }}
              >
                Qual identificação você quer usar ?
              </Text>
              <CheckBox
                checked={selectedIndex === 0}
                title="CNPJ"
                onPress={() => setIndex(0)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{ backgroundColor: "transparent" }}
              />
              <CheckBox
                checked={selectedIndex === 1}
                title="CPF"
                onPress={() => setIndex(1)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{ backgroundColor: "transparent" }}
              />
            </View>

            {selectedIndex == 0 ? (
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    maskType={"cnpj"}
                    obrigatorio={true}
                    title={"CNPJ"}
                    onChangeText={onChange}
                    value={value}
                    style={{
                      backgroundColor: "#DCDCDC",
                      width: "100%",
                      borderRadius: 32,
                      padding: 16,
                      marginBottom: 12,
                      color: "#000000",
                      borderColor: errors.cnpj && "red",
                      borderWidth: errors.cnpj ? 1 : 0,
                    }}
                  />
                )}
                name="cnpj"
              />
            ) : (
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    maskType={"cpf"}
                    obrigatorio={true}
                    title={"CPF"}
                    onChangeText={onChange}
                    value={value}
                    style={{
                      backgroundColor: "#DCDCDC",
                      width: "100%",
                      borderRadius: 32,
                      padding: 16,
                      marginBottom: 12,
                      color: "#000000",
                      borderColor: errors.cpf && "red",
                      borderWidth: errors.cpf ? 1 : 0,
                    }}
                  />
                )}
                name="cpf"
              />
            )}
            {errors.inscricaoEstadual && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                Esse campo não pode ser vazio
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title={"Inscrição Estadual"}
                  obrigatorio={true}
                  placeholder={"Caso não possua digite ISENTO."}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="inscricaoEstadual"
            />

            {errors.nomeResponsavel && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                Nome do responsável não pode ser vazio
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title={"Nome do responsável"}
                  obrigatorio={true}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="nomeResponsavel"
            />

            {errors.numeroContato && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                Número de contato não pode ser vazio
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  maskType={"cel-phone"}
                  obrigatorio={true}
                  title={"Número para contato"}
                  onChangeText={onChange}
                  value={value}
                  placeholder={"Ex: (DDD)987654321"}
                />
              )}
              name="numeroContato"
            />

            {categoriaError && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                A categoria não deve ser vazia
              </Text>
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginRight: "42%",
              }}
            >
              <Text>Selecione a categoria</Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <View style={styles.picker}>
              <Picker
                style={{ color: "#005098", width: "100%" }}
                selectedValue={categoria}
                onValueChange={(itemValue) => {
                  categoria && setcategoriaError(false);
                  setCategoria(itemValue);
                }}
              >
                <Picker.Item key={0} label="Categoria da Empresa" value="" />
                {selectedCategory.map((data) => (
                  <Picker.item
                    key={data?.id}
                    label={data?.nome}
                    value={data?.id}
                  />
                ))}
              </Picker>
            </View>
            {errors.expiracaoPontos && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                Defina em dias a expiração dos tickets.
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title={"Expiração de tickets"}
                  placeholder={"Digite em dias"}
                  maskType={"only-numbers"}
                  obrigatorio={true}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="expiracaoPontosProduto"
            />

            {errors.expiracaoPontos && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                Defina em dias a expiração dos pontos.
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title={"Expiração de pontos"}
                  placeholder={"Digite em dias"}
                  maskType={"only-numbers"}
                  obrigatorio={true}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="expiracaoPontosConsumo"
            />

            {imagemError && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                Selecione uma imagem
              </Text>
            )}
            <Button
              activeOpacity={1}
              onPress={() => {
                imagem && setimagemError(false);
                inserirImagemDaLoja();
              }}
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
            {comprovanteError && (
              <Text
                style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
              >
                Selecione o comprovante
              </Text>
            )}
            <Button
              activeOpacity={1}
              onPress={() => {
                comprovante && setComprovanteError(false);
                inserirComprovante();
              }}
              label={
                inseridoComprovante
                  ? "✔️ Comprovante inserido"
                  : "Inserir comprovante"
              }
              backgroundColor={inseridoComprovante ? "#7AFF9B" : "#DCDCDC"}
              width={"100%"}
              textColor={inseridoComprovante ? "#313131" : "#515151"}
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
              }}
            >
              {errors.pontos && (
                <Text
                  style={{ color: "red", fontWeight: "bold", maxWidth: "100%" }}
                >
                  Os pontos devem ser preenchidos corretamente
                </Text>
              )}

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
                  <Text style={{ color: "red" }}>*</Text>
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

                <Button
                  icon={
                    <Icon
                      name="wrench"
                      type="font-awesome"
                      color="white"
                      size={25}
                      iconStyle={{ marginRight: 10 }}
                    />
                  }
                  title="Start Building"
                  onPress={toggleOverlay}
                />
              </Overlay>

              <SafeAreaView style={{ width: "90%" }}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder={"1"}
                      title={"Pontos"}
                      onChangeText={onChange}
                      value={value}
                      keyboardType={"numeric"}
                    />
                  )}
                  name="pontos"
                />
              </SafeAreaView>
            </SafeAreaView>

            {categoriaError || imagemError || comprovanteError ? (
              <Button
                label={"Avançar"}
                backgroundColor={"#DCDCDC"}
                width={"100%"}
                textColor={"#FFFFFF"}
                padding={20}
                fontSize={16}
                borderRadius={50}
                fontWeight={"bold"}
                marginTop={16}
              />
            ) : (
              <Button
                onPress={handleSubmit(navegarLojaEndereco)}
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
            )}
          </Form>
        </View>
      </ScrollView>
      <Nav />
    </SafeAreaView>
  );
}
