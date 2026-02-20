const { Op } = require('sequelize');
const { Transaction, TransactionDetailsList, TransactionPaymentMethod, Product, ProductCategory, User, Customer, PaymentMethod } = require('../models');
const productService = require('./productService');
const logger = require('../config/logger');

class TransactionService {
  async getTransactionByDateRange(startDate, endDate) {
    logger.info('TransactionService.getTransactionByDateRange() invoked');
    
    let start = new Date(startDate);
    let end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Ensure start <= end (timezone can make start after end)
    if (start.getTime() > end.getTime()) {
      [start, end] = [end, start];
      end.setHours(23, 59, 59, 999);
      logger.warn('getTransactionByDateRange: start was after end, swapped to valid range');
    }

    const transactions = await Transaction.findAll({
      where: {
        dateTime: {
          [Op.between]: [start, end]
        }
      },
      include: [
        { model: User, as: 'user' },
        { model: Customer, as: 'customer' },
        { 
          model: TransactionDetailsList, 
          as: 'transactionDetailsList',
          include: [{ model: Product, as: 'product', include: [{ model: ProductCategory, as: 'categoryInfo' }] }]
        },
        { 
          model: TransactionPaymentMethod, 
          as: 'transactionPaymentMethod',
          include: [{ model: PaymentMethod, as: 'paymentMethod' }]
        }
      ],
      order: [['dateTime', 'DESC']]
    });

    return transactions.map(t => this.transformToDto(t));
  }

  async getTransactionById(id) {
    logger.info('TransactionService.getTransactionById() invoked');
    
    const transaction = await Transaction.findByPk(id, {
      include: [
        { model: User, as: 'user' },
        { model: Customer, as: 'customer' },
        { 
          model: TransactionDetailsList, 
          as: 'transactionDetailsList',
          include: [{ model: Product, as: 'product', include: [{ model: ProductCategory, as: 'categoryInfo' }] }]
        },
        { 
          model: TransactionPaymentMethod, 
          as: 'transactionPaymentMethod',
          include: [{ model: PaymentMethod, as: 'paymentMethod' }]
        }
      ]
    });

    return transaction ? [this.transformToDto(transaction)] : [];
  }

  async getTransactionByUserId(userId) {
    logger.info('TransactionService.getTransactionByUserId() invoked');
    
    const transactions = await Transaction.findAll({
      where: { userId },
      include: [
        { model: User, as: 'user' },
        { model: Customer, as: 'customer' },
        { 
          model: TransactionDetailsList, 
          as: 'transactionDetailsList',
          include: [{ model: Product, as: 'product', include: [{ model: ProductCategory, as: 'categoryInfo' }] }]
        },
        { 
          model: TransactionPaymentMethod, 
          as: 'transactionPaymentMethod',
          include: [{ model: PaymentMethod, as: 'paymentMethod' }]
        }
      ],
      order: [['dateTime', 'DESC']]
    });

    return transactions.map(t => this.transformToDto(t));
  }

  async getTransactionByCustomerId(customerId) {
    logger.info('TransactionService.getTransactionByCustomerId() invoked');
    
    const transactions = await Transaction.findAll({
      where: { customerId },
      include: [
        { model: User, as: 'user' },
        { model: Customer, as: 'customer' },
        { 
          model: TransactionDetailsList, 
          as: 'transactionDetailsList',
          include: [{ model: Product, as: 'product', include: [{ model: ProductCategory, as: 'categoryInfo' }] }]
        },
        { 
          model: TransactionPaymentMethod, 
          as: 'transactionPaymentMethod',
          include: [{ model: PaymentMethod, as: 'paymentMethod' }]
        }
      ],
      order: [['dateTime', 'DESC']]
    });

    return transactions.map(t => this.transformToDto(t));
  }

  async getTransactionByPaymentMethodId(paymentMethodId) {
    logger.info('TransactionService.getTransactionByPaymentMethodId() invoked');
    
    const transactions = await Transaction.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Customer, as: 'customer' },
        { 
          model: TransactionDetailsList, 
          as: 'transactionDetailsList',
          include: [{ model: Product, as: 'product', include: [{ model: ProductCategory, as: 'categoryInfo' }] }]
        },
        { 
          model: TransactionPaymentMethod, 
          as: 'transactionPaymentMethod',
          where: { paymentMethodId },
          required: true,
          include: [{ model: PaymentMethod, as: 'paymentMethod' }]
        }
      ],
      order: [['dateTime', 'DESC']]
    });

    return transactions.map(t => this.transformToDto(t));
  }

  async save(transactionDto, alertMessage) {
    logger.info('TransactionService.save() invoked');
    
    // Validate required entities exist
    const customerId = transactionDto.customerDto?.id || transactionDto.customerId;
    const userId = transactionDto.userDto?.id || transactionDto.userId;
    
    if (customerId) {
      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        throw new Error(`Customer with ID ${customerId} not found`);
      }
    } else {
      throw new Error('Customer ID is required');
    }
    
    if (userId) {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
    } else {
      throw new Error('User ID is required');
    }
    
    // Validate transaction details list
    if (!transactionDto.transactionDetailsList || transactionDto.transactionDetailsList.length === 0) {
      throw new Error('Transaction details list is required and cannot be empty');
    }
    
    // Validate all products exist before processing
    for (const details of transactionDto.transactionDetailsList) {
      const productId = details.productDto?.id || details.productId;
      if (!productId) {
        throw new Error('Product ID is required in transaction details');
      }
      
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
    }
    
    // Validate payment methods exist
    if (!transactionDto.transactionPaymentMethod || transactionDto.transactionPaymentMethod.length === 0) {
      throw new Error('Transaction payment method is required and cannot be empty');
    }
    
    for (const payment of transactionDto.transactionPaymentMethod) {
      const paymentMethodId = payment.paymentMethodDto?.id || payment.paymentMethodId;
      if (!paymentMethodId) {
        throw new Error('Payment method ID is required');
      }
      
      const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);
      if (!paymentMethod) {
        throw new Error(`Payment method with ID ${paymentMethodId} not found`);
      }
    }
    
    // Update product quantities
    let lowStockAlert = null;
    
    for (const details of transactionDto.transactionDetailsList || []) {
      if (details.productDto && details.productDto.id) {
        const productId = details.productDto.id;
        const products = await productService.getProductById(productId);
        
        if (products && products.length > 0) {
          const productDto = products[0];
          const productCategory = productDto.productCategoryDto;
          
          const isSpecialCategory = productCategory && 
            (productCategory.productCategoryName === 'Custom' || 
             productCategory.productCategoryName === 'Non Scan');
          
          if (!isSpecialCategory) {
            const newQuantity = productDto.quantity - details.quantity;
            
            if (newQuantity < 0) {
              throw new Error(`Insufficient stock for product ID: ${productId}`);
            }
            
            if (newQuantity <= productDto.lowStock) {
              lowStockAlert = `ALERT: Product '${productDto.name}' (ID: ${productDto.id}) is low on stock. Remaining quantity: ${newQuantity}`;
              logger.info(lowStockAlert);
            }
            
            // Update product quantity
            await productService.updateProduct({
              ...productDto,
              quantity: newQuantity
            });
          } else {
            logger.info(`Skipping quantity update for special category productId: ${productId}`);
          }
        }
      }
    }

    // Create transaction
    const transaction = await Transaction.create({
      dateTime: transactionDto.dateTime ? new Date(transactionDto.dateTime) : new Date(),
      totalAmount: transactionDto.totalAmount,
      balanceAmount: transactionDto.balanceAmount || 0,
      status: transactionDto.status || 'Completed',
      userId: userId,
      customerId: customerId,
      isActive: transactionDto.isActive !== undefined ? transactionDto.isActive : true,
      manualDiscount: transactionDto.manualDiscount || 0,
      employeeDiscount: transactionDto.employeeDiscount || 0,
      generateDateTime: transactionDto.generateDateTime ? new Date(transactionDto.generateDateTime) : null
    });

    // Create transaction details
    for (const detailsDto of transactionDto.transactionDetailsList || []) {
      await TransactionDetailsList.create({
        transactionId: transaction.id,
        productId: detailsDto.productDto?.id || detailsDto.productId,
        quantity: detailsDto.quantity,
        unitPrice: detailsDto.unitPrice,
        discount: detailsDto.discount || 0
      });
    }

    // Create payment methods
    for (const paymentDto of transactionDto.transactionPaymentMethod || []) {
      await TransactionPaymentMethod.create({
        transactionId: transaction.id,
        paymentMethodId: paymentDto.paymentMethodDto?.id || paymentDto.paymentMethodId,
        amount: paymentDto.amount
      });
    }

    const savedTransaction = await Transaction.findByPk(transaction.id, {
      include: [
        { model: User, as: 'user' },
        { model: Customer, as: 'customer' },
        { 
          model: TransactionDetailsList, 
          as: 'transactionDetailsList',
          include: [{ model: Product, as: 'product', include: [{ model: ProductCategory, as: 'categoryInfo' }] }]
        },
        { 
          model: TransactionPaymentMethod, 
          as: 'transactionPaymentMethod',
          include: [{ model: PaymentMethod, as: 'paymentMethod' }]
        }
      ]
    });

    const result = this.transformToDto(savedTransaction);
    if (lowStockAlert || alertMessage) {
      result.notification = lowStockAlert || alertMessage;
    }
    
    return result;
  }

  async getAllTransaction() {
    logger.info('TransactionService.getAllTransaction() invoked');
    
    const transactions = await Transaction.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Customer, as: 'customer' },
        { 
          model: TransactionDetailsList, 
          as: 'transactionDetailsList',
          include: [{ model: Product, as: 'product', include: [{ model: ProductCategory, as: 'categoryInfo' }] }]
        },
        { 
          model: TransactionPaymentMethod, 
          as: 'transactionPaymentMethod',
          include: [{ model: PaymentMethod, as: 'paymentMethod' }]
        }
      ],
      order: [['dateTime', 'DESC']]
    });

    return transactions.map(t => this.transformToDto(t));
  }

  async getTransactionByStatus(isActive) {
    logger.info('TransactionService.getTransactionByStatus() invoked');
    
    const transactions = await Transaction.findAll({
      where: { isActive },
      include: [
        { model: User, as: 'user' },
        { model: Customer, as: 'customer' },
        { 
          model: TransactionDetailsList, 
          as: 'transactionDetailsList',
          include: [{ model: Product, as: 'product', include: [{ model: ProductCategory, as: 'categoryInfo' }] }]
        },
        { 
          model: TransactionPaymentMethod, 
          as: 'transactionPaymentMethod',
          include: [{ model: PaymentMethod, as: 'paymentMethod' }]
        }
      ],
      order: [['dateTime', 'DESC']]
    });

    return transactions.map(t => this.transformToDto(t));
  }

  async updateTransaction(transactionDto) {
    logger.info('TransactionService.updateTransaction() invoked');
    
    let totalAmount = 0.0;
    
    // Calculate total from details
    for (const details of transactionDto.transactionDetailsList || []) {
      if (details.productDto && details.productDto.id) {
        const products = await productService.getProductById(details.productDto.id);
        if (products && products.length > 0) {
          const productDto = products[0];
          details.unitPrice = productDto.pricePerUnit;
          const amountForProduct = (details.unitPrice * details.quantity) - (details.discount || 0);
          totalAmount += amountForProduct;
        }
      }
    }
    
    transactionDto.totalAmount = totalAmount;

    const transaction = await Transaction.findByPk(transactionDto.id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    await transaction.update({
      totalAmount: transactionDto.totalAmount,
      balanceAmount: transactionDto.balanceAmount !== undefined ? transactionDto.balanceAmount : transaction.balanceAmount
    });

    // Update details, payment methods, employees if provided
    // Note: This is simplified - full implementation would handle updates/deletes

    const updatedTransaction = await Transaction.findByPk(transaction.id, {
      include: [
        { model: User, as: 'user' },
        { model: Customer, as: 'customer' },
        { 
          model: TransactionDetailsList, 
          as: 'transactionDetailsList',
          include: [{ model: Product, as: 'product', include: [{ model: ProductCategory, as: 'categoryInfo' }] }]
        },
        { 
          model: TransactionPaymentMethod, 
          as: 'transactionPaymentMethod',
          include: [{ model: PaymentMethod, as: 'paymentMethod' }]
        }
      ]
    });

    return this.transformToDto(updatedTransaction);
  }

  async getTransactionByProductId(productId) {
    logger.info('TransactionService.getTransactionByProductId() invoked');
    
    const transactions = await Transaction.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Customer, as: 'customer' },
        { 
          model: TransactionDetailsList, 
          as: 'transactionDetailsList',
          where: { productId },
          required: true,
          include: [{ model: Product, as: 'product', include: [{ model: ProductCategory, as: 'categoryInfo' }] }]
        },
        { 
          model: TransactionPaymentMethod, 
          as: 'transactionPaymentMethod',
          include: [{ model: PaymentMethod, as: 'paymentMethod' }]
        }
      ],
      order: [['dateTime', 'DESC']]
    });

    return transactions.map(t => this.transformToDto(t));
  }

  /**
   * Helper method: Get last transaction info
   */
  async getLastTransactionInfo() {
    logger.info('TransactionService.getLastTransactionInfo() invoked');
    const lastTransaction = await Transaction.findOne({
      order: [['id', 'DESC']]
    });
    
    if (lastTransaction) {
      return {
        id: lastTransaction.id,
        generateDateTime: lastTransaction.generateDateTime
      };
    }
    return null;
  }

  /**
   * Helper method: Get first transaction dateTime
   */
  async getFirstTransactionDateTime() {
    logger.info('TransactionService.getFirstTransactionDateTime() invoked');
    const firstTransaction = await Transaction.findOne({
      order: [['id', 'ASC']]
    });
    return firstTransaction ? firstTransaction.dateTime : null;
  }

  /**
   * Helper method: Check if all generateDateTimes are null
   */
  async areAllGenerateDateTimesNull() {
    logger.info('TransactionService.areAllGenerateDateTimesNull() invoked');
    const count = await Transaction.count({
      where: {
        generateDateTime: { [Op.ne]: null }
      }
    });
    return count === 0;
  }

  /**
   * Helper method: Get dateTime for transaction ID 1
   */
  async getDateTimeForTransactionIdOne() {
    logger.info('TransactionService.getDateTimeForTransactionIdOne() invoked');
    const transaction = await Transaction.findByPk(1);
    return transaction ? transaction.dateTime : null;
  }

  /**
   * Helper method: Get last generateDateTime
   */
  async getLastGenerateDateTime() {
    logger.info('TransactionService.getLastGenerateDateTime() invoked');
    const lastTransaction = await Transaction.findOne({
      where: {
        generateDateTime: { [Op.ne]: null }
      },
      order: [['generateDateTime', 'DESC']]
    });
    return lastTransaction ? lastTransaction.generateDateTime : null;
  }

  /**
   * Helper method: Get next transaction dateTime after startDate
   */
  async getNextTransactionDateTimeAfter(startDate) {
    logger.info('TransactionService.getNextTransactionDateTimeAfter() invoked');
    const nextTransaction = await Transaction.findOne({
      where: {
        dateTime: { [Op.gt]: startDate }
      },
      order: [['dateTime', 'ASC']]
    });
    return nextTransaction ? nextTransaction.dateTime : null;
  }

  /**
   * Generate X Report
   */
  async getXReport(userId) {
    logger.info('TransactionService.getXReport() invoked');
    
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const reportGeneratedBy = `${user.firstName} ${user.lastName}`;
    
    // Get last transaction info to determine date range
    const lastTransactionInfo = await this.getLastTransactionInfo();
    if (!lastTransactionInfo) {
      throw new Error('No transactions found to generate X-Report');
    }

    const endDate = new Date();
    let startDate;

    // Determine startDate based on generateDateTime logic
    const allGenerateDateTimesNull = await this.areAllGenerateDateTimesNull();
    
    if (allGenerateDateTimesNull) {
      logger.info('All generateDateTime values are null, using dateTime of transaction ID 1');
      startDate = await this.getDateTimeForTransactionIdOne();
      if (!startDate) {
        logger.warn('No transaction found with ID 1, using first transaction dateTime');
        startDate = await this.getFirstTransactionDateTime();
      }
    } else {
      logger.info('Using the last non-null generateDateTime as startDate');
      startDate = await this.getLastGenerateDateTime();
      if (!startDate) {
        logger.warn('No non-null generateDateTime found, falling back to first transaction dateTime');
        startDate = await this.getFirstTransactionDateTime();
      }
    }

    // Find next transaction after startDate
    const nextStartDate = await this.getNextTransactionDateTimeAfter(startDate);
    if (nextStartDate) {
      logger.info('Found next transaction after startDate, new startDate:', nextStartDate);
      startDate = nextStartDate;
    } else {
      logger.warn('No transaction found after startDate:', startDate);
    }

    // Ensure startDate is never after endDate (timezone / clock skew can cause this)
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();
    if (startTime > endTime) {
      logger.warn(`X Report: startDate (${startDate}) was after endDate (${endDate}), using start of day as startDate`);
      startDate = new Date(endDate);
      startDate.setHours(0, 0, 0, 0);
    }

    // Get transactions in date range
    const transactions = await this.getTransactionByDateRange(startDate, endDate);
    
    logger.info(`X Report: Found ${transactions.length} transactions between ${startDate} and ${endDate}`);
    
    const categoryTotals = {};
    const overallPaymentMethodTotals = {};
    const userPaymentDetails = {};
    let totalBalanceAmount = 0.0;

    for (const transaction of transactions) {
      const userName = `${transaction.userDto?.firstName || 'Unknown'} ${transaction.userDto?.lastName || ''}`;
      
      for (const detail of transaction.transactionDetailsList || []) {
        const categoryName = detail.productDto?.productCategoryDto?.productCategoryName || 'Unknown';
        const unitPrice = detail.unitPrice || detail.price || 0;
        const amount = (unitPrice * (detail.quantity || 0)) - (detail.discount || 0);
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + amount;
      }
      
      for (const payment of transaction.transactionPaymentMethod || []) {
        const methodName = payment.paymentMethodDto?.type || 'Unknown';
        const amount = payment.amount || 0;
        overallPaymentMethodTotals[methodName] = (overallPaymentMethodTotals[methodName] || 0) + amount;
        
        if (!userPaymentDetails[userName]) {
          userPaymentDetails[userName] = {};
        }
        userPaymentDetails[userName][methodName] = (userPaymentDetails[userName][methodName] || 0) + amount;
      }
      
      if (transaction.balanceAmount) {
        totalBalanceAmount += transaction.balanceAmount;
      }
    }

    const userPaymentSummary = Object.entries(userPaymentDetails).map(([userName, payments]) => ({
      userName,
      payments
    }));

    // Get cash payment total from payment methods
    const cashTotal = overallPaymentMethodTotals['Cash'] || 0.0;
    const bankingTotal = 0.0;
    const payoutTotal = 0.0;
    const bankingCount = 0;
    const payoutCount = 0;
    const totalDeductions = totalBalanceAmount;
    const difference = cashTotal - totalDeductions;

    return {
      reportGeneratedBy,
      startDate,
      endDate,
      categoryTotals,
      overallPaymentTotals: overallPaymentMethodTotals,
      userPaymentDetails: userPaymentSummary,
      totalTransactions: transactions.length,
      totalSales: Object.values(categoryTotals).reduce((sum, val) => sum + val, 0),
      totalBalanceAmount,
      bankingTotal,
      payoutTotal,
      bankingCount,
      payoutCount,
      difference,
      balanceTotal: totalBalanceAmount
    };
  }

  /**
   * Generate Z Report
   */
  async getZReport(userId) {
    logger.info('TransactionService.getZReport() invoked');
    
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const reportGeneratedBy = `${user.firstName} ${user.lastName}`;
    
    // Get last transaction info to determine date range
    const lastTransactionInfo = await this.getLastTransactionInfo();
    if (!lastTransactionInfo) {
      throw new Error('No transactions found to generate Z-Report');
    }

    const endDate = new Date();
    let startDate;

    // Determine startDate based on generateDateTime logic
    const allGenerateDateTimesNull = await this.areAllGenerateDateTimesNull();
    
    if (allGenerateDateTimesNull) {
      logger.info('All generateDateTime values are null, using dateTime of transaction ID 1');
      startDate = await this.getDateTimeForTransactionIdOne();
      if (!startDate) {
        logger.warn('No transaction found with ID 1, using first transaction dateTime');
        startDate = await this.getFirstTransactionDateTime();
      }
    } else {
      logger.info('Using the last non-null generateDateTime as startDate');
      startDate = await this.getLastGenerateDateTime();
      if (!startDate) {
        logger.warn('No non-null generateDateTime found, falling back to first transaction dateTime');
        startDate = await this.getFirstTransactionDateTime();
      }
    }

    // Find next transaction after startDate
    const nextStartDate = await this.getNextTransactionDateTimeAfter(startDate);
    if (nextStartDate) {
      logger.info('Found next transaction after startDate, new startDate:', nextStartDate);
      startDate = nextStartDate;
    } else {
      logger.warn('No transaction found after startDate:', startDate);
    }

    // Ensure startDate is never after endDate (timezone / clock skew can cause this)
    const startTimeZ = new Date(startDate).getTime();
    const endTimeZ = new Date(endDate).getTime();
    if (startTimeZ > endTimeZ) {
      logger.warn(`Z Report: startDate (${startDate}) was after endDate (${endDate}), using start of day as startDate`);
      startDate = new Date(endDate);
      startDate.setHours(0, 0, 0, 0);
    }

    // Get transactions in date range
    const transactions = await this.getTransactionByDateRange(startDate, endDate);
    
    const dateWiseTotals = {};
    let fullyTotalSales = 0.0;
    let totalBalanceAmount = 0.0;

    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.dateTime);
      const dateKey = transactionDate.toISOString().split('T')[0];
      const userName = `${transaction.userDto.firstName} ${transaction.userDto.lastName}`;

      if (!dateWiseTotals[dateKey]) {
        dateWiseTotals[dateKey] = {
          categoryTotals: {},
          overallPaymentTotals: {},
          userPaymentDetails: {},
          totalSales: 0.0,
          totalTransactions: 0,
          balanceAmount: 0.0
        };
      }

      const dateTotals = dateWiseTotals[dateKey];
      dateTotals.totalTransactions += 1;

      for (const detail of transaction.transactionDetailsList || []) {
        const categoryName = detail.productDto?.productCategoryDto?.productCategoryName || 'Unknown';
        const unitPrice = detail.unitPrice || detail.price || 0;
        const amount = (unitPrice * (detail.quantity || 0)) - (detail.discount || 0);
        dateTotals.categoryTotals[categoryName] = (dateTotals.categoryTotals[categoryName] || 0) + amount;
        dateTotals.totalSales += amount;
        fullyTotalSales += amount;
      }

      for (const payment of transaction.transactionPaymentMethod || []) {
        const methodName = payment.paymentMethodDto?.type || 'Unknown';
        const amount = payment.amount || 0;
        dateTotals.overallPaymentTotals[methodName] = (dateTotals.overallPaymentTotals[methodName] || 0) + amount;
        
        if (!dateTotals.userPaymentDetails[userName]) {
          dateTotals.userPaymentDetails[userName] = {};
        }
        dateTotals.userPaymentDetails[userName][methodName] = (dateTotals.userPaymentDetails[userName][methodName] || 0) + amount;
      }

      if (transaction.balanceAmount) {
        dateTotals.balanceAmount += transaction.balanceAmount;
        totalBalanceAmount += transaction.balanceAmount;
      }
    }

    const bankingTotal = 0.0;
    const payoutTotal = 0.0;
    const bankingCount = 0;
    const payoutCount = 0;
    
    // Calculate total cash payments from all dates
    let totalCash = 0.0;
    for (const dateData of Object.values(dateWiseTotals)) {
      const paymentTotals = dateData.overallPaymentTotals || {};
      totalCash += paymentTotals['Cash'] || 0.0;
    }
    
    const totalDeductions = totalBalanceAmount;
    const difference = totalCash - totalDeductions;

    // Sort dateWiseTotals by date (TreeMap equivalent)
    const sortedDateWiseTotals = {};
    Object.keys(dateWiseTotals).sort().forEach(key => {
      sortedDateWiseTotals[key] = dateWiseTotals[key];
    });

    return {
      reportGeneratedBy,
      startDate,
      endDate,
      dateWiseTotals: sortedDateWiseTotals,
      fullyTotalSales,
      totalBalanceAmount,
      bankingTotal,
      payoutTotal,
      bankingCount,
      payoutCount,
      difference,
      balanceTotal: totalBalanceAmount
    };
  }

  async getAllPageTransaction(pageNumber, pageSize, searchParams) {
    logger.info('TransactionService.getAllPageTransaction() invoked');
    
    const where = {};

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user' },
        { model: Customer, as: 'customer' },
        { 
          model: TransactionDetailsList, 
          as: 'transactionDetailsList',
          include: [{ model: Product, as: 'product', include: [{ model: ProductCategory, as: 'categoryInfo' }] }]
        },
        { 
          model: TransactionPaymentMethod, 
          as: 'transactionPaymentMethod',
          include: [{ model: PaymentMethod, as: 'paymentMethod' }]
        }
      ],
      limit: pageSize,
      offset: offset,
      order: [['dateTime', 'DESC']]
    });

    const transactions = rows.map(t => this.transformToDto(t));

    return {
      content: transactions,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async getCashTotal(userId) {
    logger.info('TransactionService.getCashTotal() invoked');
    
    const transactions = await this.getTransactionByUserId(userId);
    
    let cashTotal = 0.0;
    for (const transaction of transactions) {
      for (const payment of transaction.transactionPaymentMethod || []) {
        if (payment.paymentMethodDto?.type === 'Cash') {
          cashTotal += payment.amount || 0;
        }
      }
    }
    
    return cashTotal;
  }

  transformToDto(transaction) {
    if (!transaction) return null;
    
    return {
      id: transaction.id,
      totalAmount: transaction.totalAmount,
      balanceAmount: transaction.balanceAmount,
      dateTime: transaction.dateTime || transaction.createdAt,
      isActive: transaction.isActive,
      userDto: transaction.user ? {
        id: transaction.user.id,
        firstName: transaction.user.firstName,
        lastName: transaction.user.lastName,
        emailAddress: transaction.user.emailAddress
      } : null,
      customerDto: transaction.customer ? {
        id: transaction.customer.id,
        name: transaction.customer.name,
        mobileNumber: transaction.customer.mobileNumber
      } : null,
      transactionDetailsList: (transaction.transactionDetailsList || []).map(detail => ({
        id: detail.id,
        quantity: detail.quantity,
        unitPrice: detail.price || detail.unitPrice || 0, // Map 'price' field to 'unitPrice' in DTO
        discount: detail.discount || 0,
        productDto: detail.product ? {
          id: detail.product.id,
          name: detail.product.name,
          barcode: detail.product.barcode,
          pricePerUnit: detail.product.pricePerUnit,
          productCategoryDto: detail.product.categoryInfo ? {
            id: detail.product.categoryInfo.id,
            productCategoryName: detail.product.categoryInfo.productCategoryName
          } : null
        } : null
      })),
      transactionPaymentMethod: (transaction.transactionPaymentMethod || []).map(payment => ({
        id: payment.id,
        amount: payment.amount,
        paymentMethodDto: payment.paymentMethod ? {
          id: payment.paymentMethod.id,
          type: payment.paymentMethod.type
        } : null
      }))
    };
  }
}

module.exports = new TransactionService();
