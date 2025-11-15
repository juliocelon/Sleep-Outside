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
  const res = await fetch(path);
  if (res.ok) {
    const template = await res.text();
    return template;
  } else {
    throw new Error(`Failed to load template: ${path}`);
  }
}

export async function loadHeaderFooter() {
  try {
    // Use simple relative paths - these should work with the fixed Vite config
    const headerTemplate = await loadTemplate('/public/partials/header.html');
    const headerElement = document.getElementById('main-header');
    if (headerElement) {
      await renderWithTemplate(headerTemplate, headerElement);
    }
    
    const footerTemplate = await loadTemplate('/public/partials/footer.html');
    const footerElement = document.getElementById('main-footer');
    if (footerElement) {
      await renderWithTemplate(footerTemplate, footerElement);
    }
    
  } catch (error) {
    console.error('Error loading header/footer:', error);
  }
}