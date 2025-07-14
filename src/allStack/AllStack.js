import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from "react";
import { Platform, StatusBar } from 'react-native';
import { AtualizarRegulamento } from "../pages/atualizar-regulamento-loja/AtualizarRegulamento";
import CadastrarFuncionarioSucesso from "../pages/cadastro-de-funcionario/CadastrarFuncionarioSucesso";
import { CadastroRegulamento } from "../pages/cadastro-regulamento/CadastroRegulamento";
import { Carregando } from "../pages/carregando/Carregando";
import ConfirmarConsumacao from "../pages/confirmar-consumacao/ConfirmarConsumacao";
import ConfirmarResgate from "../pages/confirmar-resgate/ConfirmarResgate";
import ConfirmarUpdateProduto from "../pages/confirmar-update-produto/ConfirmarUpdateProduto";
import DenuncieUmaLoja from "../pages/denuncie-uma-loja/DenuncieUmaLoja";
import { EnviarMensagem } from "../pages/enviar-mensagem/EnviarMensagem";
import HistoricoPontos from "../pages/historicoPontos/HistoricoPontos";
import { Notificacoes } from "../pages/notificacoes/Notificacoes";
import PesquisaSatisfacao from "../pages/pesquisa-satisfacao/PesquisaSatisfacao";
import { RelatorioAniversariantes } from "../pages/relatorio-aniversariantes/RelatorioAniversariantes";
import { RelatorioAniversariantesShare } from "../pages/relatorio-aniversariantes/RelatorioAniversariantesShare";
import { RelatorioCliente } from "../pages/relatorio-cliente/RelatorioCliente";
import { RelatorioClienteShare } from "../pages/relatorio-cliente/RelatorioClienteShare";
import { RelatorioCurvaABC } from "../pages/relatorio-curvaabc/RelatorioCurvaABC";
import { RelatorioCurvaABCShare } from "../pages/relatorio-curvaabc/RelatorioCurvaABCShare";
import { RelatorioFaixaEtaria } from "../pages/relatorio-faixaetaria/RelatorioFaixaEtaria";
import { RelatorioFaixaEtariaShare } from "../pages/relatorio-faixaetaria/RelatorioFaixaEtariaShare";
import { RelatorioGenero } from "../pages/relatorio-genero/RelatorioGenero";
import { RelatorioGeneroShare } from "../pages/relatorio-genero/RelatorioGeneroShare";
import { RelatorioInatividade } from "../pages/relatorio-inatividade/RelatorioInatividade";
import { RelatorioLocalidade } from "../pages/relatorio-localidade/RelatorioLocalidade";
import RelatorioPedidos from "../pages/relatorio-pedidos/RelatorioPedidos";
import { RelatorioSatisfacao } from "../pages/relatorio-satisfacao/RelatorioSatisfacao";
import { RelatorioSatisfacaoShare } from "../pages/relatorio-satisfacao/RelatorioSatisfacaoShare";
import SuporteScottclub from "../pages/suportScottclub/SuportScottclub.js";
import TicketMedioDiario from "../pages/ticket-medio-diario/CadastroDeProdutos";
import Ajuda from "./../pages/ajuda/Ajuda";
import AtualizarDadosLoja from "./../pages/atualizar-dados-da-loja/AtualizarDadosLoja";
import AtualizarDadosLojaEndereco from "./../pages/atualizar-dados-da-loja/AtualizarDadosLojaEndereco";
import AtualizarDadosLojaSucesso from "./../pages/atualizar-dados-da-loja/AtualizarDadosLojaSucesso";
import BemVindo from "./../pages/bem-vindo/BemVindo";
import CadastroDeFuncionario from "./../pages/cadastro-de-funcionario/CadastroDeFuncionario";
import CadastroDeLojaEndereco from "./../pages/cadastro-de-loja-endereco/CadastroDeLojaEndereco";
import CadastroDeLojaSemLoja from "./../pages/cadastro-de-loja-sem-loja/CadastroDeLojaSemLoja";
import CadastrarPontos from "./../pages/cadastro-de-pontos/CadastrarPontos";
import CadastrarPontosConfirmar from "./../pages/cadastro-de-pontos/CadastrarPontosConfirmar";
import CadastrarPontosManualmente from "./../pages/cadastro-de-pontos/CadastrarPontosManualmente";
import CadastrarPontosSucesso from "./../pages/cadastro-de-pontos/CadastrarPontosSucesso";
import CadastroDeProdutos from "./../pages/cadastro-de-produtos/CadastroDeProdutos";
import ConfirmacaoCadastroLoja from "./../pages/confirmacao-cadastro-loja/ConfirmacaoCadastroLoja";
import ConfirmacaoDeProduto from "./../pages/confirmacao-de-produto/ConfirmacaoDeProduto";
import SucessoAoCadastrarProduto from "./../pages/confirmacao-de-produto/SucessoAoCadastrarProduto";
import ContaUsuario from "./../pages/conta-usuario/ContaUsuario";
import Conta from "./../pages/conta/Conta";
import EditarProduto from "./../pages/editar-produto/EditarProduto";
import FuncionarioLoja from "./../pages/funcionarios-loja/FuncionarioLoja";
import Home from "./../pages/home/Home";
import Login from "./../pages/login/Login";
import LojaConsumacao from "./../pages/loja-consumacao/LojaConsumacao";
import LojaResgate from "./../pages/loja-resgate/LojaResgate";
import MeusPedidos from "./../pages/meus-pedidos/MeusPedidos";
import MinhasLojas from "./../pages/minhas-lojas/MinhasLojas";
import OpcoesLoja from "./../pages/opcoes-loja/OpcoesLoja";
import ProdutosCadastrados from "./../pages/produtos-loja/ProdutosLoja";
import RecompensasSelect from "./../pages/recompensas-select/RecompensasSelect";
import Register from "./../pages/register/Register";
import TelaLoja from "./../pages/tela-loja/TelaLoja";
import TelaMapa from "./../pages/tela-mapa/TelaMapa";
import TrocarSenha from "./../pages/trocar-senha/TrocarSenha";
import UsuarioSemLoja from "./../pages/usuario-sem-loja/UsuarioSemLoja";


const AllStack = () => {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#005098');
    }
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor="#FFFFFF"
        translucent={true}
        barStyle={"dark-content"}
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Carregando" component={Carregando} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="CadastroRegulamento"
            component={CadastroRegulamento}
          />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="TrocarSenha" component={TrocarSenha} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="UsuarioSemLoja" component={UsuarioSemLoja} />
          <Stack.Screen
            name="AtualizarRegulamento"
            component={AtualizarRegulamento}
          />
          <Stack.Screen name="OpcoesLoja" component={OpcoesLoja} />
          <Stack.Screen name="MinhasLojas" component={MinhasLojas} />
          <Stack.Screen name="RelatorioCliente" component={RelatorioCliente} />
          <Stack.Screen
            name="RelatorioClienteShare"
            component={RelatorioClienteShare}
          />
          <Stack.Screen name="EnviarMensagem" component={EnviarMensagem} />
          <Stack.Screen
            name="RelatorioInatividade"
            component={RelatorioInatividade}
          />
          <Stack.Screen name="RelatorioGenero" component={RelatorioGenero} />
          <Stack.Screen
            name="RelatorioGeneroShare"
            component={RelatorioGeneroShare}
          />
          <Stack.Screen name="RelatorioCurvaABC" component={RelatorioCurvaABC} />
          <Stack.Screen
            name="RelatorioCurvaABCShare"
            component={RelatorioCurvaABCShare}
          />
          <Stack.Screen
            name="RelatorioAniversariantes"
            component={RelatorioAniversariantes}
          />
          <Stack.Screen
            name="RelatorioAniversariantesShare"
            component={RelatorioAniversariantesShare}
          />
          <Stack.Screen
            name="RelatorioLocalidade"
            component={RelatorioLocalidade}
          />
          <Stack.Screen
            name="RelatorioFaixaEtaria"
            component={RelatorioFaixaEtaria}
          />
          <Stack.Screen
            name="RelatorioFaixaEtariaShare"
            component={RelatorioFaixaEtariaShare}
          />
          <Stack.Screen name="ticketMedioDiario" component={TicketMedioDiario} />
          <Stack.Screen
            name="cadastroDeProdutos"
            component={CadastroDeProdutos}
          />
          <Stack.Screen name="EditarProduto" component={EditarProduto} />
          <Stack.Screen name="RelatorioPedidos" component={RelatorioPedidos} />
          <Stack.Screen
            name="ProdutosCadastrados"
            component={ProdutosCadastrados}
          />
          <Stack.Screen
            name="ConfirmacaoDeProduto"
            component={ConfirmacaoDeProduto}
          />
          <Stack.Screen
            name="ConfirmarUpdateProduto"
            component={ConfirmarUpdateProduto}
          />
          <Stack.Screen
            name="SucessoAoCadastrarProduto"
            component={SucessoAoCadastrarProduto}
          />
          <Stack.Screen
            name="atualizarDadosLoja"
            component={AtualizarDadosLoja}
          />
          <Stack.Screen
            name="atualizarDadosLojaEndereco"
            component={AtualizarDadosLojaEndereco}
          />
          <Stack.Screen
            name="atualizarDadosLojaSucesso"
            component={AtualizarDadosLojaSucesso}
          />
          <Stack.Screen
            name="cadastroDeFuncionario"
            component={CadastroDeFuncionario}
          />
          <Stack.Screen
            name="cadastrarFuncionarioSucesso"
            component={CadastrarFuncionarioSucesso}
          />
          <Stack.Screen name="RecompensaSelect" component={RecompensasSelect} />
          <Stack.Screen
            name="ConfirmarConsumacao"
            component={ConfirmarConsumacao}
          />
          <Stack.Screen name="ConfirmarResgate" component={ConfirmarResgate} />
          <Stack.Screen name="meusPedidos" component={MeusPedidos} />
          <Stack.Screen name="lojaResgate" component={LojaResgate} />
          <Stack.Screen name="TelaLoja" component={TelaLoja} />
          <Stack.Screen
            name="cadastrarPontosManualmente"
            component={CadastrarPontosManualmente}
          />
          <Stack.Screen name="cadastrarPontos" component={CadastrarPontos} />
          <Stack.Screen
            name="cadastrarPontosConfirmar"
            component={CadastrarPontosConfirmar}
          />
          <Stack.Screen
            name="cadastrarPontosSucesso"
            component={CadastrarPontosSucesso}
          />
          <Stack.Screen
            name="ConfirmaçãoCadastroLoja"
            component={ConfirmacaoCadastroLoja}
          />
          <Stack.Screen name="LojaConsumacao" component={LojaConsumacao} />
          <Stack.Screen name="Conta" component={Conta} />
          <Stack.Screen name="Ajuda" component={Ajuda} />
          <Stack.Screen name="DenuncieUmaLoja" component={DenuncieUmaLoja} />
          <Stack.Screen name="SuporteScottclub" component={SuporteScottclub} />
          <Stack.Screen
            name="BemVindo"
            options={{ gestureEnabled: false }}
            component={BemVindo}
          />
          <Stack.Screen name="ContaUsuario" component={ContaUsuario} />
          <Stack.Screen
            name="cadastroDeLojaSemLoja"
            component={CadastroDeLojaSemLoja}
          />
          <Stack.Screen
            name="cadastroDeLojaEndereco"
            component={CadastroDeLojaEndereco}
          />
          <Stack.Screen name="TelaMapa" component={TelaMapa} />
          <Stack.Screen name="FuncionarioLoja" component={FuncionarioLoja} />
          <Stack.Screen name="HistoricoPontos" component={HistoricoPontos} />
          <Stack.Screen name="Notificacoes" component={Notificacoes} />

          <Stack.Screen
            name="PesquisaSatisfacao"
            component={PesquisaSatisfacao}
          />
          <Stack.Screen
            name="RelatorioSatisfacao"
            component={RelatorioSatisfacao}
          />
          <Stack.Screen
            name="RelatorioSatisfacaoShare"
            component={RelatorioSatisfacaoShare}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
export default AllStack;
