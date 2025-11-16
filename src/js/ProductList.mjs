import { renderListWithTemplate, discountIndicator } from './utils.mjs';

export default class ProductList {
    // Constructor
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        // Get the list from the data source
        const list = await this.dataSource.getData(this.category);

        // Render the list
        this.renderList(list);

        // Grab the top products header from the DOM
        const topProductHeader = document.querySelector(".top-products-header");
        let categoryHeader;
        if (this.category == 'tents') {
            categoryHeader = 'Tents';
        } else if (this.category == 'backpacks') {
            categoryHeader = 'Backpacks';
        } else if (this.category == 'sleeping-bags') {
            categoryHeader = 'Sleeping Bags';
        } else if (this.category == 'hammocks') {
            categoryHeader = 'Hammocks';
        };
        topProductHeader.insertAdjacentHTML("beforeend", `: ${categoryHeader}`);    
    }


    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }

}

function productCardTemplate(product) {
    return `<li class="product-card">
          <a href="/product_pages/?product=${product.Id}">
            <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.NameWithoutBrand}</h2>
            <p class="product-card__price">$${product.FinalPrice}</p>
            ${discountIndicator(product)}
          </a>
        </li>`
}