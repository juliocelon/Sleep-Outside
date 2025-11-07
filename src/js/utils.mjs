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