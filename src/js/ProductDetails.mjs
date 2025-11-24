import { getLocalStorage, setLocalStorage, discountIndicatorAmount } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
      
        this.product = await this.dataSource.findProductById(this.productId);        
        this.renderProductDetails();
        document
            .getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        
        //Check to see if the item is already in the cart.
        const existingItem = cartItems.find(item => item.Id === this.product.Id);

        //If the item exists in the cart, increase the quantity
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1; //Use the || 1 in case quantity isn't already in local storage
        } else {
            this.product.quantity = 1;
            cartItems.push(this.product);
        }
        
        //Save cart
        setLocalStorage("so-cart", cartItems);

        //Refresh the page so the superscript on the cart icon will update
        location.reload();
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    document.querySelector('h2').textContent = product.Brand.Name;
    document.querySelector('h3').textContent = product.NameWithoutBrand;

    const productImage = document.getElementById('productImage');
    console.log(productImage);
    productImage.src = product.Images.PrimaryLarge;
    productImage.alt = product.NameWithoutBrand;

    document.getElementById('productPrice').textContent = `$${product.FinalPrice}`;
    document.getElementById('productColor').textContent = product.Colors[0].ColorName;
    document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;
    document.getElementById('addToCart').dataset.id = product.Id;
    
    const productDetails = document.querySelector('.product-detail');
    productDetails.insertAdjacentHTML('beforeend', discountIndicatorAmount(product));

    colorOptions(product);
}

function colorOptions(product) {
    const container = document.getElementById('colorOptions');
    container.innerHTML = "";

    product.Colors.forEach((color, index) => {

        const img = document.createElement('img');
        img.src = color.ColorChipImageSrc;
        img.alt = color.ColorName;
        img.classList.add('color-swatch');

        if (index === 0) {
            img.classList.add('selected');
        }
        
        img.addEventListener('click', () => {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));

            img.classList.add('selected');
            document.getElementById('productImage').src = color.ColorPreviewImageSrc;
            document.getElementById('productColor').textContent = color.ColorName;
            product.selectedColor = {
                name: color.ColorName,
                code: color.ColorCode,
                preview: color.ColorPreviewImageSrc
            };
        });

        container.appendChild(img);
    });
    
    product.selectedColor = {
        name: product.Colors[0].ColorName,
        code: product.Colors[0].ColorCode,
        preview: product.Colors[0].ColorPreviewImageSrc
    };
}


