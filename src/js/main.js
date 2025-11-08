import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getCartCount } from "./utils.mjs";

// Array of tent IDs that have product pages
const availableTentIds = ["880RR", "985RF", "985PR", "344YJ"];

// Function to detect GitHub Pages environment
function getBasePath() {
  if (window.location.hostname.includes('github.io')) {
    return '/Sleep-Outside/';
  }
  return './';
}

// Function to update cart icon with item count
function updateCartIcon() {
  const cartCount = getCartCount();
  const cartIcon = document.querySelector(".cart");

  const existingBadge = cartIcon.querySelector(".cart-badge");
  if (existingBadge) {
    existingBadge.remove();
  }

  if (cartCount > 0) {
    const badge = document.createElement("span");
    badge.className = "cart-badge";
    badge.textContent = cartCount;
    cartIcon.appendChild(badge);
  }
}

// Function to fix all internal links
function fixInternalLinks() {
  const basePath = getBasePath();
  
  // Fix home page links
  const homeLinks = document.querySelectorAll('a[href="../index.html"], a[href="/src/index.html"], a[href="/"]');
  homeLinks.forEach(link => {
    link.href = basePath;
  });
  
  // Fix cart links
  const cartLinks = document.querySelectorAll('a[href="../cart/index.html"], a[href="/cart/index.html"]');
  cartLinks.forEach(link => {
    link.href = `${basePath}cart/`;
  });
  
  // Fix product page links
  const productLinks = document.querySelectorAll('a[href*="product_pages"]');
  productLinks.forEach(link => {
    const productId = link.href.split('product=')[1];
    if (productId) {
      link.href = `${basePath}product_pages/?product=${productId}`;
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  const productListElement = document.querySelector(".product-list");

  if (productListElement) {
    try {
      const dataSource = new ProductData("tents");
      const productList = new ProductList(
        "tents",
        dataSource,
        productListElement,
      );

      // Get all products and filter to only show those with detail pages
      const allProducts = await dataSource.getData();
      const filteredProducts = allProducts.filter((product) =>
        availableTentIds.includes(product.Id),
      );

      // Render the filtered list
      productList.renderList(filteredProducts);
      
      // Fix links after products are rendered
      setTimeout(fixInternalLinks, 100);
    } catch (error) {
      // Error handling without console statement
    }
  }

  // Fix existing links and update cart
  fixInternalLinks();
  updateCartIcon();
});