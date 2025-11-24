import { setLocalStorage, getLocalStorage, getCartCount } from './utils.mjs';

// UNIVERSAL basePath detection - works in ALL environments
function getBasePath() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  console.log('🔧 Debug - hostname:', hostname, 'pathname:', pathname);
  
  // GitHub Pages - docs folder is root
  if (hostname === 'oseimacdonald.github.io' && pathname.startsWith('./')) {
    console.log('🔧 Detected GitHub Pages - using root path');
    return './';
  }
  
  // Local development from docs folder
  if ((hostname === '127.0.0.1' || hostname === 'localhost') && 
      (pathname.includes('/docs/') || pathname.endsWith('/docs'))) {
    console.log('🔧 Detected local docs folder - using relative paths');
    return './';
  }
  
  // Local development from src folder
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    console.log('🔧 Detected local development - using relative paths');
    return '../';
  }
  
  // Fallback
  console.log('🔧 Using fallback base path');
  return './';
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
    
    await this.waitForCartElement();
    this.updateCartIcon();
    
    document.getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

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
    let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
    
    if (!Array.isArray(cart)) {
      cart = [cart];
    }
    
    const existingItemIndex = cart.findIndex(item => item.Id === this.product.Id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
      this.product.quantity = 1;
      cart.push(this.product);
    }
    
    setLocalStorage('so-cart', cart);
    this.updateCartIcon();
  }

  updateCartIcon() {
    const cartCount = getCartCount();
    const cartElement = document.querySelector('.cart');
    
    if (!cartElement) return;
    
    const existingBadge = cartElement.querySelector('.cart-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    
    if (cartCount > 0) {
      const badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.textContent = cartCount;
      
      cartElement.style.position = 'relative';
      cartElement.appendChild(badge);
    }
  }

  addBreadcrumbs() {
    const basePath = window.location.hostname.includes('github.io') ? './' : '../';
    
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
    const imagePath = this.product.Images?.PrimaryLarge || 
                    this.product.Images?.PrimaryMedium || 
                    this.product.Images?.PrimaryExtraLarge ||
                    '/images/placeholder.jpg';
    
    const hasDiscount = this.product.SuggestedRetailPrice > this.product.FinalPrice;
    const discountPercent = hasDiscount 
      ? Math.round(((this.product.SuggestedRetailPrice - this.product.FinalPrice) / this.product.SuggestedRetailPrice) * 100)
      : 0;

    document.querySelector('title').textContent = `SleepOutside | ${this.product.Name}`;
    
    document.querySelector('main').innerHTML = '';
    
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
          onerror="this.src='${getBasePath()}public/images/noun_Tent_2517.svg'"
        />
        <div class="price-container">
          ${hasDiscount ? `<p class="original-price">$${this.product.SuggestedRetailPrice.toFixed(2)}</p>` : ''}
          <p class="product-card__price">$${this.product.FinalPrice}</p>
        </div>
        <p class="product__color">${this.product.Colors ? this.product.Colors[0].ColorName : 'N/A'}</p>
        <p class="product__description">${this.product.DescriptionHtmlSimple || this.product.DescriptionHtml || 'No description available'}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
      </section>
    `;
    
    document.querySelector('main').insertAdjacentHTML('beforeend', productHTML);
  }
}