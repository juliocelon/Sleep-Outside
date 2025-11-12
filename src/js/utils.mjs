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
  return urlParams.get('product');
}

//Create a function that will be able to work with multiple products to create product cards
export function renderListWithTemplate(templateFn, parentElement, list, position='afterbegin', clear='false') {
  //If clear is true, remove existing content before building new product cards
  if (clear) {
    parentElement.innerHTML = '';
  }  

  //Create an array of product cards for each item in the list
  const htmlStrings = list.map(templateFn);
  //Join the items in the list together and insert into the parent element 
  parentElement.insertAdjacentHTML(position, htmlStrings.join('')); //join prevents commas between each list item (<li></li>)  
}

export function renderWithTemplate(template, parentElement, data, callback) {
  
  parentElement.innerHTML = template;
  if(callback) {
    callback(data);
  }
}

export async function loadTemplate (path) {
  const response = await fetch(path); 
  const template = await response.text(); 
  return template;
}

export async function loadHeaderFooter() {
  
  const headerTemplate = await loadTemplate("../partials/header.html");

  const headerElement = document.querySelector("#main-header");

  renderWithTemplate(headerTemplate, headerElement);

  const footerTemplate = await loadTemplate("../partials/footer.html");

  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(footerTemplate, footerElement);

}
