const API_URL = "http://localhost:3000";
let token = null;

async function register() {
  const body = {
    username: document.getElementById("regUsername").value,
    password: document.getElementById("regPassword").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    role: document.getElementById("role").value,
  };

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  alert(data.message || data.error);
}

async function login() {
  const body = {
    username: document.getElementById("loginUsername").value,
    password: document.getElementById("loginPassword").value,
  };

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.token) {
    token = data.token;
    document.getElementById("tokenDisplay").textContent = token;
    alert("Login exitoso");
  } else {
    alert(data.error);
  }
}

async function createProduct() {
  const body = {
    name: document.getElementById("productName").value,
    description: document.getElementById("productDesc").value,
    category: document.getElementById("productCat").value,
    price: parseFloat(document.getElementById("productPrice").value),
    imageUrl: document.getElementById("productImg").value,
  };

  const res = await fetch(`${API_URL}/products/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  alert(data.message || data.error);
}

async function purchase() {
  const body = {
    variantId: parseInt(document.getElementById("variantId").value),
    quantity: parseInt(document.getElementById("quantity").value),
  };

  const res = await fetch(`${API_URL}/products/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  alert(data.message || data.error);
}
