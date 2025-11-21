import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

export default class CheckoutProcess {
    //Constructor
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    //Methods
    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
    }

    async checkout(form) {
        //Get the form element data by the form name
        const formElement = document.querySelector(form);
        //Convert form data to JSON order object using formDataToJSON function
        const formJSON = formDataToJSON(formElement);
        
        //Populate JSON order object with order Date, orderTotal, tax, shipping, list of items
        //Timestamp for when checkout is submitted
        const timestamp = new Date().toISOString();
        
        //Order Info
        this.calculateOrderTotal(); //Ensures calculations are completed just before object is created

        //Get Cart items
        const cartItems = packageItems(this.list);

        const checkoutObject = {
            orderDate: timestamp,
            ...formJSON, //pulls in all form fields automatically
            items: cartItems,
            orderTotal: this.orderTotal,
            shipping: this.shipping,
            tax: this.tax
        };
        
        //Save to server, have try/catch to catch any errors
        try {
            const response = await services.submitCheckout(checkoutObject);
            console.log(response);

            //Clear the cart        
            localStorage.removeItem('so-cart');
            //Go to success page
            window.location.href = "/checkout/success.html";

            return response;
            
        } catch (err) {
            console.log(err);
        }
    }

    calculateItemSubTotal() {
        const cartItems = this.list

        //Create an array of all the prices and quantities of the items in the cart
        const totalComponents = cartItems.map(item => ({
            price: item.FinalPrice,
            quantity: item.quantity
        }));
        //Sum the subtotals (price*quantity) for all the items in the cart using reduce
        this.itemTotal = totalComponents.reduce((sum, item) => sum + (item.price * item.quantity), 0); //0 is initial value of the accumulator  
        
        //Display the subtotal
        const subTotal = document.querySelector(`${this.outputSelector} #checkout-subtotal`);
        subTotal.innerHTML = `Subtotal: $${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        //Calculate taxes
        this.tax = 0.06 * this.itemTotal;
        
        //Calculate shipping, $10 for first item, $2 for each additional item              
        const numberItemsInCart = this.list.length;              
        this.shipping = 10 + 2 * (numberItemsInCart - 1);        

        //Calculate order total
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        //Display the Totals
        this.displayOrderTotals();

    }

    displayOrderTotals() {
        const tax = document.querySelector(`${this.outputSelector} #checkout-taxes`);
        const shipping = document.querySelector(`${this.outputSelector} #checkout-shipping`);
        const totalCost = document.querySelector(`${this.outputSelector} #checkout-total`);

        tax.innerHTML = `Taxes: $${this.tax.toFixed(2)}`;
        shipping.innerHTML = `Shipping: $${this.shipping.toFixed(2)}`;
        totalCost.innerHTML = `Total: $${this.orderTotal.toFixed(2)}`;
    } 
}



//Global Functions

//Function that will be used to prepare the order items list
function packageItems(items) {
    //Products in Cart    
    const cartArray = items.map(item => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.quantity
    }));

    return cartArray;
};


//Function to convert data entered in the form to a JSON
function formDataToJSON(formElement) {
    //Data from form   
    const formData = new FormData(formElement);
    const convertedJSON = {};
    
    //For each input in the form, add it to the JSON object as a key:value pair
    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });

    return convertedJSON;
};

