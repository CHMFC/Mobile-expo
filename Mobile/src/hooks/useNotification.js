import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
export default () => {
  const context = useContext(NotificationContext);
  return context;
};
