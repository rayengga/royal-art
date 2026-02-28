import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  governorate: string;
  address?: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderDate: string;
}

// Create transporter
const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  return nodemailer.createTransport(config);
};

// Format order details as HTML
const formatOrderHTML = (data: OrderEmailData): string => {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toFixed(3)} TND</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${(item.price * item.quantity).toFixed(3)} TND</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #F6C967 0%, #4FC3F7 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .order-info { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .info-label { font-weight: bold; color: #6b7280; }
          .info-value { color: #111827; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; color: #374151; }
          .total-row { font-weight: bold; font-size: 18px; background: #fef3c7; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🛍️ Nouvelle Commande</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Royal Artisanat</p>
          </div>
          
          <div class="content">
            <p style="font-size: 16px; margin-bottom: 20px;">Une nouvelle commande a été passée sur votre boutique.</p>
            
            <div class="order-info">
              <h2 style="margin-top: 0; color: #F6C967;">📋 Informations de la commande</h2>
              <div class="info-row">
                <span class="info-label">Numéro de commande:</span>
                <span class="info-value">${data.orderNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${new Date(data.orderDate).toLocaleString('fr-FR')}</span>
              </div>
            </div>

            <div class="order-info">
              <h2 style="margin-top: 0; color: #F6C967;">👤 Informations du client</h2>
              <div class="info-row">
                <span class="info-label">Nom complet:</span>
                <span class="info-value">${data.customerName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Téléphone:</span>
                <span class="info-value">${data.customerPhone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Gouvernorat:</span>
                <span class="info-value">${data.governorate}</span>
              </div>
              ${
                data.address
                  ? `
              <div class="info-row">
                <span class="info-label">Adresse:</span>
                <span class="info-value">${data.address}</span>
              </div>
              `
                  : ''
              }
            </div>

            <h2 style="color: #F6C967;">📦 Articles commandés</h2>
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th style="text-align: center;">Quantité</th>
                  <th style="text-align: right;">Prix unitaire</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
                <tr class="total-row">
                  <td colspan="3" style="padding: 16px; text-align: right;">Total de la commande:</td>
                  <td style="padding: 16px; text-align: right; color: #F59E0B;">${data.totalAmount.toFixed(3)} TND</td>
                </tr>
              </tbody>
            </table>

            <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #F6C967; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>💡 Action requise:</strong> Veuillez contacter le client pour confirmer la commande et organiser la livraison.</p>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0;">© ${new Date().getFullYear()} Royal Artisanat. Tous droits réservés.</p>
            <p style="margin: 5px 0 0 0;">Cet email a été envoyé automatiquement. Ne pas répondre.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Send order notification email
export async function sendOrderNotificationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    // Check if email is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email not configured. Skipping email notification.');
      return false;
    }

    const transporter = createTransporter();
    const recipientEmail = process.env.ORDER_NOTIFICATION_EMAIL || 'royalartisants2022@gmail.com';

    const mailOptions = {
      from: `"Royal Artisanat" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `🛍️ Nouvelle Commande #${data.orderNumber} - Royal Artisanat`,
      html: formatOrderHTML(data),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order notification email sent to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send order notification email:', error);
    return false;
  }
}

// Send test email to verify configuration
export async function sendTestEmail(recipientEmail: string): Promise<boolean> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Email not configured');
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Royal Artisanat" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: 'Test Email - Royal Artisanat',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #F6C967;">Email Configuration Test</h1>
          <p>This is a test email from Royal Artisanat.</p>
          <p>If you received this, your email configuration is working correctly! ✅</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Sent at: ${new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Test email sent to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send test email:', error);
    return false;
  }
}
