import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import AllStack from "./src/allStack/AllStack";
import CategoryContextProvider from "./src/context/CategoryContext";
import NotificationContextProvider from "./src/context/NotificationContext";
import ShopContextProvider from "./src/context/shopContext";
import StorageContextProvider from "./src/context/StorageContext";
const App = () => {

  useEffect(()=>{
    SplashScreen.hide()
  }, [])
  
  return (
    <NotificationContextProvider>
      <StorageContextProvider>
        <ShopContextProvider>
          <CategoryContextProvider>
            <AllStack />
          </CategoryContextProvider>
        </ShopContextProvider>
      </StorageContextProvider>
    </NotificationContextProvider>
  );
};

export default App;
