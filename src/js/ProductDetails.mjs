import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    //Constructor
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    //Methods
    async init() {
        //Use the datasource to get the details for the current product
        this.product = await this.dataSource.findProductById(this.productId);
        
        //Call render product details function
        this.renderProductDetails;                
               
        //Click event for addProductToCart
        document.getElementById('addToCart').addEventListener('click', this.addProductToCart.bind(this)); 
        }
    
    //Moved addProducttoCart() function here, got rid of "function" in front because it's a class method rather than a stand-alone function
    addProductToCart() {
        const cartItems = getLocalStorage('so-cart') || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
    }

    //Render HTML as a class function, calls renderHTML for this.product
    renderProductDetails() {
        renderHTML(this.product);
    }

}

function renderHTML(product) {
    //Get elements from HTML
    const brand = document.querySelector('.product__brand');
    const name = document.querySelector('.product__name');
    const image = document.querySelector('.product__image');
    const price = document.querySelector('.product__price');
    const color = document.querySelector('.product__color');
    const description = document.querySelector('.product__description');

    //Populate elements with data
    brand.textContent = product.Brand.Name;
    name.textContent = product.NameWithoutBrand;
    image.src = product.Image;
    image.alt = product.NameWithoutBrand;
    price.textContent = `$${product.FinalPrice.toFixed(2)}`;
    color.textContent = product.Colors[0].ColorName;
    description.innerHTML = product.DescriptionHtmlSimple;

    //Add product id as an attribute of the addToCart button
    const cartButton = document.getElementById('addToCart').dataset.id = product.Id;
}
