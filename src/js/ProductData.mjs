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
    // Use the path that actually works
    this.path = `../json/${this.category}.json`;
  }
  
  getData() {
    console.log('📂 Fetching JSON from:', this.path);
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