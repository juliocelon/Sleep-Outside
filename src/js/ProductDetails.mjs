import { setLocalStorage, getLocalStorage, getCartCount } from './utils.mjs';

// ADD THIS FUNCTION (same as in ProductList.mjs)
function fixImagePath(imagePath) {
  console.log('🔧 ProductDetails - fixImagePath called with:', imagePath);
  console.log('🔧 ProductDetails - Current URL:', window.location.href);
  
  // Check if we're in production preview (has /Sleep-Outside/ in path)
  const isProductionPreview = window.location.href.includes('/Sleep-Outside/');
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  if (!isProductionPreview && !isGitHubPages) {
    console.log('🔧 ProductDetails - Development mode - using original path');
    return imagePath;
  } else {
    console.log('🔧 ProductDetails - Production mode detected');
    // Map original filenames to their hashed versions
    const imageMap = {
      'marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg': 'marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320-CwrOuOqG.jpg',
      'the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320.jpg': 'the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320-B_cTxQf6.jpg',
      'the-north-face-alpine-guide-tent-3-person-4-season-in-canary-yellow-high-rise-grey~p~985pr_01~320.jpg': 'the-north-face-alpine-guide-tent-3-person-4-season-in-canary-yellow-high-rise-grey~p~985pr_01~320-CJsXUy8z.jpg',
      'cedar-ridge-rimrock-tent-2-person-3-season-in-rust-clay~p~344yj_01~320.jpg': 'cedar-ridge-rimrock-tent-2-person-3-season-in-rust-clay~p~344yj_01~320-BUtqhik6.jpg'
    };
    
    const originalFilename = imagePath.split('/').pop();
    const hashedFilename = imageMap[originalFilename] || originalFilename;
    
    return `/Sleep-Outside/assets/${hashedFilename}`;
  }
}

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
    // Use the proper fixImagePath function
    const imagePath = fixImagePath(this.product.Image);
    console.log('🖼️ ProductDetails - Original image:', this.product.Image);
    console.log('🖼️ ProductDetails - Fixed image path:', imagePath);
  
    document.querySelector('title').textContent = `SleepOutside | ${this.product.Name}`;
    
    const productHTML = `
      <section class="product-detail">
        <h3>${this.product.Brand.Name}</h3>
        <h2 class="divider">${this.product.NameWithoutBrand}</h2>
        <img
          class="divider"
          src="${imagePath}"  <!-- Use the fixed image path -->
          alt="${this.product.NameWithoutBrand}"
          onload="console.log('✅ Product image loaded successfully:', this.src)"
          onerror="console.log('❌ Product image failed to load:', this.src)"
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