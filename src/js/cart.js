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

  //const prices = cartItems.map((item) => item.FinalPrice);
  //const cartTotal = prices.reduce((sum, price) => sum + price, 0);

  const cartTotal = cartItems.reduce((sum, item) => {
    const qty = item.quantity || 1;
    return sum + item.FinalPrice * qty;
  }, 0);

  const cartTotalElement = `$${cartTotal}`;
  //Insert into the cart index.html after the <p> element (Total: )

  //document.querySelector('.cart-total').insertAdjacentHTML("beforeend", cartTotalElement);
  document.querySelector('.cart-total').textContent = `$${cartTotal}`;


  attachQuantityListeners();
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

  <p class="cart-card__quantity">
  Qty:
    <input
      type="number"
      min="1"
      value="${item.quantity || 1}" 
      data-id="${item.Id}" 
      class="cart-qty-input"
    />
  </p>
    
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
  return newItem;
}

function attachQuantityListeners() {
  document.querySelectorAll(".cart-qty-input").forEach(input => {
    input.addEventListener("change", updateQuantity);
  });
}

function updateQuantity(event) {
  const newQty = parseInt(event.target.value);
  const id = event.target.dataset.id;

  let cart = getLocalStorage("so-cart");

  cart = cart.map(item => {
    if (item.Id == id) {
      item.quantity = newQty;
    }
    return item;
  });

  localStorage.setItem("so-cart", JSON.stringify(cart));

  renderCartContents();
}

renderCartContents();
