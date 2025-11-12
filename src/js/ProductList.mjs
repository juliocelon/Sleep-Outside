import { renderListWithTemplate } from './utils.mjs';

export default class ProductList {
    //Constructor
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    //Methods
    async init() {
        //Use dataSource to get the list of products to work with
        const list = await this.dataSource.getData();

        //Create product cards
        this.renderList(list);

        // //Check to see list is working
        // console.log(list);
    }


    renderList(list) {
        // //Create an array of product cards for each item in the list
        // const htmlStrings = list.map(productCardTemplate);
        // //Join the items in the list together and insert into the listElement (in main we call <ul> from the index.html file as the listElement)
        // this.listElement.insertAdjacentHTML('afterbegin', htmlStrings.join('')); //join prevents commas between each list item (<li></li>)

        //Render product cards for tents using renderListWithTemplate        
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }    

}

//Global Functions
function productCardTemplate(product) {
    return `<li class="product-card">
          <a href="/product_pages/?product=${product.Id}">
            <img src="${product.Image}" alt="${product.Name}" />
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.NameWithoutBrand}</h2>
            <p class="product-card__price">$${product.FinalPrice}</p>
          </a>
        </li>`
}