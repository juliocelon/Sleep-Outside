import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

//Call function to load headers and footers
loadHeaderFooter();

//Pull category the product-listing/index.html page will be showing from the URL
const category = getParam('category');
console.log(category);
//Create an instance of the ProductData class
const dataSource = new ProductData();
//Pull element from HTML document where the products will be shown
const listElement = document.querySelector('.product-list');
//Create an instance of the ProductList class and send it the correct information
const myList = new ProductList(category, dataSource, listElement);
//Call init function to show the products
myList.init();





