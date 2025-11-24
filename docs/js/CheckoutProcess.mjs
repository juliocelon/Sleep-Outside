import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

export default class CheckoutProcess {
  constructor() {
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
    this.cartItems = [];
    
    this.init();
  }

  init() {
    this.loadCartItems();
    this.calculateAndDisplaySubtotal();
    this.setupFormListeners();
  }

  loadCartItems() {
    const cartData = getLocalStorage('so-cart') || [];
    this.cartItems = Array.isArray(cartData) ? cartData : [cartData];
    this.renderOrderItems();
  }

  renderOrderItems() {
    const itemsContainer = document.querySelector('.summary-items');
    
    if (!this.cartItems.length) {
      itemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      return;
    }

    const itemsHTML = this.cartItems.map(item => {
      const quantity = item.quantity || 1;
      const totalPrice = (item.FinalPrice * quantity).toFixed(2);
      
      return `
        <div class="order-item">
          <div class="item-details">
            <h4>${item.Name}</h4>
            <p>Qty: ${quantity} × $${item.FinalPrice}</p>
          </div>
          <div class="item-total">$${totalPrice}</div>
        </div>
      `;
    }).join('');

    itemsContainer.innerHTML = itemsHTML;
  }

  calculateAndDisplaySubtotal() {
    this.subtotal = this.cartItems.reduce((total, item) => {
      const quantity = item.quantity || 1;
      return total + (item.FinalPrice * quantity);
    }, 0);

    document.getElementById('subtotal').textContent = `$${this.subtotal.toFixed(2)}`;
    
    // Calculate tax and shipping when zip code is entered
    this.calculateOrderTotal();
  }

  calculateOrderTotal() {
    // Calculate shipping: $10 for first item + $2 for each additional item
    const totalItems = this.cartItems.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);
    
    this.shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;
    
    // Calculate tax: 6% of subtotal
    this.tax = this.subtotal * 0.06;
    
    // Calculate order total
    this.orderTotal = this.subtotal + this.tax + this.shipping;

    // Update display
    this.updateTotalsDisplay();
  }

  updateTotalsDisplay() {
    document.getElementById('tax').textContent = `$${this.tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${this.shipping.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  // Validation methods
  validateField(field, value) {
    const errors = [];
    
    switch(field) {
      case 'fname':
      case 'lname':
        if (!value.trim()) errors.push('This field is required');
        else if (value.length < 2) errors.push('Must be at least 2 characters');
        else if (value.length > 50) errors.push('Must be less than 50 characters');
        break;
        
      case 'street':
        if (!value.trim()) errors.push('Street address is required');
        else if (value.length < 5) errors.push('Please enter a complete address');
        break;
        
      case 'city':
        if (!value.trim()) errors.push('City is required');
        else if (value.length < 2) errors.push('Please enter a valid city name');
        break;
        
      case 'state':
        if (!value.trim()) errors.push('State is required');
        else if (!/^[A-Za-z]{2}$/.test(value)) errors.push('Please enter a 2-letter state code');
        break;
        
      case 'zip':
        if (!value.trim()) errors.push('Zip code is required');
        else if (!/^\d{5}$/.test(value)) errors.push('Please enter a valid 5-digit zip code');
        break;
        
      case 'cardNumber':
        if (!value.trim()) errors.push('Card number is required');
        else if (!/^\d{16}$/.test(value)) errors.push('Please enter a valid 16-digit card number');
        break;
        
      case 'expiration':
        if (!value.trim()) errors.push('Expiration date is required');
        else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) errors.push('Please use MM/YY format');
        else {
          // Check if expiration is in the future
          const [month, year] = value.split('/');
          const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
          const today = new Date();
          if (expDate < today) errors.push('Card has expired');
        }
        break;
        
      case 'code':
        if (!value.trim()) errors.push('Security code is required');
        else if (!/^\d{3}$/.test(value)) errors.push('Please enter a valid 3-digit security code');
        break;
    }
    
    return errors;
  }

  showFieldError(fieldId, errors) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    const formGroup = field.closest('.form-group');
    
    if (errors.length > 0) {
      formGroup.classList.add('error');
      formGroup.classList.remove('success');
      errorElement.textContent = errors[0];
      errorElement.classList.add('show');
    } else {
      formGroup.classList.remove('error');
      formGroup.classList.add('success');
      errorElement.classList.remove('show');
    }
  }

  validateForm(formData) {
    let isValid = true;
    const allErrors = [];
    
    // Validate each field
    const fields = ['fname', 'lname', 'street', 'city', 'state', 'zip', 'cardNumber', 'expiration', 'code'];
    
    fields.forEach(field => {
      const errors = this.validateField(field, formData[field] || '');
      this.showFieldError(field, errors);
      
      if (errors.length > 0) {
        isValid = false;
        allErrors.push(`${this.getFieldDisplayName(field)}: ${errors[0]}`);
      }
    });
    
    // Show general form errors
    const formErrors = document.getElementById('form-errors');
    if (!isValid) {
      formErrors.innerHTML = `
        <strong>Please fix the following errors:</strong>
        <ul>
          ${allErrors.map(error => `<li>${error}</li>`).join('')}
        </ul>
      `;
      formErrors.classList.add('show');
    } else {
      formErrors.classList.remove('show');
    }
    
    return isValid;
  }

  getFieldDisplayName(field) {
    const names = {
      fname: 'First Name',
      lname: 'Last Name',
      street: 'Street Address',
      city: 'City',
      state: 'State',
      zip: 'Zip Code',
      cardNumber: 'Card Number',
      expiration: 'Expiration Date',
      code: 'Security Code'
    };
    return names[field] || field;
  }

  setupFormListeners() {
    const form = document.getElementById('checkoutForm');
    const zipInput = document.getElementById('zip');

    // Real-time validation on input
    const fields = ['fname', 'lname', 'street', 'city', 'state', 'zip', 'cardNumber', 'expiration', 'code'];
    fields.forEach(field => {
      const input = document.getElementById(field);
      input?.addEventListener('blur', (e) => {
        const errors = this.validateField(field, e.target.value);
        this.showFieldError(field, errors);
      });
      
      // Clear error on input
      input?.addEventListener('input', (e) => {
        const formGroup = e.target.closest('.form-group');
        formGroup.classList.remove('error', 'success');
        document.getElementById(`${field}-error`).classList.remove('show');
        document.getElementById('form-errors').classList.remove('show');
      });
    });

    // Recalculate totals when zip code changes
    zipInput?.addEventListener('change', () => {
      this.calculateOrderTotal();
    });

    // Handle form submission
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleFormSubmit(form);
    });
  }

  packageItems(items) {
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: Number(item.FinalPrice),
      quantity: Number(item.quantity || 1)
    }));
  }

  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const jsonObject = {};
    
    for (const [key, value] of formData.entries()) {
      jsonObject[key] = value;
    }
    
    return jsonObject;
  }

  async handleFormSubmit(form) {
    // Get form data
    const formData = this.formDataToJSON(form);
    
    // Validate form
    if (!this.validateForm(formData)) {
      // Scroll to first error
      const firstError = document.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Show loading state
    this.setLoadingState(true);
    
    try {
      // Prepare order object
      const order = {
        orderDate: new Date().toISOString(),
        fname: formData.fname.trim(),
        lname: formData.lname.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim().toUpperCase(),
        zip: formData.zip.trim(),
        cardNumber: "1234123412341234", // Test value
        expiration: formData.expiration.trim(),
        code: "123", // Test value
        items: this.cartItems.map(item => ({
          id: item.Id,
          name: item.Name,
          price: parseFloat(item.FinalPrice),
          quantity: parseInt(item.quantity || 1)
        })),
        orderTotal: parseFloat(this.orderTotal.toFixed(2)),
        shipping: parseFloat(this.shipping.toFixed(2)),
        tax: parseFloat(this.tax.toFixed(2))
      };

      console.log('Submitting validated order:', order);
      
      // Submit to render server
      const response = await ExternalServices.checkoutOrder(order);
      
      console.log('Order submitted successfully:', response);
      
      // Show success message with order details
      const orderId = response.orderId || 'N/A';
      this.showSuccessMessage(`Order submitted successfully! Order ID: ${orderId}`);
      
      // Clear cart and redirect after delay
      setTimeout(() => {
        localStorage.removeItem('so-cart');
        window.location.href = '../index.html';
      }, 3000);
      
    } catch (error) {
      console.error('Checkout error:', error);
      
      // Determine specific error message based on error type
      let errorMessage = 'Failed to submit order. Please try again.';
      if (error.message.includes('400')) {
        errorMessage = 'Server rejected the order data. Please check your information.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      this.showErrorMessage(`Order NOT submitted. ${errorMessage}`);
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(loading) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (loading) {
      submitBtn.disabled = true;
      btnText.classList.add('hide');
      btnLoading.classList.add('show');
    } else {
      submitBtn.disabled = false;
      btnText.classList.remove('hide');
      btnLoading.classList.remove('show');
    }
  }

  showSuccessMessage(message = 'Order submitted successfully!') {
    // Clear any existing messages first
    this.clearAllMessages();
    
    const form = document.getElementById('checkoutForm');
    const successHTML = `
      <div class="success-message show">
        <strong>✅ Success!</strong>
        <p>${message}</p>
        <p><small>Redirecting to home page in 3 seconds...</small></p>
      </div>
    `;
    form.insertAdjacentHTML('beforebegin', successHTML);
    
    // Scroll to success message
    const successElement = document.querySelector('.success-message');
    successElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }

  showErrorMessage(message) {
    // Clear any existing messages first
    this.clearAllMessages();
    
    const formErrors = document.getElementById('form-errors');
    formErrors.innerHTML = `
      <strong>❌ Order Submission Failed</strong>
      <p>${message}</p>
      <p><small>Please check your information and try again.</small></p>
    `;
    formErrors.classList.add('show');
    formErrors.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }

  clearAllMessages() {
    const successMessage = document.querySelector('.success-message');
    const formErrors = document.getElementById('form-errors');
    
    if (successMessage) {
      successMessage.remove();
    }
    
    if (formErrors) {
      formErrors.classList.remove('show');
    }
  }

  // Keep the original checkout method for backward compatibility
  async checkout(form) {
    console.warn('Using deprecated checkout method. Use handleFormSubmit instead.');
    this.handleFormSubmit(form);
  }
}

// Initialize checkout process when module loads
new CheckoutProcess();