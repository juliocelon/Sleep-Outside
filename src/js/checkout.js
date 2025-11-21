import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

//Call function to load headers and footers
loadHeaderFooter();

//Create new CheckoutProcess
const cartCheckout = new CheckoutProcess('so-cart', '#order-summary');
cartCheckout.init();

//Create event listener to update taxes, shipping, and order total when a zipcode is entered.
const zipcodeInput = document.querySelector('#zipcode');
if (zipcodeInput) {
    zipcodeInput.addEventListener('blur', cartCheckout.calculateOrderTotal.bind(cartCheckout));
    //blur means something was input then the user clicked (or tabbed) away from that input (it was no longer the focus)
}

//Create Event Listener for Form Submit button
document.querySelector("#checkout-submit").addEventListener("click", (event) => {
    event.preventDefault(); //prevents page refresh
    const myForm = document.querySelector('#checkout-form');
    const chk_status = myForm.checkValidity();
    myForm.reportValidity();
    if (chk_status) {        
        cartCheckout.checkout('#checkout-form');
    }
});
