const { Op } = require('sequelize');
const { Stock, Product, Supplier, Branch, ProductCategory } = require('../models');
const logger = require('../config/logger');

class StockService {
  async save(stockDto) {
    logger.info('StockService.save() invoked');
    
    const stock = await Stock.create({
      quantity: stockDto.quantity,
      productId: stockDto.productDto?.id || stockDto.productId,
      supplierId: stockDto.supplierDto?.id || stockDto.supplierId,
      branchId: stockDto.branchDto?.id || stockDto.branchId
    });

    const stockWithAssociations = await Stock.findByPk(stock.id, {
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(stockWithAssociations);
  }

  async getAllStock() {
    logger.info('StockService.getAllStock() invoked');
    
    const stocks = await Stock.findAll({
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ],
      order: [['id', 'DESC']]
    });

    return stocks.map(stock => this.transformToDto(stock));
  }

  async getAllPageStock(pageNumber, pageSize, status, searchParams) {
    logger.info('StockService.getAllPageStock() invoked');
    
    const where = {};
    // Note: Stock model doesn't have isActive, but we can filter by product status if needed
    if (status !== undefined && status !== null) {
      // Filter by product's isActive status
      where['$product.isActive$'] = status;
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Stock.findAndCountAll({
      where,
      include: [
        { model: Product, as: 'product', required: status !== undefined },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const stocks = rows.map(stock => this.transformToDto(stock));

    return {
      content: stocks,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async updateStock(stockDto) {
    logger.info('StockService.updateStock() invoked');
    
    const stock = await Stock.findByPk(stockDto.id);
    if (!stock) {
      throw new Error('Stock not found');
    }

    await stock.update({
      quantity: stockDto.quantity !== undefined ? stockDto.quantity : stock.quantity,
      productId: stockDto.productDto?.id || stockDto.productId || stock.productId,
      supplierId: stockDto.supplierDto?.id || stockDto.supplierId || stock.supplierId,
      branchId: stockDto.branchDto?.id || stockDto.branchId || stock.branchId
    });

    const updatedStock = await Stock.findByPk(stock.id, {
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(updatedStock);
  }

  async updateStockStatus(stockId, status) {
    logger.info('StockService.updateStockStatus() invoked');
    // Note: Stock doesn't have isActive, so we update the product's status
    const stock = await Stock.findByPk(stockId, { include: [{ model: Product, as: 'product' }] });
    if (!stock || !stock.product) {
      return null;
    }

    await stock.product.update({ isActive: status });
    
    const updatedStock = await Stock.findByPk(stockId, {
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(updatedStock);
  }

  async getStockById(id) {
    logger.info('StockService.getStockById() invoked');
    
    const stock = await Stock.findByPk(id, {
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ]
    });

    return stock ? [this.transformToDto(stock)] : [];
  }

  async getStockByProductCategoryId(productCategoryId) {
    logger.info('StockService.getStockByProductCategoryId() invoked');
    
    const stocks = await Stock.findAll({
      include: [
        { 
          model: Product, 
          as: 'product',
          where: { productCategory: productCategoryId },
          required: true
        },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ]
    });

    return stocks.map(stock => this.transformToDto(stock));
  }

  async getStockByProductId(productId) {
    logger.info('StockService.getStockByProductId() invoked');
    
    const stocks = await Stock.findAll({
      where: { productId },
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ]
    });

    return stocks.map(stock => this.transformToDto(stock));
  }

  async getStockByQuantityRange(minQuantity, maxQuantity) {
    logger.info('StockService.getStockByQuantityRange() invoked');
    
    const stocks = await Stock.findAll({
      where: {
        quantity: {
          [Op.between]: [minQuantity, maxQuantity]
        }
      },
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ]
    });

    return stocks.map(stock => this.transformToDto(stock));
  }

  transformToDto(stock) {
    if (!stock) return null;
    
    return {
      id: stock.id,
      quantity: stock.quantity,
      productDto: stock.product ? {
        id: stock.product.id,
        name: stock.product.name,
        barcode: stock.product.barcode
      } : null,
      supplierDto: stock.supplier ? {
        id: stock.supplier.id,
        name: stock.supplier.name
      } : null,
      branchDto: stock.branch ? {
        id: stock.branch.id,
        branchName: stock.branch.branchName
      } : null
    };
  }
}

module.exports = new StockService();
