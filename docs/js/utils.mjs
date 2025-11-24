// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get URL parameter by name
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// get cart item count - FIXED VERSION
export function getCartCount() {
  const cart = JSON.parse(localStorage.getItem('so-cart')) || [];
  
  // Handle case where cart is a single object instead of array
  if (!Array.isArray(cart)) {
    return 1; // Single item in cart
  }
  
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

export function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
  
  if (!Array.isArray(cart)) {
    cart = [cart];
  }
  
  // Filter out the item to remove
  const updatedCart = cart.filter(item => item.Id !== productId);
  
  // Save updated cart
  setLocalStorage('so-cart', updatedCart);
  
  return updatedCart;
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

// NEW FUNCTIONS FOR DYNAMIC HEADER/FOOTER

export async function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  try {
    const res = await fetch(path);
    if (res.ok) {
      const template = await res.text();
      return template;
    }
    throw new Error(`HTTP ${res.status}`);
  } catch (error) {
    throw new Error(`Failed to load template: ${path}`);
  }
}

// UNIVERSAL PATH SOLUTION - WORKS FOR BOTH LOCAL AND PRODUCTION
export async function loadHeaderFooter() {
  try {
    const currentPath = window.location.pathname;
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    // Determine correct base path
    let basePath = '';
    
    if (isGitHubPages) {
  // Production - GitHub Pages (docs folder is root)
  basePath = './';
    } else {
      // Local development - use relative paths
      if (currentPath.includes('/cart/') || currentPath.includes('/checkout/') || currentPath.includes('/product_pages/') || currentPath.includes('/product_listing/')) {
        basePath = '..'; // From subdirectories go up to src/
      } else {
        basePath = '.'; // From src/ root
      }
    }
    
    console.log('Loading templates with basePath:', basePath);
    
    // Load header
    const headerPath = `${basePath}/public/partials/header.html`;
    const headerTemplate = await loadTemplate(headerPath);
    const headerElement = document.getElementById('main-header');
    if (headerElement) {
      await renderWithTemplate(headerTemplate, headerElement);
      // Fix any paths in the loaded header
      fixHeaderPaths(basePath);
    }
    
    // Load footer
    const footerPath = `${basePath}/public/partials/footer.html`;
    const footerTemplate = await loadTemplate(footerPath);
    const footerElement = document.getElementById('main-footer');
    if (footerElement) {
      await renderWithTemplate(footerTemplate, footerElement);
    }
    
  } catch (error) {
    console.error('Error loading header/footer:', error);
    // Create reliable fallback that works everywhere
    createUniversalFallback();
  }
}

// Helper function to fix image paths in header
function fixHeaderPaths(basePath) {
  const header = document.getElementById('main-header');
  if (!header) return;
  
  // Fix logo image path
  const logoImg = header.querySelector('.logo img');
  if (logoImg) {
    const currentSrc = logoImg.getAttribute('src');
    // Update path to be relative to base
    if (currentSrc && !currentSrc.startsWith('http')) {
      if (currentSrc.startsWith('/')) {
        logoImg.src = `${basePath}${currentSrc}`;
      } else {
        logoImg.src = `${basePath}/${currentSrc}`;
      }
    }
  }
  
  // Fix links in header to work in both environments
  const links = header.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && href.startsWith('/')) {
      link.href = `${basePath}${href}`;
    }
  });
}

// Universal fallback that works in all environments
function createUniversalFallback() {
  const header = document.getElementById('main-header');
  const footer = document.getElementById('main-footer');
  
  if (header && (!header.innerHTML || header.innerHTML.trim() === '')) {
    const currentPath = window.location.pathname;
    let homePath = './index.html';
    let cartPath = './cart/index.html';
    
    // Adjust paths based on current location
    if (currentPath.includes('/cart/') || currentPath.includes('/checkout/') || currentPath.includes('/product_pages/')) {
      homePath = '../index.html';
      cartPath = '../cart/index.html';
    }
    
    header.innerHTML = `
      <div class="logo">
        <a href="${homePath}">
          <img src="./public/images/noun_Tent_2517.svg" alt="Sleep Outside Logo" onerror="this.style.display='none'">
          <h1>Sleep Outside</h1>
        </a>
      </div>
      <nav>
        <a href="${homePath}">Home</a>
        <a href="${cartPath}" class="cart">Cart</a>
      </nav>
    `;
    
    // Add cart badge to fallback header
    updateFallbackCart();
  }
  
  if (footer && (!footer.innerHTML || footer.innerHTML.trim() === '')) {
    footer.innerHTML = `<p>&copy; 2024 Sleep Outside</p>`;
  }
}

// Update cart count in fallback header
function updateFallbackCart() {
  const cartCount = getCartCount();
  const cartLink = document.querySelector('.cart');
  if (cartLink && cartCount > 0) {
    // Remove existing badge
    const existingBadge = cartLink.querySelector('.cart-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    
    // Add new badge
    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.textContent = cartCount;
    cartLink.appendChild(badge);
  }
}

// Call this after header is loaded to ensure cart count is updated
export function updateCartIcon() {
  const cartLink = document.querySelector('.cart');
  if (!cartLink) {
    // If no cart link found, try again shortly (header might still be loading)
    setTimeout(updateCartIcon, 100);
    return;
  }
  
  const cartCount = getCartCount();
  const existingBadge = cartLink.querySelector('.cart-badge');
  
  if (existingBadge) {
    existingBadge.remove();
  }
  
  if (cartCount > 0) {
    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.textContent = cartCount;
    cartLink.appendChild(badge);
  }
}

// API UTILITIES - MATCHING YOUR EXISTING PATTERN
export function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

// Simple fixed version - always use the render server
export function getApiBaseUrl() {
  return 'https://wdd330-backend.onrender.com';
}

// Helper to make API calls to render server
export async function apiRequest(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  // Remove any double slashes
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`.replace(/([^:]\/)\/+/g, '$1');
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await convertToJson(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}