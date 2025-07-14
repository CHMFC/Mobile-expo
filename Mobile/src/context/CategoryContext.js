import React, { createContext, useState } from "react";
import { useMemo } from "react";

export const CategoryContext = createContext({});

export default function CategoryContextProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState([]);

  const categories = useMemo(() => {
    return {
      selectedCategory,
      setSelectedCategory,
    };
  }, [selectedCategory]);
  return <CategoryContext.Provider value={categories}>{children}</CategoryContext.Provider>;
}
