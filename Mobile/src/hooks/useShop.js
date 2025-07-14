import { useContext } from "react";
import { ShopContext } from "../context/shopContext";

export default () => {
    const context = useContext(ShopContext);
    return context
}