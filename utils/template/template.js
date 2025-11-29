export const testEmailTemplateContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testing Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            background-color: #f9f9f9;
        }
        .highlight {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <p>Hi <span class="highlight">John Doe</span>,</p>
        <p>This is a test email to ensure the account creation process works correctly.</p>
        <p>📧 Email: <span class="highlight">john.doe@example.com</span></p>
        <p>🔒 Password: <span class="highlight">Password123</span></p>
        <p>You can login at <a href="https://yourapp.example.com/login">https://yourapp.example.com/login</a>.</p>
        <p>If you have any questions or need assistance, please contact us at 
           <a href="mailto:support@example.com">support@example.com</a> 
           or <a href="tel:+1000000000">+1 000 000 0000</a>.
        </p>
        <p>Thank you for helping us test our system!</p>
        <p>Best regards,</p>
        <p>The Example CRM Team</p>
    </div>
</body>
</html>
`;

export const testWhatsappMessageContent = `
Hi *John Doe*,

This is a test message to ensure the account creation process works correctly.

📧 Email: *john.doe@example.com*
🔒 Password: *examplePassword123*

You can log in at: https://yourapp.example.com/login
If you have any questions or need assistance, please contact us at support@example.com or +1 000 000 0000.

Thank you for helping us test our system!

Best regards,
The Example CRM Team
`;
