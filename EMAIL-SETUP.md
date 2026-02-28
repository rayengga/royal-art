# Email Configuration Guide

This guide explains how to set up email notifications for orders in Royal Artisanat.

## Overview

When a customer places an order (either as a guest or logged-in user), an automatic email notification is sent to `royalartisants2022@gmail.com` with all order details.

## Email Setup

### Option 1: Using Gmail (Recommended)

1. **Enable 2-Step Verification**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to **Security**
   - Enable **2-Step Verification**

2. **Generate App Password**
   - After enabling 2-Step Verification, go back to **Security**
   - Find **App passwords** section
   - Select **Mail** as the app and **Other** as the device
   - Name it "Royal Artisanat" or similar
   - Copy the generated 16-character password

3. **Update .env File**
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="your-gmail@gmail.com"
   SMTP_PASS="xxxx xxxx xxxx xxxx"  # Use the App Password here (remove spaces)
   ORDER_NOTIFICATION_EMAIL="royalartisants2022@gmail.com"
   ```

### Option 2: Using Other Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
ORDER_NOTIFICATION_EMAIL="royalartisants2022@gmail.com"
```

#### Yahoo Mail
```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@yahoo.com"
SMTP_PASS="your-app-password"  # Generate from Yahoo Account Security
ORDER_NOTIFICATION_EMAIL="royalartisants2022@gmail.com"
```

#### Custom SMTP Server
```env
SMTP_HOST="your-smtp-server.com"
SMTP_PORT="587"  # or 465 for SSL
SMTP_SECURE="false"  # or "true" for port 465
SMTP_USER="your-username"
SMTP_PASS="your-password"
ORDER_NOTIFICATION_EMAIL="royalartisants2022@gmail.com"
```

## Email Content

The notification email includes:

- **Order Information**
  - Order number
  - Order date and time

- **Customer Information**
  - Full name
  - Phone number
  - Governorate (region)
  - Delivery address

- **Order Items**
  - Product name(s)
  - Quantities
  - Unit prices
  - Total amount

- **Professional HTML Template**
  - Branded with Royal Artisanat colors
  - Mobile-responsive design
  - Clear action prompts

## Testing Email Configuration

After configuring your email settings, restart the development server:

```bash
npm run dev
```

Then place a test order through the website. Check your inbox at `royalartisants2022@gmail.com` for the notification email.

## Troubleshooting

### Email Not Sending

1. **Check Console Logs**
   - Look for error messages in the terminal
   - Common errors: authentication failed, connection timeout

2. **Verify Credentials**
   - Ensure SMTP_USER is correct
   - For Gmail, use App Password (not regular password)
   - Check for typos in .env file

3. **Check Firewall/Network**
   - Ensure ports 587 or 465 are not blocked
   - Try from a different network if needed

4. **Gmail Specific Issues**
   - Make sure 2-Step Verification is enabled
   - Regenerate App Password if needed
   - Check "Less secure app access" is OFF (use App Password instead)

### Email Goes to Spam

- Make sure sender email is verified
- Consider using a professional domain email
- Configure SPF, DKIM, and DMARC records for production

## Development vs Production

### Development
- Email sending is optional (errors won't stop orders)
- If SMTP credentials are missing, orders still work but no email is sent
- Console warning: "Email not configured. Skipping email notification."

### Production
- Always configure email for production
- Monitor email delivery in production logs
- Set up alerts for email failures
- Consider using services like SendGrid, Mailgun, or AWS SES for reliability

## Security Notes

⚠️ **Important Security Practices:**

1. **Never commit .env file to version control**
   - .env is already in .gitignore
   - Use .env.example for documentation

2. **Use App Passwords for Gmail**
   - Never use your main Gmail password
   - Rotate App Passwords periodically

3. **Environment Variables in Production**
   - On Vercel: Add to Project Settings → Environment Variables
   - On other platforms: Use their environment variable management

4. **Secure Credentials**
   - Keep SMTP credentials private
   - Use different credentials for dev/production
   - Limit access to production credentials

## Email Service Providers (Alternative)

For production, consider dedicated email services:

- **SendGrid** - Free tier: 100 emails/day
- **Mailgun** - Free tier: 5,000 emails/month
- **AWS SES** - Very cheap, $0.10 per 1,000 emails
- **Postmark** - Specialized in transactional emails

These services offer better deliverability, analytics, and reliability than SMTP.

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all .env variables are set correctly
3. Test with a simple Gmail account first
4. Review email provider's documentation

---

**Last Updated:** February 2026
