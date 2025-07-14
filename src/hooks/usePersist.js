import { useContext } from "react";
import { StorageContext } from "../context/StorageContext";

export default () => {
  const context = useContext(StorageContext);
  return context;
};
