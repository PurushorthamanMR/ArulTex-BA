const { Op } = require('sequelize');
const { PurchaseList, Product, Supplier, Branch } = require('../models');
const logger = require('../config/logger');

class PurchaseListService {
  async savePurchaseList(purchaseListDto) {
    logger.info('PurchaseListService.savePurchaseList() invoked');
    
    // Look up product by barcode
    const product = await Product.findOne({
      where: { barcode: purchaseListDto.barcode }
    });

    if (!product) {
      throw new Error('Product not found with barcode: ' + purchaseListDto.barcode);
    }

    const purchaseList = await PurchaseList.create({
      quantity: purchaseListDto.quantity,
      price: purchaseListDto.price,
      productId: product.id,
      supplierId: purchaseListDto.supplierDto?.id || purchaseListDto.supplierId,
      branchId: purchaseListDto.branchDto?.id || purchaseListDto.branchId
    });

    const purchaseListWithAssociations = await PurchaseList.findByPk(purchaseList.id, {
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(purchaseListWithAssociations);
  }

  async getAll() {
    logger.info('PurchaseListService.getAll() invoked');
    
    const purchaseLists = await PurchaseList.findAll({
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ],
      order: [['id', 'DESC']]
    });

    return purchaseLists.map(list => this.transformToDto(list));
  }

  async getAllPagePurchaseList(pageNumber, pageSize, searchParams) {
    logger.info('PurchaseListService.getAllPagePurchaseList() invoked');
    
    const where = {};

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await PurchaseList.findAndCountAll({
      where,
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const purchaseLists = rows.map(list => this.transformToDto(list));

    return {
      content: purchaseLists,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async deleteAll() {
    logger.info('PurchaseListService.deleteAll() invoked');
    
    const deletedCount = await PurchaseList.destroy({
      where: {},
      truncate: true
    });

    return { success: true, deletedCount };
  }

  async deleteById(id) {
    logger.info('PurchaseListService.deleteById() invoked');
    
    const deletedCount = await PurchaseList.destroy({
      where: { id }
    });

    return { success: deletedCount > 0, deletedCount };
  }

  transformToDto(purchaseList) {
    if (!purchaseList) return null;
    
    return {
      id: purchaseList.id,
      quantity: purchaseList.quantity,
      price: purchaseList.price,
      productDto: purchaseList.product ? {
        id: purchaseList.product.id,
        name: purchaseList.product.name,
        barcode: purchaseList.product.barcode
      } : null,
      supplierDto: purchaseList.supplier ? {
        id: purchaseList.supplier.id,
        name: purchaseList.supplier.name
      } : null,
      branchDto: purchaseList.branch ? {
        id: purchaseList.branch.id,
        branchName: purchaseList.branch.branchName
      } : null
    };
  }
}

module.exports = new PurchaseListService();
