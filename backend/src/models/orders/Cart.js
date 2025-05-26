class Cart {
  constructor(id, createdAt, updatedAt, status, user, items) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.user = user;
    this.items = items;
  }
}

module.exports = Cart;
