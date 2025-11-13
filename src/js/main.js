import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.mjs";
import { loadHeaderFooter } from "./utils.mjs";

//Call function to load headers and footers
loadHeaderFooter();

//Functions to generate product list on homepage
const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");
const productList = new ProductList("tents", dataSource, listElement);
productList.init();

//Function to generate an alert on the home page
const alert = new Alert();
alert.createAlerts();