import { loadHeaderFooter, getLocalStorage, removeFromCart, setLocalStorage, updateCartIcon } from "./utils.mjs";
import Newsletter from './newsletter.mjs';

// Load dynamic header and footer
loadHeaderFooter().then(() => {
  // Update cart icon after header is loaded
  updateCartIcon();
  // Initialize cart when page loads
  renderCartContents();
});

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  console.log('🛒 Cart items from localStorage:', cartItems);

  // Handle empty cart
  if (!cartItems || (Array.isArray(cartItems) && cartItems.length === 0)) {
    document.querySelector(".product-list").innerHTML = `
      <li class="empty-cart">
        <p>Your cart is empty</p>
        <a href="../index.html">Continue Shopping</a>
      </li>
    `;
    // Clear any existing totals
    const existingTotals = document.querySelector(".cart-totals");
    if (existingTotals) existingTotals.remove();
    return;
  }

  // Handle single item (convert to array)
  const itemsArray = Array.isArray(cartItems) ? cartItems : [cartItems];
  
  const htmlItems = itemsArray.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Add event listeners to remove buttons and quantity controls
  addCartListeners();
  
  // Render cart totals
  renderCartTotals();
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const totalPrice = (item.FinalPrice * quantity).toFixed(2);

  // Use API image paths
  const imagePath = item.Images?.PrimaryMedium || 
                   item.Images?.PrimaryLarge || 
                   item.Images?.PrimarySmall ||
                   item.Image || 
                   '../public/images/noun_Tent_2517.svg';

  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${imagePath}"
        alt="${item.Name}"
        onerror="this.src='../public/images/noun_Tent_2517.svg'"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors ? item.Colors[0].ColorName : 'N/A'}</p>
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

function calculateCartTotals() {
  const cartItems = getLocalStorage("so-cart") || [];
  const itemsArray = Array.isArray(cartItems) ? cartItems : [cartItems];
  
  const subtotal = itemsArray.reduce((total, item) => {
    const quantity = item.quantity || 1;
    return total + (item.FinalPrice * quantity);
  }, 0);
  
  const taxRate = 0.06; // 6% tax as required
  const tax = subtotal * taxRate;
  
  // Shipping: $10 for first item + $2 for each additional item
  const totalItems = itemsArray.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);
  
  const shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;
  
  const grandTotal = subtotal + tax + shipping;
  
  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    shipping: shipping.toFixed(2),
    grandTotal: grandTotal.toFixed(2)
  };
}

function renderCartTotals() {
  const totals = calculateCartTotals();
  const totalsHTML = `
    <div class="cart-totals divider">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>$${totals.subtotal}</span>
      </div>
      <div class="total-row">
        <span>Tax:</span>
        <span>$${totals.tax}</span>
      </div>
      <div class="total-row">
        <span>Shipping:</span>
        <span>$${totals.shipping}</span>
      </div>
      <div class="total-row grand-total">
        <span>Total:</span>
        <span>$${totals.grandTotal}</span>
      </div>
      <button class="checkout-btn">Proceed to Checkout</button>
    </div>
  `;
  
  // Remove existing totals if any
  const existingTotals = document.querySelector(".cart-totals");
  if (existingTotals) {
    existingTotals.remove();
  }
  
  // Insert after product list
  const productList = document.querySelector(".product-list");
  productList.insertAdjacentHTML("afterend", totalsHTML);
  
  // Add checkout button listener
  addCheckoutListener();
}

function addCheckoutListener() {
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
      window.location.href = "../checkout/index.html";
    });
  }
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
    renderCartContents(); // Re-render the cart (includes totals)
  }


// Initialize newsletter after header/footer is loaded
loadHeaderFooter().then(() => {
  updateCartIcon();
  renderCartContents();
  
  // Initialize newsletter
  new Newsletter();
});
}