function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // FIXED: Always use the full path with base URL
    this.path = import.meta.env.DEV 
      ? `/public/json/${this.category}.json`
      : `/Sleep-Outside/json/${this.category}.json`;
  }
  
  getData() {
    console.log('📂 Fetching JSON from:', this.path);
    console.log('📍 Full URL:', window.location.origin + this.path);
    console.log('📍 Current page:', window.location.href);
    
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => {
        console.log('✅ JSON data loaded successfully');
        return data;
      })
      .catch(error => {
        console.error('❌ Error loading JSON:', error);
        throw error;
      });
  }
  
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}