import { useContext } from "react";
import { CategoryContext } from "../context/CategoryContext";

export default () => {
  const context = useContext(CategoryContext);
  return context;
};
