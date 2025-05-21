class User {
  constructor(id, username, firstName, lastName, email, password, role) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

module.exports = User;