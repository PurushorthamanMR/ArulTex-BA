const crypto = require('crypto');
const { User, PasswordResetToken, UserLogs } = require('../models');
const emailService = require('./emailService');
const userService = require('./userService');
const logger = require('../config/logger');

class PasswordResetService {
  async forgotPassword(request) {
    logger.info('PasswordResetService.forgotPassword() invoked');
    
    const { emailAddress } = request;
    
    // Find user by email
    const user = await User.findOne({ where: { emailAddress } });
    if (!user) {
      throw new Error('User not found with this email address');
    }

    // Check user role - deny "STAFF" role (if needed)
    const userRole = await user.getUserRole();
    // Note: Adjust this logic based on your business requirements
    // Currently allowing all roles to reset password

    // Generate 6-digit reset code
    const token = String(crypto.randomInt(100000, 1000000));
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // Token expires in 1 hour

    // Save or update reset token
    const [resetToken, created] = await PasswordResetToken.findOrCreate({
      where: { userId: user.id },
      defaults: {
        token,
        expiryDate
      }
    });

    if (!created) {
      await resetToken.update({ token, expiryDate });
    }

    // Send email with 6-digit code
    const emailSubject = 'Password Reset Request';
    const emailBody = `
      Hello ${user.firstName},
      
      You requested to reset your password. Please use the 6-digit code below to reset it:
      
      Your Reset Code: ${token}
      
      This code will expire in 1 hour.
      
      If you didn't request this, please ignore this email.
    `;

    try {
      await emailService.sendEmail(emailAddress, emailSubject, emailBody);
    } catch (error) {
      logger.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }

    return {
      success: true,
      message: 'Password reset code sent to your email'
    };
  }

  async resetPassword(request) {
    logger.info('PasswordResetService.resetPassword() invoked');
    
    const { token, newPassword } = request;
    
    // Find reset token
    const resetToken = await PasswordResetToken.findOne({
      where: { token },
      include: [{ model: User, as: 'user' }]
    });

    if (!resetToken) {
      throw new Error('Invalid reset token');
    }

    // Check if token expired
    if (new Date() > resetToken.expiryDate) {
      throw new Error('Reset token has expired');
    }

    // Update user password
    await userService.updatePassword(resetToken.userId, newPassword);

    // Delete reset token
    await resetToken.destroy();

    // Send success confirmation email to user
    const user = resetToken.user || await User.findByPk(resetToken.userId);
    if (user && user.emailAddress) {
      try {
        const emailSubject = 'Password Reset Successful';
        const emailBody = `
Hello ${user.firstName},

Your password has been reset successfully.

If you did not make this change, please contact support immediately.

- Yarltech AruntexPOS
        `.trim();
        await emailService.sendEmail(user.emailAddress, emailSubject, emailBody);
      } catch (error) {
        logger.error('Error sending password reset success email:', error);
        // Don't fail the reset if email fails
      }
    }

    // Create user log
    try {
      await UserLogs.create({
        userId: resetToken.userId,
        description: 'Password reset',
        signOff: false,
        logIn: new Date(),
        logOut: null
      });
    } catch (error) {
      logger.error('Error creating user log:', error);
      // Don't fail the reset if log creation fails
    }

    return {
      success: true,
      message: 'Password reset successfully'
    };
  }
}

module.exports = new PasswordResetService();
