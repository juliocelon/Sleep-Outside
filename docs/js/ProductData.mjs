function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

// Use environment variable with fallback
const baseURL = import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend.onrender.com/';

export default class ProductData {
  constructor(category) {
    this.category = category;
  }
  
  async getData() {
    try {
      const response = await fetch(`${baseURL}products/search/${this.category}`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await convertToJson(response);
      return data.Result || [];
    } catch (error) {
      // Fallback to local JSON if API fails
      try {
        const fallbackResponse = await fetch(`/public/json/${this.category}.json`);
        return convertToJson(fallbackResponse);
      } catch (fallbackError) {
        throw error;
      }
    }
  }
  
  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      return data.Result;
    } catch (error) {
      // Fallback to local data
      const products = await this.getData();
      return products.find((item) => item.Id === id);
    }
  }
}