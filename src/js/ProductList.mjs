import { renderListWithTemplate } from './utils.mjs';

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    this.products = await this.dataSource.getData();
    this.renderList(this.products);
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
  return `
    <li class="product-card">
      <a href="${basePath}product_pages/?product=${product.Id}">
        <img
          src="${product.Image.replace('../', '')}"
          alt="${product.NameWithoutBrand}"
        />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}