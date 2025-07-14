import { View, ScrollView, Image, Platform, StatusBar } from "react-native";
import { styles } from "../confirmacao-cadastro-loja/ConfirmacaoCadastroLojaStyles";
import { Text } from "react-native-elements";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import axios from "axios";
import usePersist from "../../hooks/usePersist";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { API_URL } from "../../const/apiUrl";

export default function AtualizarDadosLojaSucesso({ navigation, route }) {
  const {
    id,
    razaoSocial,
    nomeFantasia,
    cnpj,
    cpf,
    inscricaoEstadual,
    nomeResponsavel,
    numeroContato,
    categoria,
    ativa,
    pontos,
    expiracaoPontosConsumo,
    expiracaoPontosProduto,
    imagem,
    imagemAtual,
    regulamento,
    cep,
    logradouro,
    complemento,
    bairro,
    uf,
    latitude,
    longitude,
  } = route.params;

  const { tokenStored } = usePersist();

  async function atualizarDadosLoja() {
    const formData = new FormData();

    const dadosAPI = {
      razaoSocial: razaoSocial,
      nomeFantasia: nomeFantasia,
      cnpj: cnpj,
      cpf: cpf,
      nomeResponsavel: nomeResponsavel,
      numeroContato: numeroContato,
      inscricaoEstadual: inscricaoEstadual,
      ativa: ativa,
      imagem: imagem
        ? {
          name: imagem.fileName,
          type: imagem.type,
          uri:
            Platform.OS === "android"
              ? imagem.uri
              : imagem.uri.replace("file://", ""),
        }
        : imagemAtual,
      categoriaId: categoria,
      regraDePontos: pontos,
      expiracaoPontosManuais: expiracaoPontosConsumo,
      expiracaoPontos: expiracaoPontosProduto,
      regulamento: regulamento,
    };

    Object.entries(dadosAPI).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await axios
      .put(
        `${API_URL.base}/lojas/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${tokenStored}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(async () => {
        try {
          await axios.put(
            `${API_URL.base}/lojas/${id}/endereco`,
            {
              latitude: latitude,
              longitude: longitude,
              cep: cep,
              logradouro: logradouro,
              complemento: complemento,
              bairro: bairro,
              uf: uf,
            },
            {
              headers: {
                Authorization: `Bearer ${tokenStored}`,
              },
            }
          );
        } catch (error) {
        }
      })
      .then(() => {
        mostrarMensagem("Loja atualizada\nRedirecionando...");
        setTimeout(() => navigation.navigate("OpcoesLoja", {
          id: id
        }), 1500);
      })
      .catch((error) => {
        const errResponse =
          (error && error.response && error.response.data) ||
          (error && error.message);
      });
  }

  const mostrarMensagem = (mensagem) => {
    showMessage({
      message: "Sucesso",
      description: mensagem,
      type: "success",
      style: { height: "100%" },
      titleStyle: {
        fontWeight: "bold",
        fontSize: 20,
        justifyContent: "center",
        marginTop: "auto",
        alignSelf: "center",
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        backgroundColor="#005098"
        barStyle="light-content"
      />
      <Header
        title={"FIDELIZE PE"}
        icon={true}
        onPress={() => navigation.goBack()}
      />
      <View>
        <FlashMessage
          textStyle={{
            fontSize: 20,
            justifyContent: "center",
            alignSelf: "center",
            marginTop: "auto",
            textAlign: "center",
          }}
          duration={1500}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.text}>
          <Text style={styles.textH3}>Confirmar Informações</Text>
        </View>
        <View style={styles.details}>
          <View style={styles.textContainer}>
            {razaoSocial && (
              <>
                <Text style={styles.textTitulo}>Razão Social</Text>
                <Text style={styles.textInfoUsuario}>{razaoSocial}</Text>
              </>
            )}
            {nomeFantasia && (
              <>
                <Text style={styles.textTitulo}>Nome Fantasia</Text>
                <Text style={styles.textInfoUsuario}>{nomeFantasia}</Text>
              </>
            )}
            {cnpj && (
              <>
                <Text style={styles.textTitulo}>CNPJ</Text>
                <Text style={styles.textInfoUsuario}>{cnpj}</Text>
              </>
            )}
            {cpf && (
              <>
                <Text style={styles.textTitulo}>CPF</Text>
                <Text style={styles.textInfoUsuario}>{cpf}</Text>
              </>
            )}
            {inscricaoEstadual && (
              <>
                <Text style={styles.textTitulo}>Inscrição estadual</Text>
                <Text style={styles.textInfoUsuario}>{inscricaoEstadual}</Text>
              </>
            )}
            {nomeResponsavel && (
              <>
                <Text style={styles.textTitulo}>Nome do Responsavel</Text>
                <Text style={styles.textInfoUsuario}>{nomeResponsavel}</Text>
              </>
            )}
            {regulamento && (
              <>
                <Text style={styles.textTitulo}>Regulamento</Text>
                <Text style={styles.textInfoUsuario}>{regulamento}</Text>
              </>
            )}
            {numeroContato && (
              <>
                <Text style={styles.textTitulo}>Número para contato</Text>
                <Text style={styles.textInfoUsuario}>{numeroContato}</Text>
              </>
            )}
            {categoria && (
              <>
                <Text style={styles.textTitulo}>Categoria</Text>
                <Text style={styles.textInfoUsuario}>{categoria}</Text>
              </>
            )}
            {pontos && (
              <>
                <Text style={styles.textTitulo}>Pontos</Text>
                <Text style={styles.textInfoUsuario}>{pontos}</Text>
              </>
            )}
            {expiracaoPontosConsumo && (
              <>
                <Text style={styles.textTitulo}>Expiração dos pontos</Text>
                <Text style={styles.textInfoUsuario}>
                  {expiracaoPontosConsumo}
                </Text>
              </>
            )}
            {expiracaoPontosProduto && (
              <>
                <Text style={styles.textTitulo}>Expiração dos tickets</Text>
                <Text style={styles.textInfoUsuario}>
                  {expiracaoPontosProduto}
                </Text>
              </>
            )}
            {imagem.uri && (
              <>
                <Text style={styles.textImage}>Imagem escolhida</Text>
                <Image style={styles.image} source={{ uri: imagem.uri }} />
              </>
            )}

            {cep && (
              <>
                <Text style={styles.textTitulo}>CEP</Text>
                <Text style={styles.textInfoUsuario}>{cep}</Text>
              </>
            )}
            {logradouro && (
              <>
                <Text style={styles.textTitulo}>Logradouro</Text>
                <Text style={styles.textInfoUsuario}>{logradouro}</Text>
              </>
            )}

            {complemento && (
              <>
                <Text style={styles.textTitulo}>Complemento</Text>
                <Text style={styles.textInfoUsuario}>{complemento}</Text>
              </>
            )}
            {bairro && (
              <>
                <Text style={styles.textTitulo}>Bairro</Text>
                <Text style={styles.textInfoUsuario}>{bairro}</Text>
              </>
            )}

            {uf && (
              <>
                <Text style={styles.textTitulo}>UF</Text>
                <Text style={styles.textInfoUsuario}>{uf}</Text>
              </>
            )}
            {latitude && (
              <>
                <Text style={styles.textTitulo}>Latitude</Text>
                <Text style={styles.textInfoUsuario}>{latitude}</Text>
              </>
            )}
            {longitude && (
              <>
                <Text style={styles.textTitulo}>Longitude</Text>
                <Text style={styles.textInfoUsuario}>{longitude}</Text>
              </>
            )}
          </View>
        </View>

        <Button
          label={"Finalizar"}
          backgroundColor={"#005098"}
          borderRadius={50}
          onPress={atualizarDadosLoja}
          fontSize={14}
          fontWeight="bold"
          textColor={"white"}
          width={250}
          padding={18}
          marginTop={12}
          marginBottom={12}
        />
        <Button
          label={"Cancelar"}
          borderRadius={50}
          backgroundColor={"#DCDCDC"}
          onPress={() => navigation.navigate("MinhasLojas")}
          fontSize={14}
          fontWeight="bold"
          textColor={"black"}
          width={250}
          padding={18}
        />
      </ScrollView>
      <Nav />
    </View>
  );
}
