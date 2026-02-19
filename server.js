require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./config/database');
const logger = require('./config/logger');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
// Load all models and associations
const { UserRole, Country, ShopDetails, Branch, User } = require('./models');

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
app.use('/branch', require('./routes/branchRoutes'));
app.use('/productCategory', require('./routes/productCategoryRoutes'));
app.use('/tax', require('./routes/taxRoutes'));
app.use('/supplier', require('./routes/supplierRoutes'));
app.use('/stock', require('./routes/stockRoutes'));
app.use('/paymentMethod', require('./routes/paymentMethodRoutes'));
app.use('/userRole', require('./routes/userRoleRoutes'));
app.use('/shopDetails', require('./routes/shopDetailsRoutes'));
app.use('/shifts', require('./routes/shiftsRoutes'));
app.use('/staffLeave', require('./routes/staffLeaveRoutes'));
app.use('/payout', require('./routes/payoutRoutes'));
app.use('/payoutCategory', require('./routes/payoutCategoryRoutes'));
app.use('/banking', require('./routes/bankingRoutes'));
app.use('/minimamBanking', require('./routes/minimamBankingRoutes'));
app.use('/voidHistory', require('./routes/voidHistoryRoutes'));
app.use('/salesReport', require('./routes/salesReportRoutes'));
app.use('/purchaseList', require('./routes/purchaseListRoutes'));
app.use('/productDiscount', require('./routes/productDiscountRoutes'));
app.use('/productDiscountType', require('./routes/productDiscountTypeRoutes'));
app.use('/employeeDiscount', require('./routes/employeeDiscountRoutes'));
app.use('/deviceAuth', require('./routes/deviceAuthRoutes'));
app.use('/managerToggle', require('./routes/managerToggleRoutes'));
app.use('/auth', require('./routes/passwordResetRoutes'));
app.use('/userLogs', require('./routes/userLogsRoutes'));
app.use('/aiSales', require('./routes/aiSalesRoutes'));
app.use('/country', require('./routes/countryRoutes'));

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
  const defaultRoles = ['Dev', 'Admin', 'Staff'];
  
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

// Initialize default country
async function initializeDefaultCountry() {
  try {
    const [country, created] = await Country.findOrCreate({
      where: { countryName: 'Sri Lanka' },
      defaults: {
        countryName: 'Sri Lanka',
        isActive: true
      }
    });
    
    if (created) {
      logger.info('Created default country: Sri Lanka');
    } else {
      logger.debug('Country \'Sri Lanka\' already exists, skipping creation.');
    }
    
    return country.id;
  } catch (error) {
    logger.error('Error initializing default country:', error);
    throw error;
  }
}

// Initialize default shop details
async function initializeDefaultShopDetails() {
  try {
    const [shopDetails, created] = await ShopDetails.findOrCreate({
      where: { name: 'yarltech' },
      defaults: {
        name: 'yarltech',
        address: 'Nallur',
        contactNumber: '0212211270',
        email: 'mrprusothaman@gmail.com',
        whatsappNumber: '0765947337',
        isActive: true
      }
    });
    
    if (created) {
      logger.info('Created default shop details: yarltech');
    } else {
      logger.debug('Shop details \'yarltech\' already exists, skipping creation.');
    }
    
    return shopDetails.id;
  } catch (error) {
    logger.error('Error initializing default shop details:', error);
    throw error;
  }
}

// Initialize default branch
async function initializeDefaultBranch(countryId, shopDetailsId) {
  try {
    const [branch, created] = await Branch.findOrCreate({
      where: { branchName: 'Jaffna' },
      defaults: {
        branchName: 'Jaffna',
        branchCode: 'JAF',
        address: 'Nallur',
        contactNumber: '0212211270',
        emailAddress: 'mrprusothaman@gmail.com',
        isActive: true,
        countryId: countryId,
        shopDetailsId: shopDetailsId
      }
    });
    
    if (created) {
      logger.info('Created default branch: Jaffna');
    } else {
      logger.debug('Branch \'Jaffna\' already exists, skipping creation.');
    }
    
    return branch.id;
  } catch (error) {
    logger.error('Error initializing default branch:', error);
    throw error;
  }
}

// Initialize default user
async function initializeDefaultUser(userRoleId, branchId) {
  try {
    // Check if user already exists by email or name
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
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await User.create({
      firstName: 'Prusothaman',
      lastName: 'MR',
      emailAddress: 'mrprusothaman@gmail.com',
      password: hashedPassword,
      mobileNumber: '+94765947337',
      address: 'Jaffna',
      isActive: true,
      userRoleId: userRoleId,
      branchId: branchId,
      createdDate: new Date()
    });
    
    logger.info('Created default user: Prusothaman');
  } catch (error) {
    logger.error('Error initializing default user:', error);
    throw error;
  }
}

// Initialize all default data
async function initializeDefaultData() {
  try {
    // 1. Initialize user roles (already done, but get Dev role ID)
    await initializeDefaultUserRoles();
    const devRole = await UserRole.findOne({ where: { userRole: 'Dev' } });
    if (!devRole) {
      throw new Error('Dev role not found. Cannot create default user.');
    }
    
    // 2. Initialize country
    const countryId = await initializeDefaultCountry();
    
    // 3. Initialize shop details
    const shopDetailsId = await initializeDefaultShopDetails();
    
    // 4. Initialize branch (needs countryId and shopDetailsId)
    const branchId = await initializeDefaultBranch(countryId, shopDetailsId);
    
    // 5. Initialize user (needs userRoleId and branchId)
    await initializeDefaultUser(devRole.id, branchId);
    
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
