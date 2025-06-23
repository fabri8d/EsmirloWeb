const emailForm = document.getElementById('emailForm');
const resetForm = document.getElementById('resetForm');
const stepEmail = document.getElementById('step-email');
const stepReset = document.getElementById('step-reset');
const messageDiv = document.getElementById('message');

let email = null;

// Función simple para validar email con regex básica
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

emailForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageDiv.innerHTML = '';

  const emailInput = document.getElementById('emailInput');
  email = emailInput.value.trim();

  if (!isValidEmail(email)) {
    emailInput.classList.add('is-invalid');
    return;
  }
  emailInput.classList.remove('is-invalid');

  try {
    const res = await fetch('http://localhost:3000/api/auth/requestReset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    messageDiv.innerHTML = `
      <div class="alert alert-info" role="alert">
        Código enviado a <strong>${email}</strong>. Revisa tu correo.
      </div>`;
    
    stepEmail.classList.add('d-none');
    stepReset.classList.remove('d-none');
  } catch (error) {
    messageDiv.innerHTML = `<div class="alert alert-danger" role="alert">${error.message}</div>`;
  }
});

resetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageDiv.innerHTML = '';

  const codeInput = document.getElementById('codeInput');
  const newPasswordInput = document.getElementById('newPasswordInput');

  const code = codeInput.value.trim();
  const newPassword = newPasswordInput.value.trim();

  let hasError = false;

  if (!/^\d{6}$/.test(code)) {
    codeInput.classList.add('is-invalid');
    hasError = true;
  } else {
    codeInput.classList.remove('is-invalid');
  }

  if (newPassword.length < 6) {
    newPasswordInput.classList.add('is-invalid');
    hasError = true;
  } else {
    newPasswordInput.classList.remove('is-invalid');
  }

  if (hasError) return;

  try {
    const res = await fetch('http://localhost:3000/api/auth/changePassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword, resetCode: code }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    messageDiv.innerHTML = `
      <div class="alert alert-success" role="alert">
        ${data.message} Redirigiendo a inicio...
      </div>`;

    resetForm.reset();
    emailForm.reset();
    stepReset.classList.add('d-none');
    stepEmail.classList.remove('d-none');

    setTimeout(() => {
      window.location.href = 'inicio.html';
    }, 2500);
    
  } catch (error) {
    messageDiv.innerHTML = `<div class="alert alert-danger" role="alert">${error.message}</div>`;
  }
});
