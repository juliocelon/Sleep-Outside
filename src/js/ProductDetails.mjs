import { setLocalStorage, getLocalStorage, getCartCount } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    this.updateCartIcon();
    
    document.getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    // Get existing cart or initialize empty array
    let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
    
    // If cart is not an array (old single item format), convert to array
    if (!Array.isArray(cart)) {
      cart = [cart];
    }
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.Id === this.product.Id);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
      // Add new item with quantity
      this.product.quantity = 1;
      cart.push(this.product);
    }
    
    // Save updated cart
    setLocalStorage('so-cart', cart);
    this.updateCartIcon();
  }

  updateCartIcon() {
    const cartCount = getCartCount();
    const cartIcon = document.querySelector('.cart');
    
    const existingBadge = cartIcon.querySelector('.cart-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    
    if (cartCount > 0) {
      const badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.textContent = cartCount;
      cartIcon.appendChild(badge);
    }
  }

  renderProductDetails() {
  // Remove this line - it's breaking the image paths
  // const imagePath = this.product.Image.replace('../', '');
  
  document.querySelector('title').textContent = `SleepOutside | ${this.product.Name}`;
  
  const productHTML = `
    <section class="product-detail">
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${this.product.Image}"  <!-- Use the path directly from JSON -->
        alt="${this.product.NameWithoutBrand}"
      />
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    </section>
  `;
  
  document.querySelector('main').innerHTML = productHTML;
}

}