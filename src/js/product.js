import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

//Call function to load headers and footers
loadHeaderFooter();

const category = getParam('category');
const dataSource = new ExternalServices(category);
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();
