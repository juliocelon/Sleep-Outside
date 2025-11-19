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

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    //Methods
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
        subTotal.innerHTML = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        //Calculate taxes
        this.tax = 0.06 * this.itemTotal;
        
        //Calculate shipping, $10 for first item, $2 for each additional item              
        const numberItemsInCart = this.list.length;              
        if (numberItemsInCart === 1) {
            this.shipping = 10;
        } else if (numberItemsInCart > 1) {
            this.shipping = 10 + 2 * (numberItemsInCart - 1);
        }

        //Calculate order total
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        //Display the Totals
        this.displayOrderTotals();

    }

    displayOrderTotals() {
        const tax = document.querySelector(`${this.outputSelector} #checkout-taxes`);
        const shipping = document.querySelector(`${this.outputSelector} #checkout-shipping`);
        const totalCost = document.querySelector(`${this.outputSelector} #checkout-total`);

        tax.innerHTML = `$${this.tax.toFixed(2)}`;
        shipping.innerHTML = `$${this.shipping.toFixed(2)}`;
        totalCost.innerHTML = `$${this.orderTotal.toFixed(2)}`;
    } 

    calculateItemSummary() {
        this.calculateItemSubTotal();
        this.calculateOrderTotal();
    }

}