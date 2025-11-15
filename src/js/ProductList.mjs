import { renderListWithTemplate } from './utils.mjs';

// Add base path detection
function getBasePath() {
  console.log('🔄 getBasePath() called');
  console.log('📍 Current pathname:', window.location.pathname);
  console.log('📍 Hostname:', window.location.hostname);
  
  if (window.location.hostname.includes('github.io')) {
    console.log('🌐 GitHub Pages detected, returning:', '/Sleep-Outside/');
    return '/Sleep-Outside/';
  }
  
  // If we're on the product listing page, we need to go up one level to reach product_pages
  if (window.location.pathname.includes('/product_listing/')) {
    console.log('📁 Product listing page detected, returning:', '../');
    return '../';
  }
  
  console.log('🏠 Default case, returning:', './');
  return './';
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
    this.filteredProducts = [];
  }

  async init() {
    this.products = await this.dataSource.getData();
    this.filteredProducts = [...this.products];
    this.renderList(this.filteredProducts);
    this.addSearchAndSort();
  }

  addSearchAndSort() {
    // Create search and sort controls
    const controlsHTML = `
      <div class="product-controls">
        <div class="search-box">
          <input type="text" id="productSearch" placeholder="Search products..." />
        </div>
        <div class="sort-box">
          <select id="productSort">
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="brand">Sort by Brand</option>
          </select>
        </div>
      </div>
    `;
    
    this.listElement.insertAdjacentHTML('beforebegin', controlsHTML);
    
    // Add event listeners
    document.getElementById('productSearch').addEventListener('input', (e) => {
      this.searchProducts(e.target.value);
    });
    
    document.getElementById('productSort').addEventListener('change', (e) => {
      this.sortProducts(e.target.value);
    });
  }

  searchProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.Name.toLowerCase().includes(term) ||
      product.Brand.Name.toLowerCase().includes(term) ||
      product.NameWithoutBrand.toLowerCase().includes(term)
    );
    this.renderList(this.filteredProducts);
  }

  sortProducts(sortBy) {
    switch(sortBy) {
      case 'name':
        this.filteredProducts.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.FinalPrice - b.FinalPrice);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.FinalPrice - a.FinalPrice);
        break;
      case 'brand':
        this.filteredProducts.sort((a, b) => a.Brand.Name.localeCompare(b.Brand.Name));
        break;
    }
    this.renderList(this.filteredProducts);
  }

  renderList(products) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      products,
      'afterbegin',
      true
    );
  }
}

function productCardTemplate(product) {
  const basePath = getBasePath();
  console.log('🛒 Product card generated for:', product.NameWithoutBrand);
  console.log('🔗 Base path used:', basePath);
  console.log('🔗 Full product URL:', `${basePath}product_pages/?product=${product.Id}`);
  
  // Use API image paths - the Images object contains different sizes
  const imagePath = product.Images?.PrimaryMedium || 
                   product.Images?.PrimaryLarge || 
                   product.Images?.PrimarySmall ||
                   '/images/placeholder.jpg';
  
  // Calculate discount if any
  const hasDiscount = product.SuggestedRetailPrice > product.FinalPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100)
    : 0;

  return `
    <li class="product-card">
      <a href="${basePath}product_pages/?product=${product.Id}">
        <img
          src="${imagePath}"
          alt="${product.NameWithoutBrand}"
          onerror="this.src='${basePath}public/images/noun_Tent_2517.svg'"
        />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        ${hasDiscount ? `<div class="discount-badge">Save ${discountPercent}%</div>` : ''}
        <div class="price-container">
          ${hasDiscount ? `<span class="original-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>` : ''}
          <p class="product-card__price">$${product.FinalPrice}</p>
        </div>
      </a>
    </li>
  `;
}