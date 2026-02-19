const { Op } = require('sequelize');
const { Product, Tax, ProductCategory } = require('../models');
const logger = require('../config/logger');

class ProductService {
  /**
   * Save a new product
   */
  async save(productDto) {
    logger.info('ProductService.save() invoked');
    
    const product = await Product.create({
      name: productDto.name,
      barcode: productDto.barcode,
      pricePerUnit: productDto.pricePerUnit,
      tax: productDto.taxDto?.id || productDto.tax,
      productCategory: productDto.productCategoryDto?.id || productDto.productCategory,
      quantity: productDto.quantity || 0,
      lowStock: productDto.lowStock || 0,
      purchasePrice: productDto.purchasePrice,
      discountValidation: productDto.discountValidation !== undefined ? productDto.discountValidation : false,
      isActive: productDto.isActive !== undefined ? productDto.isActive : true,
      createdDate: new Date()
    });

    const productWithAssociations = await Product.findByPk(product.id, {
      include: [
        { model: Tax, as: 'taxInfo' },
        { model: ProductCategory, as: 'categoryInfo' }
      ]
    });

    return this.transformToDto(productWithAssociations);
  }

  /**
   * Get all products with pagination
   */
  async getAll(pageNumber, pageSize, searchParams, status) {
    logger.info('ProductService.getAll() invoked');
    
    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }

    // Exclude "Non Scan" and "Custom" categories
    const categoryExclude = await ProductCategory.findAll({
      where: {
        productCategoryName: {
          [Op.in]: ['Non Scan', 'Custom']
        }
      }
    });
    const excludeIds = categoryExclude.map(cat => cat.id);

    if (excludeIds.length > 0) {
      where.productCategory = {
        [Op.notIn]: excludeIds
      };
    }

    // Apply search filters
    if (searchParams) {
      if (searchParams.name) {
        where.name = { [Op.like]: `%${searchParams.name}%` };
      }
      if (searchParams.barcode) {
        where.barcode = { [Op.like]: `%${searchParams.barcode}%` };
      }
    }

    const offset = (pageNumber - 1) * pageSize;
    const limit = pageSize === 0 ? null : pageSize;
    
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Tax, as: 'taxInfo' },
        { model: ProductCategory, as: 'categoryInfo' }
      ],
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const products = rows.map(product => this.transformToDto(product));

    return {
      content: products,
      totalElements: count,
      totalPages: Math.ceil(count / (pageSize || count)),
      pageNumber: pageNumber,
      pageSize: pageSize || count
    };
  }

  /**
   * Get all products (no pagination)
   */
  async getAllProducts() {
    logger.info('ProductService.getAllProducts() invoked');
    
    const products = await Product.findAll({
      where: { isActive: true },
      include: [
        { model: Tax, as: 'taxInfo' },
        { model: ProductCategory, as: 'categoryInfo' }
      ],
      order: [['id', 'DESC']]
    });

    return products.map(product => this.transformToDto(product));
  }

  /**
   * Get product by barcode
   */
  async getProductByBarcode(barcode) {
    logger.info('ProductService.getProductByBarcode() invoked');
    
    const products = await Product.findAll({
      where: { barcode, isActive: true },
      include: [
        { model: Tax, as: 'taxInfo' },
        { model: ProductCategory, as: 'categoryInfo' }
      ]
    });

    return products.map(product => this.transformToDto(product));
  }

  /**
   * Get product by name
   */
  async getProductByName(name) {
    logger.info('ProductService.getProductByName() invoked');
    
    const products = await Product.findAll({
      where: { 
        name: { [Op.like]: `%${name}%` },
        isActive: true 
      },
      include: [
        { model: Tax, as: 'taxInfo' },
        { model: ProductCategory, as: 'categoryInfo' }
      ]
    });

    return products.map(product => this.transformToDto(product));
  }

  /**
   * Get product by ID
   */
  async getProductById(id) {
    logger.info('ProductService.getProductById() invoked');
    
    const product = await Product.findByPk(id, {
      include: [
        { model: Tax, as: 'taxInfo' },
        { model: ProductCategory, as: 'categoryInfo' }
      ]
    });

    return product ? [this.transformToDto(product)] : [];
  }

  /**
   * Update product
   */
  async updateProduct(productDto) {
    logger.info('ProductService.updateProduct() invoked');
    
    const product = await Product.findByPk(productDto.id);
    if (!product) {
      throw new Error('Product not found');
    }

    await product.update({
      name: productDto.name,
      barcode: productDto.barcode,
      pricePerUnit: productDto.pricePerUnit,
      tax: productDto.taxDto?.id || productDto.tax || product.tax,
      productCategory: productDto.productCategoryDto?.id || productDto.productCategory || product.productCategory,
      quantity: productDto.quantity !== undefined ? productDto.quantity : product.quantity,
      lowStock: productDto.lowStock !== undefined ? productDto.lowStock : product.lowStock,
      purchasePrice: productDto.purchasePrice !== undefined ? productDto.purchasePrice : product.purchasePrice,
      discountValidation: productDto.discountValidation !== undefined ? productDto.discountValidation : product.discountValidation
    });

    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        { model: Tax, as: 'taxInfo' },
        { model: ProductCategory, as: 'categoryInfo' }
      ]
    });

    return this.transformToDto(updatedProduct);
  }

  /**
   * Update product status
   */
  async updateProductStatus(productId, status) {
    logger.info('ProductService.updateProductStatus() invoked');
    
    const product = await Product.findByPk(productId);
    if (!product) {
      return null;
    }

    await product.update({ isActive: status });

    const updatedProduct = await Product.findByPk(productId, {
      include: [
        { model: Tax, as: 'taxInfo' },
        { model: ProductCategory, as: 'categoryInfo' }
      ]
    });

    return this.transformToDto(updatedProduct);
  }

  /**
   * Get products by category name
   */
  async getByProductCategoryName(pageNumber, pageSize, searchParams, categoryName, status) {
    logger.info('ProductService.getByProductCategoryName() invoked');
    
    const category = await ProductCategory.findOne({ 
      where: { productCategoryName: categoryName } 
    });
    
    if (!category) {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageNumber: pageNumber,
        pageSize: pageSize
      };
    }

    const where = { 
      productCategory: category.id 
    };
    
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Tax, as: 'taxInfo' },
        { model: ProductCategory, as: 'categoryInfo' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const products = rows.map(product => this.transformToDto(product));

    return {
      content: products,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  /**
   * Get products by tax percentage
   */
  async getByTaxPercentage(pageNumber, pageSize, searchParams, taxPercentage, status) {
    logger.info('ProductService.getByTaxPercentage() invoked');
    
    const tax = await Tax.findOne({ 
      where: { taxPercentage } 
    });
    
    if (!tax) {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageNumber: pageNumber,
        pageSize: pageSize
      };
    }

    const where = { 
      tax: tax.id 
    };
    
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Tax, as: 'taxInfo' },
        { model: ProductCategory, as: 'categoryInfo' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const products = rows.map(product => this.transformToDto(product));

    return {
      content: products,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  /**
   * Transform product model to DTO
   */
  transformToDto(product) {
    if (!product) return null;
    
    return {
      id: product.id,
      name: product.name,
      barcode: product.barcode,
      pricePerUnit: product.pricePerUnit,
      createdDate: product.createdDate,
      isActive: product.isActive,
      quantity: product.quantity,
      lowStock: product.lowStock,
      purchasePrice: product.purchasePrice,
      discountValidation: product.discountValidation,
      taxDto: product.taxInfo ? {
        id: product.taxInfo.id,
        taxPercentage: product.taxInfo.taxPercentage,
        isActive: product.taxInfo.isActive
      } : null,
      productCategoryDto: product.categoryInfo ? {
        id: product.categoryInfo.id,
        productCategoryName: product.categoryInfo.productCategoryName,
        isActive: product.categoryInfo.isActive,
        agevalidation: product.categoryInfo.agevalidation
      } : null
    };
  }
}

module.exports = new ProductService();
