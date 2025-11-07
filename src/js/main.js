import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getCartCount } from "./utils.mjs";

// Array of tent IDs that have product pages
const availableTentIds = ["880RR", "985RF", "985PR", "344YJ"];

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
    } catch (error) {
      // Error handling without console statement
    }
  }

  updateCartIcon();
});
