import { getLocalStorage, removeFromCart, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  // Handle empty cart
  if (!cartItems || (Array.isArray(cartItems) && cartItems.length === 0)) {
    document.querySelector(".product-list").innerHTML = `
      <li class="empty-cart">
        <p>Your cart is empty</p>
        <a href="/src/index.html">Continue Shopping</a>
      </li>
    `;
    return;
  }

  // Handle single item (convert to array)
  const itemsArray = Array.isArray(cartItems) ? cartItems : [cartItems];

  const htmlItems = itemsArray.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Add event listeners to remove buttons and quantity controls
  addCartListeners();
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const totalPrice = (item.FinalPrice * quantity).toFixed(2);

  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image.replace("../", "/src/")}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <div class="cart-card__quantity">
      <button class="quantity-btn minus" data-id="${item.Id}">-</button>
      <span class="quantity-display">qty: ${quantity}</span>
      <button class="quantity-btn plus" data-id="${item.Id}">+</button>
    </div>
    <p class="cart-card__price">$${totalPrice}</p>
    <button class="remove-btn" data-id="${item.Id}" title="Remove all">×</button>
  </li>`;

  return newItem;
}

function addCartListeners() {
  // Remove buttons
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      removeFromCart(productId);
      renderCartContents(); // Re-render the cart
    });
  });

  // Quantity minus buttons
  const minusButtons = document.querySelectorAll(".quantity-btn.minus");
  minusButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      updateQuantity(productId, -1);
    });
  });

  // Quantity plus buttons
  const plusButtons = document.querySelectorAll(".quantity-btn.plus");
  plusButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      updateQuantity(productId, 1);
    });
  });
}

function updateQuantity(productId, change) {
  let cart = JSON.parse(localStorage.getItem("so-cart")) || [];

  // Handle case where cart is a single object
  if (!Array.isArray(cart)) {
    cart = [cart];
  }

  const itemIndex = cart.findIndex((item) => item.Id === productId);

  if (itemIndex > -1) {
    // Update quantity
    cart[itemIndex].quantity = (cart[itemIndex].quantity || 1) + change;

    // Remove item if quantity becomes 0 or less
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }

    // Save updated cart
    setLocalStorage("so-cart", cart);
    renderCartContents(); // Re-render the cart
  }
}

// Initialize cart when page loads
renderCartContents();
