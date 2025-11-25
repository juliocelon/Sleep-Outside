import { getCartCount, loadHeaderFooter } from "./utils.mjs";
import Newsletter from './newsletter.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';

// Function to detect GitHub Pages environment
function getBasePath() {
  if (window.location.hostname.includes('github.io')) {
    return '/Sleep-Outside/';
  }
  return './';
}

// ROBUST FUNCTION: Product listing handler with enhanced debugging
async function loadProductListing() {
  // Check if we're on a product listing page
  if (window.location.pathname.includes('/product_listing/')) {
    console.log('🛍️ main.js: Loading product listing...');
    
    // Get category from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'tents';
    
    console.log('🛍️ main.js: Loading products for category:', category);
    
    // Update page title
    const titleElement = document.getElementById('category-title');
    if (titleElement) {
      titleElement.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Enhanced debugging - check what's in the DOM
    console.log('🔍 DOM Debug - Main element:', document.querySelector('main'));
    console.log('🔍 DOM Debug - Products section:', document.querySelector('.products'));
    console.log('🔍 DOM Debug - All sections in main:', document.querySelectorAll('main section'));
    
    // Wait for product list element to be available with more debugging
    const listElement = await waitForElement('.product-list', 3000);
    
    if (listElement) {
      console.log('🛍️ Product list element found, loading products...');
      const dataSource = new ExternalServices(category);
      const productList = new ProductList(category, dataSource, listElement);
      await productList.init();
      console.log('🛍️ main.js: Products loaded successfully');
    } else {
      console.error('🛍️ main.js: Product list element not found after waiting');
      // Try to create the element if it doesn't exist
      createProductListElement(category);
    }
  }
}

// Function to create product list element if it doesn't exist
function createProductListElement(category) {
  console.log('🔧 Attempting to create product list element...');
  
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    console.error('🔧 Main element not found');
    return;
  }
  
  // Check if products section exists
  let productsSection = document.querySelector('.products');
  if (!productsSection) {
    console.log('🔧 Creating products section...');
    productsSection = document.createElement('section');
    productsSection.className = 'products';
    
    // Create title
    const title = document.createElement('h2');
    title.id = 'category-title';
    title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    productsSection.appendChild(title);
    
    // Create product list
    const productList = document.createElement('ul');
    productList.className = 'product-list';
    productsSection.appendChild(productList);
    
    // Add to main
    mainElement.appendChild(productsSection);
    console.log('🔧 Products section created successfully');
  }
  
  // Now try to load products
  const listElement = document.querySelector('.product-list');
  if (listElement) {
    console.log('🛍️ Product list created, loading products...');
    const dataSource = new ExternalServices(category);
    const productList = new ProductList(category, dataSource, listElement);
    productList.init();
  }
}

// Helper function to wait for DOM element
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`🔍 Element ${selector} found immediately`);
      resolve(element);
      return;
    }

    console.log(`🔍 Waiting for element: ${selector}`);
    
    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`🔍 Element ${selector} found via MutationObserver`);
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      const element = document.querySelector(selector);
      console.log(`🔍 Element ${selector} after timeout:`, element);
      resolve(element);
    }, timeout);
  });
}

// ... REST OF YOUR FUNCTIONS REMAIN THE SAME (addCustomAlert, updateCartIcon, etc.)
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

  if (!cartIcon) {
    console.log('🛒 Cart icon not found');
    return;
  }

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
  // Only run on home page
  if (!window.location.pathname.includes('index.html') && 
      !window.location.pathname.endsWith('/') && 
      !window.location.pathname.endsWith('/docs/')) {
    return;
  }

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
  console.log('🚀 main.js: Starting initialization...');
  
  try {
    // Load dynamic header and footer ONCE - AWAIT THIS
    console.log('📄 Loading header/footer...');
    await loadHeaderFooter();
    console.log('✅ Header/footer loaded');
    
    // Add customizable alert
    console.log('🚨 Adding custom alert...');
    addCustomAlert();
    
    // Add category links to home page
    console.log('🏷️ Adding category links...');
    addCategoryLinks();

    // Fix existing links and update cart
    console.log('🔗 Fixing internal links...');
    fixInternalLinks();
    updateCartIcon();

    // Initialize newsletter
    console.log('📧 Initializing newsletter...');
    new Newsletter();

    // ADD THIS: Load products if on product listing page - AFTER header/footer
    console.log('🛍️ Checking for product listing...');
    await loadProductListing();
    
    console.log('✅ main.js: Initialization complete');
  } catch (error) {
    console.error('❌ main.js: Initialization failed:', error);
  }
});

// Safety check for newsletter button
setTimeout(() => {
  const newsletterBtn = document.getElementById('newsletterBtn');
  console.log('📧 Newsletter button check:', newsletterBtn);
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', function() {
      console.log('📧 Newsletter button clicked - manual test');
    });
  }
}, 2000);