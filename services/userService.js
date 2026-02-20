const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, UserRole } = require('../models');
const jwtUtil = require('../utils/jwtUtil');
const logger = require('../config/logger');
const emailService = require('./emailService');

class UserService {
  /**
   * Register a new user
   */
  async registerUser(userDto) {
    logger.info('UserService.registerUser() invoked');
    
    // Check if user with email already exists
    const existingUser = await User.findOne({
      where: { emailAddress: userDto.emailAddress }
    });

    if (existingUser) {
      throw new Error(`User with the email id ${userDto.emailAddress} already exists.`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    
    // Create user
    const user = await User.create({
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      password: hashedPassword,
      address: userDto.address,
      emailAddress: userDto.emailAddress,
      mobileNumber: userDto.mobileNumber,
      isActive: userDto.isActive !== undefined ? userDto.isActive : true,
      userRoleId: userDto.userRoleDto?.id || userDto.userRoleId,
      createdDate: new Date()
    });

    // Load with associations
    const userWithAssociations = await User.findByPk(user.id, {
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return this.transformToDto(userWithAssociations);
  }

  /**
   * Login user
   */
  async login(loginDto) {
    logger.info('UserService.login() invoked');
    
    const user = await User.findOne({
      where: { emailAddress: loginDto.username, isActive: true },
      include: [{ model: UserRole, as: 'userRole' }]
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwtUtil.generateToken({
      sub: user.emailAddress,
      username: user.emailAddress,
      emailAddress: user.emailAddress,
      userId: user.id,
      role: user.userRole?.userRole
    });

    return {
      accessToken: token
    };
  }

  /**
   * Get all users with pagination
   */
  async getAll(pageNumber, pageSize, status, searchParams) {
    logger.info('UserService.getAll() invoked');
    
    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }

    // Apply search filters
    if (searchParams) {
      if (searchParams.firstName) {
        where.firstName = { [Op.like]: `%${searchParams.firstName}%` };
      }
      if (searchParams.lastName) {
        where.lastName = { [Op.like]: `%${searchParams.lastName}%` };
      }
      if (searchParams.emailAddress) {
        where.emailAddress = { [Op.like]: `%${searchParams.emailAddress}%` };
      }
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ model: UserRole, as: 'userRole' }],
      limit: pageSize,
      offset: offset,
      order: [['createdDate', 'DESC']]
    });

    const users = rows.map(user => this.transformToDto(user));

    return {
      content: users,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  /**
   * Get user by name
   */
  async getUserByName(firstName, lastName) {
    logger.info('UserService.getUserByName() invoked');
    
    const where = {};
    if (firstName) {
      where.firstName = { [Op.like]: `%${firstName}%` };
    }
    if (lastName) {
      where.lastName = { [Op.like]: `%${lastName}%` };
    }

    const users = await User.findAll({
      where,
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return users.map(user => this.transformToDto(user));
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    logger.info('UserService.getUserById() invoked');
    
    const user = await User.findByPk(id, {
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return user ? [this.transformToDto(user)] : [];
  }

  /**
   * Get users by role
   */
  async getUserByRole(userRole) {
    logger.info('UserService.getUserByRole() invoked');
    
    const role = await UserRole.findOne({ where: { userRole } });
    if (!role) {
      return [];
    }

    const users = await User.findAll({
      where: { userRoleId: role.id },
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return users.map(user => this.transformToDto(user));
  }

  /**
   * Update user details
   */
  async updateUserDetails(userDto) {
    logger.info('UserService.updateUserDetails() invoked');
    
    const user = await User.findByPk(userDto.id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      address: userDto.address,
      emailAddress: userDto.emailAddress,
      mobileNumber: userDto.mobileNumber,
      modifiedDate: new Date(),
      userRoleId: userDto.userRoleDto?.id || userDto.userRoleId || user.userRoleId
    });

    const updatedUser = await User.findByPk(user.id, {
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return this.transformToDto(updatedUser);
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId, status) {
    logger.info('UserService.updateUserStatus() invoked');
    
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }

    await user.update({ isActive: status });

    const updatedUser = await User.findByPk(userId, {
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return this.transformToDto(updatedUser);
  }

  /**
   * Update password
   */
  async updatePassword(userId, password, changedByUserId) {
    logger.info('UserService.updatePassword() invoked');
    
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({
      password: hashedPassword,
      modifiedDate: new Date()
    });

    // Send email notification only if changed by admin/user
    if (changedByUserId) {
      try {
        const adminUser = await User.findByPk(changedByUserId);
        if (adminUser) {
          const emailText = `Your password has been changed by ${adminUser.firstName}.\nYour new password is: ${password}`;
          await emailService.sendEmail(
            user.emailAddress,
            'Password Change Notification',
            emailText
          );
        }
      } catch (error) {
        logger.error('Error sending password change notification email:', error);
        // Don't fail password update if email fails
      }
    }

    const updatedUser = await User.findByPk(userId, {
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return this.transformToDto(updatedUser);
  }

  /**
   * Get user by email address
   */
  async getUserByEmailAddress(emailAddress) {
    logger.info('UserService.getUserByEmailAddress() invoked');
    
    const user = await User.findOne({
      where: { emailAddress },
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return user ? [this.transformToDto(user)] : [];
  }

  /**
   * Transform user model to DTO
   */
  transformToDto(user) {
    if (!user) return null;
    
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      emailAddress: user.emailAddress,
      mobileNumber: user.mobileNumber,
      createdDate: user.createdDate,
      modifiedDate: user.modifiedDate,
      isActive: user.isActive,
      userRoleDto: user.userRole ? {
        id: user.userRole.id,
        userRole: user.userRole.userRole,
        isActive: user.userRole.isActive
      } : null
    };
  }
}

module.exports = new UserService();
