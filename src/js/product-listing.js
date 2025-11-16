import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

// Load the header and footer
loadHeaderFooter();

const category = getParam('category');

// Create an instance of the ProductData class
const dataSource = new ProductData();

// Get the product list from the DOM
const listElement = document.querySelector('.product-list');

// Create a new ProductList
const myList = new ProductList(category, dataSource, listElement);

// Show the ProductList
myList.init();