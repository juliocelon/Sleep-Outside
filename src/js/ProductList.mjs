import { renderListWithTemplate } from './utils.mjs';

// Add base path detection
function getBasePath() {
  if (window.location.hostname.includes('github.io')) {
    return '/Sleep-Outside/';
  }
  return './';
}

// Add image path fixing function
function fixImagePath(imagePath) {
  // Check if we're in production preview (has /Sleep-Outside/ in path)
  const isProductionPreview = window.location.href.includes('/Sleep-Outside/');
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  if (!isProductionPreview && !isGitHubPages) {
    return imagePath;
  } else {
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
  const imagePath = fixImagePath(product.Image);
  
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