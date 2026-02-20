require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./config/database');
const logger = require('./config/logger');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
// Load all models and associations
const { UserRole, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Routes
app.use('/user', require('./routes/userRoutes'));
app.use('/product', require('./routes/productRoutes'));
app.use('/transaction', require('./routes/transactionRoutes'));
app.use('/customer', require('./routes/customerRoutes'));
app.use('/productCategory', require('./routes/productCategoryRoutes'));
app.use('/tax', require('./routes/taxRoutes'));
app.use('/supplier', require('./routes/supplierRoutes'));
app.use('/stock', require('./routes/stockRoutes'));
app.use('/paymentMethod', require('./routes/paymentMethodRoutes'));
app.use('/userRole', require('./routes/userRoleRoutes'));
app.use('/auth', require('./routes/passwordResetRoutes'));
app.use('/userLogs', require('./routes/userLogsRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    status: false,
    errorCode: err.status || 500,
    errorDescription: err.message || 'Internal server error',
    responseDto: null
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: false,
    errorCode: 404,
    errorDescription: 'Route not found',
    responseDto: null
  });
});

// Initialize default user roles
async function initializeDefaultUserRoles() {
  const defaultRoles = ['Admin', 'Manager', 'Staff'];
  
  try {
    for (const roleName of defaultRoles) {
      const [role, created] = await UserRole.findOrCreate({
        where: { userRole: roleName },
        defaults: {
          userRole: roleName,
          isActive: true
        }
      });
      
      if (created) {
        logger.info(`Created default user role: ${roleName}`);
      } else {
        logger.debug(`User role '${roleName}' already exists, skipping creation.`);
      }
    }
    logger.info('Default user roles initialization completed.');
  } catch (error) {
    logger.error('Error initializing default user roles:', error);
    throw error;
  }
}

// Initialize default user (ID, firstName, lastName, emailAddress, password, mobileNumber, address, isActive, userRoleId, createdDate - no branchId)
async function initializeDefaultUser(userRoleId) {
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { emailAddress: 'mrprusothaman@gmail.com' },
          { firstName: 'Prusothaman' }
        ]
      }
    });
    
    if (existingUser) {
      logger.debug('User \'Prusothaman\' already exists, skipping creation.');
      return;
    }
    
    const hashedPassword = await bcrypt.hash('Pruso2002', 10);
    
    await User.create({
      firstName: 'Prusothaman',
      lastName: 'MR',
      emailAddress: 'mrprusothaman@gmail.com',
      password: hashedPassword,
      mobileNumber: '+94765947337',
      address: 'Jaffna',
      isActive: true,
      userRoleId: userRoleId,
      createdDate: new Date()
    });
    
    logger.info('Created default user: Prusothaman');
  } catch (error) {
    logger.error('Error initializing default user:', error);
    throw error;
  }
}

// Initialize all default data: UserRole (Admin, Manager, Staff) + User (Prusothaman, no branchId)
async function initializeDefaultData() {
  try {
    await initializeDefaultUserRoles();
    const adminRole = await UserRole.findOne({ where: { userRole: 'Admin' } });
    if (!adminRole) {
      throw new Error('Admin role not found. Cannot create default user.');
    }
    await initializeDefaultUser(adminRole.id);
    logger.info('All default data initialization completed.');
  } catch (error) {
    logger.error('Error initializing default data:', error);
    throw error;
  }
}

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    logger.info('Database connection established successfully.');
    // Sync database - create tables if they don't exist
    // NOTE: Set alter: true temporarily to add missing columns, then change back to false
    // WARNING: alter: true can be risky in production - use migrations instead
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    logger.info('Database tables synchronized successfully.');
    // Create default data (roles, country, shop details, branch, user)
    return initializeDefaultData();
  })
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
    process.exit(1);
  });

module.exports = app;
