import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

//Call function to load headers and footers
loadHeaderFooter();

function renderCartContents() { 
  const cartItems = getLocalStorage("so-cart");

  //Check to see if anything is in the cart
  if (!cartItems) { //means if cartItems is falsy (falsy means false, 0, null, empty string, undefined, NaN)
    //If nothing is in the cart, return an empty string
    document.querySelector(".product-list").innerHTML = '';       
    return;
  }


  //Create cards for items in cart
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");  


  //TOTAL:
  //Hide the cart-total div if the cart is empty
  const cartFooter = document.querySelector('.cart-footer-total');
  cartFooter.classList.remove('hide');
  
  //Create an array of all the prices of the items in the cart
  const prices = cartItems.map((item) => item.FinalPrice);
  //Sum the prices of all the items in the cart using reduce
  const cartTotal = prices.reduce((sum, price) => sum + price, 0);
  //Create template literal
  const cartTotalElement = `$${cartTotal}`;
  //Insert into the cart index.html after the <p> element (Total: )
  document.querySelector('.cart-total').insertAdjacentHTML("beforeend", cartTotalElement);
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="/product_pages/?product=${item.Id}" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="/product_pages/?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
  return newItem;
}


//Use this line to test that the total disappears when the cart is empty--it empties the cart
// localStorage.removeItem('so-cart');


renderCartContents();
