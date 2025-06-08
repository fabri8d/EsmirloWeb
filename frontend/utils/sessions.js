function isTokenExpired(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch {
    return true;
  }
}

export function checkSession() {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    window.location.href = "../pages/inicio.html";
    return false;
  }
  return true;
}
export function logout() {
  localStorage.removeItem("token");
  window.location.href = "../pages/inicio.html";
}
export function adminOnly() {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
        document.getElementById("admin-panel").remove("d-none");
    }
}