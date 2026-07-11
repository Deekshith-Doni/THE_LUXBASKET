import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAdminNotification = async (inquiry) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    
    if (!adminEmail || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email configuration missing. Skipping admin notification.");
      return false;
    }

    const mailOptions = {
      from: `"${process.env.NEXT_PUBLIC_APP_NAME || "The Lux Basket"}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Inquiry: ${inquiry.type.toUpperCase()} from ${inquiry.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #0f3b33; border-bottom: 2px solid #c5a880; padding-bottom: 10px;">New Inquiry Received</h2>
          <p>A new inquiry was submitted on the website. Here are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9; width: 120px;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;">${inquiry.name}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;">${inquiry.phone}</td></tr>
            ${inquiry.company ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;"><strong>Company:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;">${inquiry.company}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;"><strong>Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9; text-transform: capitalize;">${inquiry.type}</td></tr>
            ${inquiry.eventDate ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;"><strong>Event Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;">${inquiry.eventDate}</td></tr>` : ''}
            ${inquiry.quantity ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;"><strong>Quantity:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;">${inquiry.quantity}</td></tr>` : ''}
            ${inquiry.budget ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;"><strong>Budget:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0efe9;">${inquiry.budget}</td></tr>` : ''}
          </table>
          
          <h3 style="color: #0f3b33; margin-top: 25px;">Message:</h3>
          <blockquote style="border-left: 4px solid #c5a880; padding-left: 15px; margin-left: 0; background-color: #fcfcfb; padding: 15px; border-radius: 0 4px 4px 0;">
            ${inquiry.message.replace(/\n/g, '<br/>')}
          </blockquote>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/inquiries" style="background-color: #0f3b33; color: #fffcf8; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View in Admin Dashboard</a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return false;
  }
};
