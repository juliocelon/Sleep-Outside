import { getCartCount, loadHeaderFooter } from "./utils.mjs";
import Newsletter from './newsletter.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';

// Prevent double loading
let headerFooterLoaded = false;

// Function to detect environment and return correct base path
// UNIVERSAL basePath detection - works in ALL environments
function getBasePath() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  console.log('🔧 Debug - hostname:', hostname, 'pathname:', pathname);
  
  // GitHub Pages detection - EXACT match for your repository
  if (hostname === 'oseimacdonald.github.io' && pathname.startsWith('./')) {
    console.log('🔧 Detected GitHub Pages - using relative paths');
    // On GitHub Pages, when in subfolders, we need to go up to root
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return './';
  }
  
  // Local development from docs folder
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
    console.log('🔧 Detected local development - using relative paths');
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return '../';
  }
  
  // Fallback - handle subdirectories properly
  console.log('🔧 Using fallback base path detection');
  if (pathname.includes('/product_listing/') || pathname.includes('/cart/') || pathname.includes('/checkout/') || pathname.includes('/product_pages/')) {
    return '../';
  }
  return './';
}

// Function to get correct path for specific pages
function getPagePath(page) {
  const basePath = getBasePath();
  const currentPath = window.location.pathname;
  
  console.log(`🔧 Getting path for ${page} from:`, currentPath);
  
  // For GitHub Pages
  if (window.location.hostname === 'oseimacdonald.github.io') {
    return `${basePath}${page}/`;
  }
  
  // For Docs environment
  if (currentPath.includes('/docs/')) {
    return `${basePath}${page}/`;
  }
  
  // For Src environment
  if (currentPath.includes('/src/')) {
    return `${basePath}${page}/`;
  }
  
  // Fallback
  return `${basePath}${page}/`;
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

// FIXED: Universal link fixing for all environments
function fixInternalLinks() {
  console.log('🔗 Fixing internal links for all environments...');
  
  const allLinks = document.querySelectorAll('a[href]');
  allLinks.forEach(link => {
    const originalHref = link.getAttribute('href');
    
    // Skip external links
    if (originalHref.startsWith('http') || originalHref.startsWith('#')) {
      return;
    }
    
    let newHref = originalHref;
    
    // Fix cart links
    if (originalHref.includes('cart')) {
      newHref = getPagePath('cart');
      console.log('🔗 Fixed cart link:', originalHref, '→', newHref);
    }
    // Fix checkout links
    else if (originalHref.includes('checkout')) {
      newHref = getPagePath('checkout');
      console.log('🔗 Fixed checkout link:', originalHref, '→', newHref);
    }
    // Fix product listing links
    else if (originalHref.includes('product_listing')) {
      const urlParams = new URLSearchParams(originalHref.split('?')[1] || '');
      const category = urlParams.get('category') || 'tents';
      newHref = `${getPagePath('product_listing')}?category=${category}`;
      console.log('🔗 Fixed product listing link:', originalHref, '→', newHref);
    }
    // Fix product pages links
    else if (originalHref.includes('product_pages')) {
      const urlParams = new URLSearchParams(originalHref.split('?')[1] || '');
      const product = urlParams.get('product');
      if (product) {
        newHref = `${getPagePath('product_pages')}?product=${product}`;
        console.log('🔗 Fixed product page link:', originalHref, '→', newHref);
      }
    }
    // Fix home links
    else if (originalHref === '../index.html' || originalHref === '/index.html' || 
             originalHref === 'index.html' || originalHref === '/' ||
             originalHref === '../' || originalHref === './index.html') {
      newHref = getBasePath();
      console.log('🔗 Fixed home link:', originalHref, '→', newHref);
    }
    
    // Only update if changed
    if (newHref !== originalHref) {
      link.href = newHref;
    }
  });
}

function addCategoryLinks() {
  if (!window.location.pathname.includes('index.html') && 
      !window.location.pathname.endsWith('/') && 
      !window.location.pathname.endsWith('/docs/')) {
    return;
  }

  const basePath = getBasePath();
  
  // Get correct image paths for each environment
  let imageBasePath = basePath;
  if (window.location.hostname === 'oseimacdonald.github.io') {
    imageBasePath = './';
  } else if (window.location.pathname.includes('/docs/')) {
    imageBasePath = './';
  } else if (window.location.pathname.includes('/src/')) {
    imageBasePath = './';
  }
  
  const categoriesHTML = `
    <section class="categories">
      <h2>Shop by Category</h2>
      <div class="category-grid">
        <a href="${getPagePath('product_listing')}?category=tents" class="category-card">
          <img src="${imageBasePath}public/images/noun_Tent_2517.svg" alt="Tents">
          <h3>Tents</h3>
        </a>
        <a href="${getPagePath('product_listing')}?category=backpacks" class="category-card">
          <img src="${imageBasePath}public/images/noun_Backpack_65884.svg" alt="Backpacks">
          <h3>Backpacks</h3>
        </a>
        <a href="${getPagePath('product_listing')}?category=sleeping-bags" class="category-card">
          <img src="${imageBasePath}public/images/noun_Backpack_2389275.svg" alt="Sleeping Bags">
          <h3>Sleeping Bags</h3>
        </a>
        <a href="${getPagePath('product_listing')}?category=hammocks" class="category-card">
          <img src="${imageBasePath}public/images/noun_Tent_2517.svg" alt="Hammocks">
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
  console.log('🚀 main.js: Starting initialization');
  console.log('📍 Current environment:', window.location.hostname + window.location.pathname);
  
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

// Newsletter safety check
setTimeout(() => {
  console.log('📧 Newsletter safety check running...');
  const newsletterBtn = document.getElementById('newsletterBtn');
  const newsletterModal = document.getElementById('newsletterModal');
  
  console.log('📧 Newsletter button found:', !!newsletterBtn);
  console.log('📧 Newsletter modal found:', !!newsletterModal);
  
  if (newsletterBtn && !newsletterBtn._newsletterInitialized) {
    newsletterBtn._newsletterInitialized = true;
    
    newsletterBtn.addEventListener('click', function() {
      console.log('📧 Newsletter button clicked - manual fallback');
      const modal = document.getElementById('newsletterModal');
      if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}, 1500);

// Debug links after page loads
setTimeout(() => {
  console.log('🔗 Final link check:');
  const importantLinks = document.querySelectorAll('a[href*="cart"], a[href*="checkout"], a[href*="product_listing"], a[href*="product_pages"]');
  importantLinks.forEach(link => {
    console.log('🔗', link.href);
  });
}, 1000);