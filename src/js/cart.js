import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

//Call function to load headers and footers
loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  // console.log(cartItems);

  //Check to see if anything is in the cart
  if (!cartItems) {
    //means if cartItems is falsy (falsy means false, 0, null, empty string, undefined, NaN)
    //If nothing is in the cart, return an empty string
    document.querySelector(".product-list").innerHTML = "";
    return;
  }

  //Create cards for items in cart
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  //TOTAL:
  //Hide the cart-total div if the cart is empty
  const cartFooter = document.querySelector(".cart-footer-total");
  cartFooter.classList.remove("hide");

  //Create an array of all the prices and quantities of the items in the cart
  const totalComponents = cartItems.map((item) => ({
    price: item.FinalPrice,
    quantity: item.quantity,
  }));
  //Sum the subtotals (price*quantity) for all the items in the cart using reduce
  const cartTotal = totalComponents.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  ); //0 is initial value of the accumulator
  //Create template literal
  const cartTotalElement = `$${cartTotal}`;
  //Insert into the cart index.html after the <p> element (Total: )
  document
    .querySelector(".cart-total")
    .insertAdjacentHTML("beforeend", cartTotalElement);
}

function cartItemTemplate(item) {
  let selectedColor;

  if (item.selectedColor) {
    selectedColor = item.selectedColor;
  } else {
    selectedColor = {
      name: item.Colors[0].ColorName,
      preview: item.Colors[0].ColorPreviewImageSrc
    };
  }

  const newItem = `<li class="cart-card divider">
    <a href="/product_pages/?product=${item.Id}" class="cart-card__image">
      <img
        src="${item.Images.PrimarySmall}"
        alt="${item.Name}"
      />
    </a>

    <a href="/product_pages/?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>

    <div class="product-color-info">
      <p class="pcolor-name">
        Color: <strong>${selectedColor.name}</strong>
      </p>

      <img 
        class="color-image-product"
        src="${selectedColor.preview}"
        alt="${selectedColor.name}"
      />
    </div>

    <p class="cart-card__quantity">qty: ${item.quantity}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
  return newItem;
}

//Event Listener to go to Checkout Page
document.getElementById("checkout").addEventListener("click", () => {
  window.location.href = "/checkout/index.html";
});

//Use this line to test that the total disappears when the cart is empty--it empties the cart
// localStorage.removeItem('so-cart');

renderCartContents();
