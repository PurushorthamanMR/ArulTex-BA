const { Op } = require('sequelize');
const { SalesReport, Branch } = require('../models');
const logger = require('../config/logger');

class SalesReportService {
  async save(salesReportDto) {
    logger.info('SalesReportService.save() invoked');
    
    const salesReport = await SalesReport.create({
      date: salesReportDto.date ? new Date(salesReportDto.date) : new Date(),
      totalSales: salesReportDto.totalSales,
      branchId: salesReportDto.branchDto?.id || salesReportDto.branchId
    });

    const salesReportWithAssociations = await SalesReport.findByPk(salesReport.id, {
      include: [
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(salesReportWithAssociations);
  }

  async getXReports() {
    logger.info('SalesReportService.getXReports() invoked');
    
    const reports = await SalesReport.findAll({
      where: {
        // Filter by reportType if field exists, otherwise return all
      },
      include: [
        { model: Branch, as: 'branch' }
      ],
      order: [['date', 'DESC']]
    });

    return reports.map(report => this.transformToDto(report));
  }

  async getZReports() {
    logger.info('SalesReportService.getZReports() invoked');
    
    const reports = await SalesReport.findAll({
      where: {
        // Filter by reportType='Z' if field exists
      },
      include: [
        { model: Branch, as: 'branch' }
      ],
      order: [['date', 'DESC']]
    });

    return reports.map(report => this.transformToDto(report));
  }

  async getZReportsWithPagination(pageNumber, pageSize) {
    logger.info('SalesReportService.getZReportsWithPagination() invoked');
    
    const where = {};
    // Filter by reportType='Z' if field exists

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await SalesReport.findAndCountAll({
      where,
      include: [
        { model: Branch, as: 'branch' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['date', 'DESC']]
    });

    const reports = rows.map(report => this.transformToDto(report));

    return {
      content: reports,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async getTotalCount(reportType) {
    logger.info('SalesReportService.getTotalCount() invoked');
    
    const where = {};
    // Filter by reportType if field exists

    const count = await SalesReport.count({ where });
    return count;
  }

  transformToDto(salesReport) {
    if (!salesReport) return null;
    
    return {
      id: salesReport.id,
      date: salesReport.date,
      totalSales: salesReport.totalSales,
      branchDto: salesReport.branch ? {
        id: salesReport.branch.id,
        branchName: salesReport.branch.branchName
      } : null
    };
  }
}

module.exports = new SalesReportService();
