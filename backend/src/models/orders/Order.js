class Order {
  constructor(id, createdAt, updatedAt, status, totalAmount, deliveryMethod, address, postalCode, province, username, userFirstName, userLastName, userEmail, user, items) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.totalAmount = totalAmount;
    this.deliveryMethod = deliveryMethod;
    this.address = address;
    this.postalCode = postalCode;
    this.province = province;
    this.username = username;
    this.userFirstName = userFirstName;
    this.userLastName = userLastName;
    this.userEmail = userEmail;
    this.user = user;
    this.items = items;
  }
}

module.exports = Order;
