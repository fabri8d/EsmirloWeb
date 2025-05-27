class Order {
  constructor() {
    this.id = undefined;
    this.createdAt = undefined;
    this.updatedAt = undefined;
    this.status = 'pending';
    this.totalAmount = 0.00;
    this.deliveryMethod = 'store_pickup';
    this.address = null;
    this.postalCode = null;
    this.province = null;
    this.username = '';
    this.userFirstName = '';
    this.userLastName = '';
    this.userEmail = '';
    this.user = undefined;
    this.items = [];
  }
}

module.exports = Order;
