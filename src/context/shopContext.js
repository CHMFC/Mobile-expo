import React, { createContext, useState, useMemo } from "react";

export const ShopContext = createContext({});

export default function ShopContextProvider({ children }) {
  const [getFilteredData, setFilteredData] = useState([]);
  const [getAllData, setGetAllData] = useState([]);

  const shop = useMemo(() => {
    return {
      getFilteredData,
      setFilteredData,
      getAllData,
      setGetAllData,
    };
  }, [getAllData, getFilteredData]);
  return <ShopContext.Provider value={shop}>{children}</ShopContext.Provider>;
}
