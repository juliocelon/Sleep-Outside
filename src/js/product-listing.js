import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

// Load dynamic header and footer
loadHeaderFooter();

// Get category from URL parameter
const category = getParam('category') || 'tents';

// Update page title with category
document.addEventListener("DOMContentLoaded", async function () {
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) {
    pageTitle.textContent = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  }

  const productListElement = document.querySelector(".product-list");

  if (productListElement) {
    try {
      const dataSource = new ProductData(category);
      const productList = new ProductList(
        category,
        dataSource,
        productListElement,
      );

      // Initialize the product list with search and sort
      const allProducts = await dataSource.getData();
      productList.products = allProducts;
      productList.filteredProducts = [...allProducts];
      productList.renderList(allProducts);
      productList.addSearchAndSort();
      
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }
});