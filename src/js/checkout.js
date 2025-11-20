import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

//Call function to load headers and footers
loadHeaderFooter();

//Create new CheckoutProcess
const checkout = new CheckoutProcess('so-cart', '#order-summary');
checkout.init();

//Create event listener to update taxes, shipping, and order total when a zipcode is entered.
const zipcodeInput = document.querySelector('#zipcode');
if (zipcodeInput) {
    zipcodeInput.addEventListener('blur', checkout.calculateOrderTotal.bind(checkout));
    //blur means something was input then the user clicked (or tabbed) away from that input (it was no longer the focus)
}

//Create Event Listener for Form Submit button
document.querySelector("#checkout-submit").addEventListener("click", (event) => {
    event.preventDefault(); //prevents page refresh
    checkout.checkout("#checkout-form");
});