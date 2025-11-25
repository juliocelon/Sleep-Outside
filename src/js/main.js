import { getCartCount, loadHeaderFooter } from "./utils.mjs";
import Newsletter from './newsletter.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';

// Prevent double loading
let headerFooterLoaded = false;

// Function to detect environment and return correct base path
function getBasePath() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  console.log('🔧 Base path detection - hostname:', hostname, 'pathname:', pathname);
  
  // GitHub Pages detection
  if (hostname === 'oseimacdonald.github.io' && pathname.startsWith('/Sleep-Outside/')) {
    console.log('🔧 Detected GitHub Pages - using relative paths');
    // On GitHub Pages, when in subfolders, we need to go up to root
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return './';
  }
  
  // Local development from docs folder (production build)
  if ((hostname === '127.0.0.1' || hostname === 'localhost') && 
      (pathname.includes('/docs/') || pathname.endsWith('/docs'))) {
    console.log('🔧 Detected local docs folder - using relative paths');
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return './';
  }
  
  // Local development from src folder
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    console.log('🔧 Detected local src folder - using relative paths');
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return './';
  }
  
  // Fallback
  console.log('🔧 Using fallback base path detection');
  return './';
}

// Product listing handler
async function loadProductListing() {
  if (window.location.pathname.includes('/product_listing/')) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'tents';
    
    // Update page title
    const titleElement = document.getElementById('category-title');
    if (titleElement) {
      titleElement.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Wait for or create product list element
    const listElement = await waitForElement('.product-list', 2000);
    
    if (listElement) {
      const dataSource = new ExternalServices(category);
      const productList = new ProductList(category, dataSource, listElement);
      await productList.init();
    } else {
      createProductListElement(category);
    }
  }
}

// Product details page handler
async function loadProductDetails() {
  if (window.location.pathname.includes('/product_pages/')) {
    console.log('🔍 main.js: On product details page - newsletter should work');
  }
}

// Function to create product list element if it doesn't exist
function createProductListElement(category) {
  const mainElement = document.querySelector('main');
  if (!mainElement) return;
  
  let productsSection = document.querySelector('.products');
  if (!productsSection) {
    productsSection = document.createElement('section');
    productsSection.className = 'products';
    
    const title = document.createElement('h2');
    title.id = 'category-title';
    title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    productsSection.appendChild(title);
    
    const productList = document.createElement('ul');
    productList.className = 'product-list';
    productsSection.appendChild(productList);
    
    mainElement.appendChild(productsSection);
  }
  
  const listElement = document.querySelector('.product-list');
  if (listElement) {
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
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
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
      resolve(document.querySelector(selector));
    }, timeout);
  });
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
  
  document.getElementById('closeAlert').addEventListener('click', function() {
    document.getElementById('siteAlert').style.display = 'none';
  });
  
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

  if (!cartIcon) return;

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
  
  console.log('🔗 Fixing internal links with basePath:', basePath);
  
  // Fix home page links
  const homeLinks = document.querySelectorAll('a[href="../index.html"], a[href="/src/index.html"], a[href="/"], a[href="index.html"]');
  homeLinks.forEach(link => {
    const newHref = basePath;
    if (link.href !== newHref) {
      console.log('🔗 Fixing home link:', link.href, '→', newHref);
      link.href = newHref;
    }
  });
  
  // Fix cart links - handle both src and docs environments
  const cartLinks = document.querySelectorAll('a[href="../cart/index.html"], a[href="/cart/index.html"], a[href="cart/index.html"], a[href="/src/cart/index.html"]');
  cartLinks.forEach(link => {
    const newHref = `${basePath}cart/`;
    if (link.href !== newHref) {
      console.log('🔗 Fixing cart link:', link.href, '→', newHref);
      link.href = newHref;
    }
  });
  
  // Fix checkout links
  const checkoutLinks = document.querySelectorAll('a[href="../checkout/index.html"], a[href="/checkout/index.html"], a[href="checkout/index.html"], a[href="/src/checkout/index.html"]');
  checkoutLinks.forEach(link => {
    const newHref = `${basePath}checkout/`;
    if (link.href !== newHref) {
      console.log('🔗 Fixing checkout link:', link.href, '→', newHref);
      link.href = newHref;
    }
  });
  
  // Fix product listing links
  const productListingLinks = document.querySelectorAll('a[href="../product_listing/index.html"], a[href="/product_listing/index.html"], a[href="product_listing/index.html"], a[href="/src/product_listing/index.html"]');
  productListingLinks.forEach(link => {
    const newHref = `${basePath}product_listing/`;
    if (link.href !== newHref) {
      console.log('🔗 Fixing product listing link:', link.href, '→', newHref);
      link.href = newHref;
    }
  });
  
  // Fix product page links - only fix if needed
  const productLinks = document.querySelectorAll('a[href*="product_pages"]');
  productLinks.forEach(link => {
    // Only fix if it's a relative path that needs updating
    if (link.href.includes('/src/') || link.href.includes('../')) {
      const productId = link.href.split('product=')[1];
      if (productId) {
        const newHref = `${basePath}product_pages/?product=${productId}`;
        console.log('🔗 Fixing product link:', link.href, '→', newHref);
        link.href = newHref;
      }
    }
  });
}

// Add category links to home page
function addCategoryLinks() {
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
  
  const productsSection = document.querySelector('.products');
  if (productsSection) {
    productsSection.remove();
  }
  
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.insertAdjacentHTML('afterend', categoriesHTML);
  }
}

// Main initialization
document.addEventListener("DOMContentLoaded", async function () {
  console.log('🚀 main.js: Starting initialization on:', window.location.pathname);
  
  // Check if header/footer already loaded to prevent double loading
  if (headerFooterLoaded) {
    console.log('⏭️ Header/footer already loaded, skipping...');
    return;
  }
  
  console.log('📄 Loading header/footer...');
  await loadHeaderFooter();
  headerFooterLoaded = true;
  console.log('✅ Header/footer loaded');
  
  addCustomAlert();
  addCategoryLinks();
  
  console.log('🔗 Fixing internal links...');
  fixInternalLinks();
  
  updateCartIcon();
  new Newsletter();
  
  // Handle different page types
  await loadProductListing();
  await loadProductDetails();
  
  console.log('✅ main.js: Initialization complete');
});

// Debug cart links after page loads
setTimeout(() => {
  console.log('🛒 Checking cart links after load...');
  const cartLinks = document.querySelectorAll('a[href*="cart"]');
  cartLinks.forEach(link => {
    console.log('🛒 Cart link found:', link.href);
  });
}, 1000);