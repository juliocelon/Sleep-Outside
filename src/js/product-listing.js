import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

//Call function to load headers and footers
loadHeaderFooter();

//Pull category the product-listing/index.html page will be showing from the URL
const category = getParam('category');
//Create an instance of the ExternalServices class
const dataSource = new ExternalServices();
//Pull element from HTML document where the products will be shown
const listElement = document.querySelector(".product-list");
//Create an instance of the ProductList class and send it the correct information
const myList = new ProductList(category, dataSource, listElement);
//Call init function to show the products
myList.init();
