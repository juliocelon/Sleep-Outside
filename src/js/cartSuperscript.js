import { getLocalStorage } from "./utils.mjs";

function cartSuperscript() {
    //Pull items in cart from local storage
    const cartItems = getLocalStorage('so-cart');
    //Count the number of items in the cart
    let numberItemsInCart;
    if (cartItems) {
        numberItemsInCart = cartItems.length;
    } else {
        numberItemsInCart = 0
    }
    

    //Check to see if anything is in the cart
    if (numberItemsInCart>0) { //means if value is NOT falsy (or in other words, is not false, null, 0, etc.)
        //Pull the superscript element from all the index.html's and remove the class list 'hide' so it will show
        const superscript = document.querySelector('.superscript');
        superscript.classList.remove('hide');
        //Count the number of items in the cart and add it as a superscript on the cart icon    
        superscript.textContent = `${numberItemsInCart}`;
    }
}

cartSuperscript();