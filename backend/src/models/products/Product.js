class Product {
  constructor(name, description, category, price, imageUrl) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.price = price;
    this.imageUrl = imageUrl;
    this.variants;// mantener arreglo para relación uno a muchos
  }
}

module.exports = Product;
