import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class Newsletter {
  constructor() {
    this.modal = null;
    this.form = null;
    this.messageEl = null;
    this.init();
  }

  init() {
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
      this.setupElements();
      this.setupEventListeners();
      this.checkFirstVisit();
    }, 200);
  }

  setupElements() {
    this.modal = document.getElementById('newsletterModal');
    this.form = document.getElementById('newsletterForm');
    this.messageEl = document.getElementById('newsletterMessage');
    
    // If elements still don't exist, log and return
    if (!this.modal || !this.form) {
      console.log('Newsletter elements not found - they may not be in the current page');
      return;
    }
  }

  setupEventListeners() {
    // Check if elements exist before setting up listeners
    if (!this.modal || !this.form) return;

    // Open modal
    const newsletterBtn = document.getElementById('newsletterBtn');
    if (newsletterBtn) {
      newsletterBtn.addEventListener('click', () => {
        this.openModal();
      });
    }

    // Close modal
    const closeBtn = document.getElementById('closeNewsletter');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Close modal when clicking outside
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Handle form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('show')) {
        this.closeModal();
      }
    });
  }

  openModal() {
    if (!this.modal) return;
    this.modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('show');
    document.body.style.overflow = '';
    this.clearForm();
  }

  clearForm() {
    if (!this.form) return;
    this.form.reset();
    this.hideMessage();
  }

  hideMessage() {
    if (!this.messageEl) return;
    this.messageEl.style.display = 'none';
    this.messageEl.className = 'newsletter-message';
  }

  showMessage(message, type = 'success') {
    if (!this.messageEl) return;
    this.messageEl.textContent = message;
    this.messageEl.className = `newsletter-message ${type}`;
    this.messageEl.style.display = 'block';
    
    this.messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  validateForm(formData) {
    const errors = [];

    const email = formData.get('email');
    if (!email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    const consent = formData.get('consent');
    if (!consent) {
      errors.push('You must agree to receive emails');
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async handleSubmit() {
    if (!this.form) return;
    
    const formData = new FormData(this.form);
    const errors = this.validateForm(formData);

    if (errors.length > 0) {
      this.showMessage(errors[0], 'error');
      return;
    }

    this.setLoadingState(true);

    try {
      await this.subscribeToNewsletter(formData);
      this.saveSubscription(formData);
      this.showMessage('🎉 Success! Thank you for subscribing to our newsletter!', 'success');
      
      setTimeout(() => {
        this.closeModal();
      }, 3000);

    } catch (error) {
      this.showMessage('❌ Failed to subscribe. Please try again.', 'error');
    } finally {
      this.setLoadingState(false);
    }
  }

  async subscribeToNewsletter(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Subscribed successfully'
        });
      }, 1000);
    });
  }

  saveSubscription(formData) {
    const subscription = {
      name: formData.get('name'),
      email: formData.get('email'),
      subscribedAt: new Date().toISOString()
    };

    const subscriptions = getLocalStorage('newsletter-subscriptions') || [];
    subscriptions.push(subscription);
    setLocalStorage('newsletter-subscriptions', subscriptions);
    setLocalStorage('newsletter-subscribed', true);
  }

  setLoadingState(loading) {
    if (!this.form) return;
    
    const submitBtn = this.form.querySelector('.subscribe-btn');
    if (!submitBtn) return;
    
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    if (loading) {
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';
    } else {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  }

  checkFirstVisit() {
    // Only auto-open if we're on the home page and modal exists
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
      const hasSeenModal = getLocalStorage('newsletter-modal-seen');
      if (!hasSeenModal && this.modal) {
        setTimeout(() => {
          this.openModal();
          setLocalStorage('newsletter-modal-seen', true);
        }, 3000);
      }
    }
  }
}

// Initialize newsletter when module loads
new Newsletter();