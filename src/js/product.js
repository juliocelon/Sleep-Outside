import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

//Call function to load headers and footers
loadHeaderFooter();

const category = getParam('category');
const dataSource = new ProductData(category);
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();
