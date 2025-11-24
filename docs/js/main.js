import { getCartCount, loadHeaderFooter } from "./utils.mjs";
import Newsletter from './newsletter.mjs';

// Function to detect GitHub Pages environment
function getBasePath() {
  if (window.location.hostname.includes('github.io')) {
    return '/Sleep-Outside/';
  }
  return './';
}

// Add this function to main.js
function addCustomAlert() {
  const alertHTML = `
    <div class="custom-alert" id="siteAlert">
      <div class="alert-content">
        <span class="alert-message">🚨 Special Offer: Free shipping on orders over $50!</span>
        <button class="alert-close" id="closeAlert">×</button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', alertHTML);
  
  // Add close functionality
  document.getElementById('closeAlert').addEventListener('click', function() {
    document.getElementById('siteAlert').style.display = 'none';
  });
  
  // Optional: Auto-hide after 5 seconds
  setTimeout(() => {
    const alert = document.getElementById('siteAlert');
    if (alert) {
      alert.style.display = 'none';
    }
  }, 5000);
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

// Add category links to home page
function addCategoryLinks() {
  const basePath = getBasePath();
  const categoriesHTML = `
    <section class="categories">
      <h2>Shop by Category</h2>
      <div class="category-grid">
        <a href="${basePath}product_listing/?category=tents" class="category-card">
          <img src="${basePath}public/images/noun_Tent_2517.svg" alt="Tents">
          <h3>Tents</h3>
        </a>
        <a href="${basePath}product_listing/?category=backpacks" class="category-card">
          <img src="${basePath}public/images/noun_Backpack_65884.svg" alt="Backpacks">
          <h3>Backpacks</h3>
        </a>
        <a href="${basePath}product_listing/?category=sleeping-bags" class="category-card">
          <img src="${basePath}public/images/noun_Backpack_2389275.svg" alt="Sleeping Bags">
          <h3>Sleeping Bags</h3>
        </a>
        <a href="${basePath}product_listing/?category=hammocks" class="category-card">
          <img src="${basePath}public/images/noun_Tent_2517.svg" alt="Hammocks">
          <h3>Hammocks</h3>
        </a>
      </div>
    </section>
  `;
  
  // Remove the old products section and replace with categories
  const productsSection = document.querySelector('.products');
  if (productsSection) {
    productsSection.remove(); // Remove the old static product listing
  }
  
  // Add categories after the hero section
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.insertAdjacentHTML('afterend', categoriesHTML);
  }
}

// SINGLE DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", async function () {
  // Load dynamic header and footer ONCE
  await loadHeaderFooter();
  
  // Add customizable alert
  addCustomAlert();
  
  // Add category links to home page
  addCategoryLinks();

  // Fix existing links and update cart
  fixInternalLinks();
  updateCartIcon();

  // Initialize newsletter
  new Newsletter();
});

