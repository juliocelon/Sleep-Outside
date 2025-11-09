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
  console.log('🔧 fixImagePath called with:', imagePath);
  console.log('🔧 Current URL:', window.location.href);
  
  // Check if we're in production preview (has /Sleep-Outside/ in path)
  const isProductionPreview = window.location.href.includes('/Sleep-Outside/');
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  if (!isProductionPreview && !isGitHubPages) {
    console.log('🔧 Development mode - using original path');
    return imagePath;
  } else {
    console.log('🔧 Production mode detected');
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
  }

  async init() {
    console.log('🔄 ProductList.init() started');
    this.products = await this.dataSource.getData();
    console.log('📦 Products loaded:', this.products.length, this.products);
    this.renderList(this.products);
  }

  renderList(products) {
    console.log('🎨 Rendering product list with', products.length, 'products');
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
  console.log('🖼️ Rendering product:', product.NameWithoutBrand);
  
  const basePath = getBasePath();
  const imagePath = fixImagePath(product.Image);
  
  console.log('🖼️ Base path:', basePath);
  console.log('🖼️ Original image:', product.Image);
  console.log('🖼️ Fixed image path:', imagePath);
  console.log('🖼️ Will use in template:', imagePath);
  
  return `
    <li class="product-card">
      <a href="${basePath}product_pages/?product=${product.Id}">
        <img
          src="${imagePath}"
          alt="${product.NameWithoutBrand}"
          onload="console.log('✅ Image loaded successfully:', this.src)"
          onerror="console.log('❌ Image failed to load:', this.src)"
        />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}