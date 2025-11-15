// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

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

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

//Create a function that will be able to work with multiple products to create product cards
export function renderListWithTemplate(templateFn, parentElement, list, position = 'afterbegin', clear = 'false') {
  //If clear is true, remove existing content before building new product cards
  if (clear) {
    parentElement.innerHTML = '';
  }

  //Create an array of product cards for each item in the list
  const htmlStrings = list.map(templateFn);
  //Join the items in the list together and insert into the parent element 
  parentElement.insertAdjacentHTML(position, htmlStrings.join('')); //join prevents commas between each list item (<li></li>)  
}

//Function to create the header and footer for each webpage
export function renderWithTemplate(template, parentElement, callback) {
  //Check if there is a callback function (in this case cartSuperscript)
  parentElement.innerHTML = template;
  if (callback) {
    callback(); //the way the cartSuperscript function is set up we don't need data entered
  }
}

//Function to create a superscript on the cart in the header
function cartSuperscript() {
  //Pull items in cart from local storage
  const cartItems = getLocalStorage('so-cart');

  //Count the number of items in the cart
  let numberItemsInCart;
  if (cartItems) {
    numberItemsInCart = cartItems.length;
  } else {
    numberItemsInCart = 0
  }

  //Hide the superscript if nothing is in the cart, otherwise show
  if (numberItemsInCart > 0) { //means if value is NOT falsy (or in other words, is not false, null, 0, etc.)
    //Pull the superscript element from all the index.html's and remove the class list 'hide' so it will show
    const superscript = document.querySelector('.superscript');
    superscript.classList.remove('hide');
    //Count the number of items in the cart and add it as a superscript on the cart icon    
    superscript.textContent = `${numberItemsInCart}`;
  }
}

//Function to call templates
export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

//Function to load headers and footers
export async function loadHeaderFooter() {
  //Load and publish header
  const headerTemplate = await loadTemplate("/partials/header.html"); //Use an absolute file path rather than relative so it will load regardless of where the webpage is in the folders
  const headerElement = document.querySelector(".header"); //use class rather than id so it can be applied to all webpages
  renderWithTemplate(headerTemplate, headerElement, cartSuperscript);

  //Load and publish footer
  const footerTemplate = await loadTemplate("/partials/footer.html"); //Use an absolute file path rather than relative so it will load regardless of where the webpage is in the folders
  const footerElement = document.querySelector(".footer"); //use class rather than id so it can be applied to all webpages
  renderWithTemplate(footerTemplate, footerElement); //no callback function in the footer
}
function discount(product) {
  if (product.FinalPrice < product.SuggestedRetailPrice) {
    return Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
  }
  return;
}

export function discountIndicator(product) {
  const discountValue = discount(product);
  if (discountValue) {
    return `<p class="discount-indicator highlight">-${discountValue}% Off!</p>`;
  }
  return;
}

export function discountIndicatorAmount(product) {
  if (product.FinalPrice < product.SuggestedRetailPrice) {
    return `<p class="discount-indicator highlight">-${product.SuggestedRetailPrice - product.FinalPrice} Off!</p>`;
  }
}


