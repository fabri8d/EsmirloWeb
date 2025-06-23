const { Resend } = require('resend');
require('dotenv').config();
const resend = new Resend(process.env.RESEND_API_KEY);


async function sendEmailOrderUser(usuarioEmail, order) {
  const orderDetailsTable = `
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 50%; margin-bottom: 20px;">
      <thead>
        <tr><th colspan="2">Detalles del pedido</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Número de orden</strong></td>
          <td>${order.id || 'No disponible'}</td>
        </tr>
        <tr>
          <td><strong>Precio final</strong></td>
          <td>${order.totalAmount}</td>
        </tr>
        <tr>
          <td><strong>Método de envío</strong></td>
          <td>${order.deliveryMethod}</td>
        </tr>
      </tbody>
    </table>
  `;

  const orderItemsTable = `
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Color</th>
          <th>Tamaño</th>
          <th>Cantidad</th>
          <th>Precio por unidad</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td>${item.productName}</td>
            <td>${item.variantColor}</td>
            <td>${item.variantSize}</td>
            <td>${item.variantQuantity}</td>
            <td>${item.productPrice}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Esmirlo FC <onboarding@resend.dev>',
      to: usuarioEmail,
      subject: '¡Gracias por tu orden!',
      html: `
        <p><strong>¡Hola! Gracias por tu compra en Esmirlo FC.</strong></p>
        ${orderDetailsTable}
        <p><strong>Productos:</strong></p>
        ${orderItemsTable}
      `,
    });

    if (error) {
      console.error('Error al enviar correo:', error);
      return;
    }
  } catch (err) {
    console.error('Error inesperado:', err);
  }
}


async function sendEmailOrderAdmin(adminEmail, order) {
  const orderDetailsTable = `
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 50%; margin-bottom: 20px;">
      <thead>
        <tr><th colspan="2">Detalles del pedido</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Número de orden</strong></td>
          <td>${order.id || 'No disponible'}</td>
        </tr>
        <tr>
          <td><strong>Precio final</strong></td>
          <td>${order.totalAmount}</td>
        </tr>
        <tr>
          <td><strong>Método de envío</strong></td>
          <td>${order.deliveryMethod}</td>
        </tr>
      </tbody>
    </table>
  `;

  const orderItemsTable = `
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Color</th>
          <th>Tamaño</th>
          <th>Cantidad</th>
          <th>Precio por unidad</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td>${item.productName}</td>
            <td>${item.variantColor}</td>
            <td>${item.variantSize}</td>
            <td>${item.variantQuantity}</td>
            <td>${item.productPrice}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Esmirlo FC <onboarding@resend.dev>',
      to: adminEmail,
      subject: `${order.username} ha realizado un pedido`,
      html: `
        <p><strong>El usuario ${order.username} ha realizado un nuevo pedido.</strong></p>
        ${orderDetailsTable}
        <p><strong>Productos:</strong></p>
        ${orderItemsTable}
      `,
    });

    if (error) {
      console.error('Error al enviar correo:', error);
      return;
    }
  } catch (err) {
    console.error('Error inesperado al enviar correo al admin:', err);
  }
}
async function sendResetEmail(email, code) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Esmirlo FC <onboarding@resend.dev>',
      to: 'leandrobiondi12@gmail.com'/*email*/,
      subject: 'Código de recuperación de contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Recuperación de contraseña - Esmirlo FC</h2>
          <p>Hola, recibimos una solicitud para restablecer tu contraseña.</p>
          <p><strong>Tu código de verificación es:</strong></p>
          <h3 style="background: #f1f1f1; padding: 10px; display: inline-block;">${code}</h3>
          <p>Este código expirará en 15 minutos.</p>
          <p>Si no solicitaste esto, ignorá este correo.</p>
          <br>
          <p>Gracias,<br>Equipo de Esmirlo FC</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error al enviar correo:', error);
    }
  } catch (err) {
    console.error('Error inesperado al enviar correo:', err);
  }
}


module.exports = { sendEmailOrderUser, sendEmailOrderAdmin, sendResetEmail };
