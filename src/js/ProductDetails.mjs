import { setLocalStorage, getLocalStorage, getCartCount } from './utils.mjs';

// Enhanced image path fixing function for both dev and preview
function fixImagePath(imagePath) {
  // Extract just the filename from the path
  const filename = imagePath.split('/').pop();
  
  // Check environment
  const isProductionPreview = window.location.href.includes('/Sleep-Outside/');
  const isGitHubPages = window.location.hostname.includes('github.io');
  const isDevelopment = !isProductionPreview && !isGitHubPages;
  
  if (isDevelopment) {
    // Development mode (npm start) - use path that works with Vite dev server
    return `/public/images/tents/${filename}`;
  } else {
    // Production/preview mode - use the mapped hashed filenames
    const imageMap = {
      'marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg': 'marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320-CwrOuOqG.jpg',
      'the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320.jpg': 'the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320-B_cTxQf6.jpg',
      'the-north-face-alpine-guide-tent-3-person-4-season-in-canary-yellow-high-rise-grey~p~985pr_01~320.jpg': 'the-north-face-alpine-guide-tent-3-person-4-season-in-canary-yellow-high-rise-grey~p~985pr_01~320-CJsXUy8z.jpg',
      'cedar-ridge-rimrock-tent-2-person-3-season-in-rust-clay~p~344yj_01~320.jpg': 'cedar-ridge-rimrock-tent-2-person-3-season-in-rust-clay~p~344yj_01~320-BUtqhik6.jpg'
    };
    
    const hashedFilename = imageMap[filename] || filename;
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
    
    // Wait for header to load, then setup cart functionality
    await this.waitForCartElement();
    this.updateCartIcon();
    
    document.getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  // Wait for cart element to be available
  waitForCartElement() {
    return new Promise((resolve) => {
      const checkCartElement = () => {
        const cartElement = document.querySelector('.cart');
        if (cartElement) {
          resolve();
        } else {
          setTimeout(checkCartElement, 100);
        }
      };
      checkCartElement();
    });
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
    const cartElement = document.querySelector('.cart');
    
    if (!cartElement) {
      console.warn('Cart element not found');
      return;
    }
    
    // Remove existing badge if it exists
    const existingBadge = cartElement.querySelector('.cart-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    
    // Add badge if there are items in cart
    if (cartCount > 0) {
      const badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.textContent = cartCount;
      badge.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff4444;
        color: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 12px;
        min-width: 18px;
        text-align: center;
      `;
      
      // Position the cart element relatively so the badge positions correctly
      cartElement.style.position = 'relative';
      cartElement.appendChild(badge);
    }
  }

  addBreadcrumbs() {
    const basePath = window.location.hostname.includes('github.io') ? '/Sleep-Outside/' : '../';
    
    const breadcrumbsHTML = `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><a href="${basePath}">Home</a></li>
          <li><a href="${basePath}product_pages/">Products</a></li>
          <li><span>${this.product.NameWithoutBrand}</span></li>
        </ol>
      </nav>
    `;
    
    document.querySelector('main').insertAdjacentHTML('afterbegin', breadcrumbsHTML);
  }

  renderProductDetails() {
    // Use the enhanced fixImagePath function
    const imagePath = fixImagePath(this.product.Image);
    
    // Calculate discount if any
    const hasDiscount = this.product.SuggestedRetailPrice > this.product.FinalPrice;
    const discountPercent = hasDiscount 
      ? Math.round(((this.product.SuggestedRetailPrice - this.product.FinalPrice) / this.product.SuggestedRetailPrice) * 100)
      : 0;

    document.querySelector('title').textContent = `SleepOutside | ${this.product.Name}`;
    
    // Clear main content first
    document.querySelector('main').innerHTML = '';
    
    // Add breadcrumbs first
    this.addBreadcrumbs();
    
    const productHTML = `
      <section class="product-detail">
        <h3>${this.product.Brand.Name}</h3>
        <h2 class="divider">${this.product.NameWithoutBrand}</h2>
        ${hasDiscount ? `<div class="discount-flag">Save ${discountPercent}%</div>` : ''}
        <img
          class="divider"
          src="${imagePath}"
          alt="${this.product.NameWithoutBrand}"
        />
        <div class="price-container">
          ${hasDiscount ? `<p class="original-price">$${this.product.SuggestedRetailPrice.toFixed(2)}</p>` : ''}
          <p class="product-card__price">$${this.product.FinalPrice}</p>
        </div>
        <p class="product__color">${this.product.Colors[0].ColorName}</p>
        <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
      </section>
    `;
    
    document.querySelector('main').insertAdjacentHTML('beforeend', productHTML);
  }
}