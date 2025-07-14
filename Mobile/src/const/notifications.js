import messaging from "@react-native-firebase/messaging";
import axios from "axios";
import { API_URL } from "./apiUrl";

export async function registerDeviceForRemoteMessages() {
  try {
    await messaging().registerDeviceForRemoteMessages();
    await requestUserPermission();
  } catch (error) {
    return null;
  }
}

export async function requestUserPermission() {
  const hasPermission = await messaging().hasPermission();

  if (!hasPermission) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      return null;
    }
  }
}

export const removerFuncionarioNotification = async (nome, tokenCelular) => {
  try {
    await axios.post(
      `${API_URL.base}/pushnotification`,
      {
        tokenCelular: [tokenCelular],
        title: "Funcionário removido",
        body: `Olá ${nome}, você foi removido da loja.`,
      }
    );
  } catch (err) {
    return null;
  }
};

export const FuncionarioNotification = async (nome, tokenCelular, ativo) => {
  try {
    await axios.post(
      `${API_URL.base}/pushnotification`,
      {
        tokenCelular: [tokenCelular],
        title: ativo ? "Funcionário reativado" : "Funcionário desativado",
        body: `Olá ${nome}, seu status foi ${ativo ? "reativado" : "desativado"
          } pela loja.`,
      }
    );
  } catch (err) {
    return null;
  }
};

