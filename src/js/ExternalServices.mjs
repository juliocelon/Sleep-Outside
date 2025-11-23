import { convertToJson, getApiBaseUrl } from "./utils.mjs";

// Use the fixed base URL function
const baseURL = getApiBaseUrl();

export default class ExternalServices {
  constructor(category) {
    this.category = category;
  }
  
  async getData() {
    try {
      console.log('Fetching from:', `${baseURL}/products/search/${this.category}`);
      
      const response = await fetch(`${baseURL}/products/search/${this.category}`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await convertToJson(response);
      console.log('API Response:', data);
      return data.Result || [];
    } catch (error) {
      console.error('API Error:', error);
      return []; // Return empty array instead of throwing
    }
  }
  
  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}/product/${id}`);
      const data = await convertToJson(response);
      return data.Result;
    } catch (error) {
      // Fallback to local data
      const products = await this.getData();
      return products.find((item) => item.Id === id);
    }
  }

  // INSTANCE METHOD FOR CHECKOUT (requires category)
  async checkout(payload) {
    try {
      const response = await fetch(`${baseURL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Checkout failed: ${response.status} ${response.statusText}`);
      }

      return await convertToJson(response);
    } catch (error) {
      console.error('Checkout API error:', error);
      throw error;
    }
  }

  // STATIC METHOD FOR CHECKOUT (no constructor needed)
  static async checkoutOrder(payload) {
    try {
      const response = await fetch(`${baseURL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Checkout failed: ${response.status} ${response.statusText}`);
      }

      return await convertToJson(response);
    } catch (error) {
      console.error('Checkout API error:', error);
      throw error;
    }
  }
}