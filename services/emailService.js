const nodemailer = require('nodemailer');
const logger = require('../config/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: process.env.MAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER || 'pahanabookstore@gmail.com',
        pass: process.env.MAIL_PASS || 'qucg qljk cwlr nnan'
      }
    });
  }

  /**
   * Send email
   * @param {String} to - Recipient email
   * @param {String} subject - Email subject
   * @param {String} text - Email body
   */
  async sendEmail(to, subject, text) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_USER || 'pahanabookstore@gmail.com',
        to: to,
        subject: subject,
        text: text
      });
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
