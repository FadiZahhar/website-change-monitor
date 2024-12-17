const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailReport = async (subject, report) => {
  try {
    // Validate the report structure
    if (!report || !Array.isArray(report.details) || !report.summary) {
      throw new Error("Invalid report structure. Ensure 'summary' and 'details' exist.");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construct Plain Text Version of the Report
    const text = `
Website Monitoring Report
---------------------------
Summary: ${report.summary}

Details:
${report.details
  .map((item) => {
    return `${item.url}
Status: ${item.status}
${item.diffImage ? `Diff Image: ${item.diffImage}` : ''}`;
  })
  .join('\n\n')}
`;

    // Construct HTML Version of the Report
    const html = `
      <h2>Website Monitoring Report</h2>
      <p><strong>Summary:</strong> ${report.summary}</p>
      <ul>
        ${report.details
          .map((item) => {
            return `
              <li>
                <strong>URL:</strong> ${item.url}<br>
                <strong>Status:</strong> ${item.status}<br>
                ${
                  item.diffImage
                    ? `<strong>Diff Image:</strong> <a href="${item.diffImage}" target="_blank">View Image</a>`
                    : ''
                }
              </li>
            `;
          })
          .join('')}
      </ul>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `"Website Monitor" <${process.env.EMAIL_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject,
      text, // Plain text version
      html, // HTML version
    });

    console.log(`Email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = sendEmailReport;
