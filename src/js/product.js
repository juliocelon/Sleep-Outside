import { setLocalStorage, getLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

const productId = getParam('product');
console.log(dataSource.findProductById(productId));

// Array that gets the products that have been storaged if any
const localProducts = getLocalStorage("so-cart");

let products = [];
// Array that will take the products from localProducts, or empty if there are no products

if (localProducts) {
  products = localProducts;
}

function addProductToCart(product) {
  // here we add a product
  products.push(product);
  setLocalStorage("so-cart", products);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
