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


module.exports = { sendEmailOrderUser, sendEmailOrderAdmin };
