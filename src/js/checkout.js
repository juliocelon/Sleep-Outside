import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

//Call function to load headers and footers
loadHeaderFooter();

//Create new CheckoutProcess
const checkout = new CheckoutProcess('so-cart', '#order-summary');
checkout.init();

