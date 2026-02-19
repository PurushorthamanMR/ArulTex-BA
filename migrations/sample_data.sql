-- Sample Data for Delta POS Database
-- Minimum 5 records per table
-- Run this AFTER server has run (server creates: country id 1, shopdetails id 1, branch id 1, userrole 1-3, user id 1)
-- Tables that already have default data: insert only from id 2 (or id 4 for userrole)

USE arun_tex_db;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- COUNTRY (5 records) - id 1 created by server (Sri Lanka), so insert from id 2
-- ============================================
INSERT INTO `country` (`id`, `countryName`, `isActive`) VALUES
(2, 'India', 1),
(3, 'United States', 1),
(4, 'United Kingdom', 1),
(5, 'Australia', 1),
(6, 'Canada', 1);

-- ============================================
-- SHOPDETAILS (5 records) - id 1 created by server (yarltech), so insert from id 2
-- ============================================
INSERT INTO `shopdetails` (`id`, `name`, `address`, `contactNumber`, `whatsappNumber`, `email`, `isActive`) VALUES
(2, 'Branch Store 1', '456 Second Street, Kandy', '0812345678', '0772345678', 'branch1@example.com', 1),
(3, 'Branch Store 2', '789 Third Avenue, Galle', '0912345678', '0773456789', 'branch2@example.com', 1),
(4, 'Branch Store 3', '321 Fourth Road, Negombo', '0312345678', '0774567890', 'branch3@example.com', 1),
(5, 'Branch Store 4', '654 Fifth Lane, Colombo', '0212345678', '0775678901', 'branch4@example.com', 1),
(6, 'Branch Store 5', '987 Sixth Road, Gampaha', '0332345678', '0776789012', 'branch5@example.com', 1);

-- ============================================
-- BRANCH (5 records) - id 1 created by server (Jaffna), so insert from id 2
-- ============================================
INSERT INTO `branch` (`id`, `branch_name`, `branch_code`, `address`, `contact_number`, `email_address`, `isActive`, `countryId`, `shopDetailsId`) VALUES
(2, 'Kandy Branch', 'BR002', '456 Second Street, Kandy', '0812345678', 'kandy@example.com', 1, 1, 2),
(3, 'Galle Branch', 'BR003', '789 Third Avenue, Galle', '0912345678', 'galle@example.com', 1, 1, 3),
(4, 'Negombo Branch', 'BR004', '321 Fourth Road, Negombo', '0312345678', 'negombo@example.com', 1, 1, 4),
(5, 'Colombo Branch', 'BR005', '654 Fifth Lane, Colombo', '0212345678', 'colombo@example.com', 1, 1, 5),
(6, 'Gampaha Branch', 'BR006', '987 Sixth Road, Gampaha', '0332345678', 'gampaha@example.com', 1, 1, 6);

-- ============================================
-- USERROLE (5 records) - ids 1,2,3 created by server (Dev, Admin, Staff), so insert from id 4
-- ============================================
INSERT INTO `userrole` (`id`, `userRole`, `isActive`) VALUES
(4, 'MANAGER', 1),
(5, 'CASHIER', 1),
(6, 'GUEST', 1),
(7, 'VIEWER', 1),
(8, 'SUPERVISOR', 1);

-- ============================================
-- USER (5 records) - id 1 created by server (Prusothaman), so insert from id 2
-- ============================================
-- Password: "password123" hashed with bcrypt (replace with real hash if needed)
INSERT INTO `user` (`id`, `firstName`, `lastName`, `password`, `address`, `emailAddress`, `mobileNumber`, `createdDate`, `modifiedDate`, `isActive`, `userRoleId`, `branchId`) VALUES
(2, 'Jane', 'Smith', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', '456 Second St', 'jane.smith@example.com', '0772345678', NOW(), NOW(), 1, 2, 1),
(3, 'Bob', 'Johnson', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', '789 Third Ave', 'bob.johnson@example.com', '0773456789', NOW(), NOW(), 1, 3, 1),
(4, 'Alice', 'Williams', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', '321 Fourth Rd', 'alice.williams@example.com', '0774567890', NOW(), NOW(), 1, 3, 2),
(5, 'Charlie', 'Brown', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', '654 Fifth Ln', 'charlie.brown@example.com', '0775678901', NOW(), NOW(), 1, 3, 2),
(6, 'Diana', 'Davis', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', '111 Sixth Ave', 'diana.davis@example.com', '0776789012', NOW(), NOW(), 1, 3, 3);

-- ============================================
-- TAX (5 records)
-- ============================================
INSERT INTO `tax` (`id`, `taxPercentage`, `isActive`) VALUES
(1, 0.00, 1),
(2, 5.00, 1),
(3, 10.00, 1),
(4, 15.00, 1),
(5, 18.00, 1);

-- ============================================
-- PRODUCTCATEGORY (5 records)
-- ============================================
INSERT INTO `productcategory` (`id`, `productCategoryName`, `isActive`, `agevalidation`) VALUES
(1, 'Electronics', 1, 0),
(2, 'Clothing', 1, 0),
(3, 'Food & Beverages', 1, 0),
(4, 'Custom', 1, 0),
(5, 'Non Scan', 1, 0);

-- ============================================
-- PRODUCT (5 records)
-- ============================================
INSERT INTO `product` (`id`, `name`, `barcode`, `pricePerUnit`, `createdDate`, `quantity`, `lowStock`, `purchasePrice`, `isActive`, `discountValidation`, `tax`, `productCategory`) VALUES
(1, 'Laptop Computer', 'BAR001', 50000.00, NOW(), 10, 5, 45000.00, 1, 1, 1, 1),
(2, 'T-Shirt', 'BAR002', 1500.00, NOW(), 50, 10, 1000.00, 1, 1, 2, 2),
(3, 'Coffee Beans', 'BAR003', 2500.00, NOW(), 30, 10, 2000.00, 1, 1, 3, 3),
(4, 'Custom Product', 'BAR004', 1000.00, NOW(), 100, 20, 800.00, 1, 0, 1, 4),
(5, 'Non-Scan Item', 'BAR005', 500.00, NOW(), 200, 50, 400.00, 1, 0, 1, 5);

-- ============================================
-- SUPPLIER (5 records)
-- ============================================
INSERT INTO `supplier` (`id`, `name`, `contactNumber`, `emailAddress`, `address`, `isActive`) VALUES
(1, 'ABC Suppliers', '0111111111', 'abc@supplier.com', '123 Supplier St', 1),
(2, 'XYZ Trading', '0222222222', 'xyz@trading.com', '456 Trading Ave', 1),
(3, 'Global Imports', '0333333333', 'global@imports.com', '789 Import Rd', 1),
(4, 'Local Distributors', '0444444444', 'local@dist.com', '321 Distributor Ln', 1),
(5, 'Premium Goods Co', '0555555555', 'premium@goods.com', '654 Premium St', 1);

-- ============================================
-- CUSTOMER (5 records)
-- ============================================
INSERT INTO `customer` (`id`, `name`, `mobileNumber`, `createdDate`, `isActive`) VALUES
(1, 'Customer One', '0771111111', NOW(), 1),
(2, 'Customer Two', '0772222222', NOW(), 1),
(3, 'Customer Three', '0773333333', NOW(), 1),
(4, 'Customer Four', '0774444444', NOW(), 1),
(5, 'Customer Five', '0775555555', NOW(), 1);

-- ============================================
-- PAYMENTMETHOD (5 records)
-- ============================================
INSERT INTO `paymentmethod` (`id`, `type`, `isActive`) VALUES
(1, 'Cash', 1),
(2, 'Credit Card', 1),
(3, 'Debit Card', 1),
(4, 'Mobile Payment', 1),
(5, 'Bank Transfer', 1);

-- ============================================
-- PAYOUTCATEGORY (5 records)
-- ============================================
INSERT INTO `payoutcategory` (`id`, `categoryName`, `isActive`) VALUES
(1, 'Rent', 1),
(2, 'Utilities', 1),
(3, 'Salaries', 1),
(4, 'Maintenance', 1),
(5, 'Other Expenses', 1);

-- ============================================
-- PRODUCTDISCOUNTTYPE (5 records)
-- ============================================
INSERT INTO `productdiscounttype` (`id`, `type`, `isActive`) VALUES
(1, 'Percentage', 1),
(2, 'Fixed Amount', 1),
(3, 'Buy One Get One', 1),
(4, 'Seasonal', 1),
(5, 'Bulk Discount', 1);

-- ============================================
-- BANKING (5 records)
-- ============================================
INSERT INTO `banking` (`id`, `amount`, `branchId`, `dateTime`, `isActive`, `generatedDateTime`) VALUES
(1, 50000.00, 1, NOW(), 1, NULL),
(2, 30000.00, 1, NOW(), 1, NULL),
(3, 25000.00, 2, NOW(), 1, NULL),
(4, 40000.00, 2, NOW(), 1, NULL),
(5, 35000.00, 3, NOW(), 1, NULL);

-- ============================================
-- PAYOUT (5 records)
-- ============================================
INSERT INTO `payout` (`id`, `amount`, `description`, `payoutCategoryId`, `branchId`, `userId`, `dateTime`, `isActive`, `generatedDateTime`) VALUES
(1, 10000.00, 'Monthly Rent Payment', 1, 1, 2, NOW(), 1, NULL),
(2, 5000.00, 'Electricity Bill', 2, 1, 2, NOW(), 1, NULL),
(3, 15000.00, 'Staff Salaries', 3, 1, 2, NOW(), 1, NULL),
(4, 2000.00, 'Equipment Maintenance', 4, 2, 2, NOW(), 1, NULL),
(5, 3000.00, 'Miscellaneous Expenses', 5, 2, 2, NOW(), 1, NULL);

-- ============================================
-- MINIMAMBANKING (5 records)
-- ============================================
INSERT INTO `minimambanking` (`id`, `amount`, `branchId`) VALUES
(1, 10000.00, 1),
(2, 15000.00, 1),
(3, 12000.00, 2),
(4, 18000.00, 2),
(5, 20000.00, 3);

-- ============================================
-- STOCK (5 records)
-- ============================================
INSERT INTO `stock` (`id`, `quantity`, `productId`, `supplierId`, `branchId`) VALUES
(1, 50, 1, 1, 1),
(2, 100, 2, 2, 1),
(3, 75, 3, 3, 2),
(4, 200, 4, 4, 2),
(5, 150, 5, 5, 3);

-- ============================================
-- PURCHASELIST (5 records)
-- ============================================
INSERT INTO `purchaselist` (`id`, `quantity`, `price`, `productId`, `supplierId`, `branchId`) VALUES
(1, 10, 45000.00, 1, 1, 1),
(2, 20, 1000.00, 2, 2, 1),
(3, 15, 2000.00, 3, 3, 2),
(4, 50, 800.00, 4, 4, 2),
(5, 100, 400.00, 5, 5, 3);

-- ============================================
-- PRODUCTDISCOUNT (5 records)
-- ============================================
INSERT INTO `productdiscount` (`id`, `discountValue`, `productId`, `productDiscountTypeId`) VALUES
(1, 10.00, 1, 1),
(2, 500.00, 2, 2),
(3, 5.00, 3, 1),
(4, 200.00, 4, 2),
(5, 15.00, 5, 1);

-- ============================================
-- EMPLOYEEDISCOUNT (5 records)
-- ============================================
INSERT INTO `employeediscount` (`id`, `discountPercentage`, `userId`, `productId`) VALUES
(1, 10.00, 3, 1),
(2, 15.00, 3, 2),
(3, 5.00, 4, 3),
(4, 20.00, 4, 4),
(5, 10.00, 5, 5);

-- ============================================
-- TRANSACTION (5 records)
-- ============================================
INSERT INTO `transaction` (`id`, `dateTime`, `totalAmount`, `status`, `isActive`, `generateDateTime`, `manualDiscount`, `employeeDiscount`, `balanceAmount`, `branchId`, `shopdetailsId`, `userId`, `customerId`) VALUES
(1, NOW(), 50000.00, 'Completed', 1, NULL, 0.00, 0.00, 0.00, 1, 1, 2, 1),
(2, NOW(), 1500.00, 'Completed', 1, NULL, 100.00, 0.00, 0.00, 1, 1, 3, 2),
(3, NOW(), 2500.00, 'Completed', 1, NULL, 0.00, 50.00, 0.00, 2, 2, 4, 3),
(4, NOW(), 1000.00, 'Completed', 1, NULL, 0.00, 0.00, 0.00, 2, 2, 3, 4),
(5, NOW(), 500.00, 'Completed', 1, NULL, 0.00, 0.00, 0.00, 3, 3, 5, 5);

-- ============================================
-- TRANSACTIONDETAILSLIST (5 records)
-- ============================================
INSERT INTO `transactiondetailslist` (`id`, `quantity`, `price`, `discount`, `transactionId`, `productId`) VALUES
(1, 1, 50000.00, 0.00, 1, 1),
(2, 1, 1500.00, 100.00, 2, 2),
(3, 1, 2500.00, 50.00, 3, 3),
(4, 1, 1000.00, 0.00, 4, 4),
(5, 1, 500.00, 0.00, 5, 5);

-- ============================================
-- TRANSACTIONPAYMENTMETHOD (5 records)
-- ============================================
INSERT INTO `transactionpaymentmethod` (`id`, `amount`, `transactionId`, `paymentMethodId`) VALUES
(1, 50000.00, 1, 2),
(2, 1400.00, 2, 1),
(3, 2450.00, 3, 1),
(4, 1000.00, 4, 3),
(5, 500.00, 5, 1);

-- ============================================
-- TRANSACTIONEMPLOYEE (5 records)
-- ============================================
INSERT INTO `transactionemployee` (`id`, `transactionId`, `employeeId`) VALUES
(1, 1, 3),
(2, 2, 3),
(3, 3, 4),
(4, 4, 3),
(5, 5, 5);

-- ============================================
-- SHIFTS (5 records)
-- ============================================
INSERT INTO `shifts` (`id`, `startTime`, `endTime`, `userId`, `branchId`) VALUES
(1, DATE_SUB(NOW(), INTERVAL 8 HOUR), NOW(), 3, 1),
(2, DATE_SUB(NOW(), INTERVAL 7 HOUR), NOW(), 4, 2),
(3, DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW(), 5, 3),
(4, DATE_SUB(NOW(), INTERVAL 8 HOUR), NOW(), 3, 1),
(5, DATE_SUB(NOW(), INTERVAL 7 HOUR), NOW(), 4, 2);

-- ============================================
-- STAFFLEAVE (5 records)
-- ============================================
INSERT INTO `staffleave` (`id`, `startDate`, `endDate`, `reason`, `userId`, `branchId`) VALUES
(1, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY), 'Annual Leave', 3, 1),
(2, DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Sick Leave', 4, 2),
(3, DATE_ADD(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 12 DAY), 'Personal Leave', 5, 3),
(4, DATE_ADD(NOW(), INTERVAL 15 DAY), DATE_ADD(NOW(), INTERVAL 17 DAY), 'Family Emergency', 3, 1),
(5, DATE_ADD(NOW(), INTERVAL 20 DAY), DATE_ADD(NOW(), INTERVAL 22 DAY), 'Vacation', 4, 2);

-- ============================================
-- USERLOGS (5 records)
-- ============================================
INSERT INTO `userlogs` (`id`, `action`, `timestamp`, `userId`) VALUES
(1, 'LOGIN', NOW(), 1),
(2, 'CREATE_TRANSACTION', NOW(), 2),
(3, 'UPDATE_PRODUCT', NOW(), 3),
(4, 'VIEW_REPORT', NOW(), 4),
(5, 'LOGOUT', NOW(), 5);

-- ============================================
-- VOIDHISTORY (5 records)
-- ============================================
INSERT INTO `voidhistory` (`id`, `reason`, `transactionId`, `userId`) VALUES
(1, 'Customer Request', 1, 2),
(2, 'Wrong Item', 2, 2),
(3, 'Payment Issue', 3, 2),
(4, 'System Error', 4, 2),
(5, 'Duplicate Transaction', 5, 2);

-- ============================================
-- DEVICEAUTH (5 records)
-- ============================================
INSERT INTO `deviceauth` (`id`, `tillName`, `password`, `isActive`) VALUES
(1, 'Till-001', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 1),
(2, 'Till-002', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 1),
(3, 'Till-003', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 1),
(4, 'Till-004', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 1),
(5, 'Till-005', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 1);

-- ============================================
-- MANAGERTOGGLE (5 records)
-- ============================================
INSERT INTO `managertoggle` (`id`, `name`, `isActive`) VALUES
(1, 'Discount Approval', 1),
(2, 'Void Transaction', 1),
(3, 'Price Override', 1),
(4, 'Refund Approval', 1),
(5, 'Inventory Adjustment', 1);

-- ============================================
-- SALESREPORT (5 records)
-- ============================================
INSERT INTO `salesreport` (`id`, `date`, `totalSales`, `branchId`) VALUES
(1, DATE_SUB(NOW(), INTERVAL 1 DAY), 50000.00, 1),
(2, DATE_SUB(NOW(), INTERVAL 2 DAY), 45000.00, 1),
(3, DATE_SUB(NOW(), INTERVAL 1 DAY), 30000.00, 2),
(4, DATE_SUB(NOW(), INTERVAL 2 DAY), 35000.00, 2),
(5, DATE_SUB(NOW(), INTERVAL 1 DAY), 25000.00, 3);

-- ============================================
-- PASSWORDRESETTOKEN (5 records)
-- ============================================
INSERT INTO `passwordresettoken` (`id`, `token`, `expiryDate`, `userId`) VALUES
(1, 'token1234567890abcdef', DATE_ADD(NOW(), INTERVAL 1 HOUR), 1),
(2, 'token0987654321fedcba', DATE_ADD(NOW(), INTERVAL 1 HOUR), 2),
(3, 'tokenabcdef1234567890', DATE_ADD(NOW(), INTERVAL 1 HOUR), 3),
(4, 'tokenfedcba0987654321', DATE_ADD(NOW(), INTERVAL 1 HOUR), 4),
(5, 'token1122334455667788', DATE_ADD(NOW(), INTERVAL 1 HOUR), 5);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify all tables have at least 5 records:
-- SELECT 'country' as table_name, COUNT(*) as record_count FROM country
-- UNION ALL SELECT 'shopdetails', COUNT(*) FROM shopdetails
-- UNION ALL SELECT 'branch', COUNT(*) FROM branch
-- UNION ALL SELECT 'userrole', COUNT(*) FROM userrole
-- UNION ALL SELECT 'user', COUNT(*) FROM user
-- UNION ALL SELECT 'tax', COUNT(*) FROM tax
-- UNION ALL SELECT 'productcategory', COUNT(*) FROM productcategory
-- UNION ALL SELECT 'product', COUNT(*) FROM product
-- UNION ALL SELECT 'supplier', COUNT(*) FROM supplier
-- UNION ALL SELECT 'customer', COUNT(*) FROM customer
-- UNION ALL SELECT 'paymentmethod', COUNT(*) FROM paymentmethod
-- UNION ALL SELECT 'payoutcategory', COUNT(*) FROM payoutcategory
-- UNION ALL SELECT 'productdiscounttype', COUNT(*) FROM productdiscounttype
-- UNION ALL SELECT 'banking', COUNT(*) FROM banking
-- UNION ALL SELECT 'payout', COUNT(*) FROM payout
-- UNION ALL SELECT 'minimambanking', COUNT(*) FROM minimambanking
-- UNION ALL SELECT 'stock', COUNT(*) FROM stock
-- UNION ALL SELECT 'purchaselist', COUNT(*) FROM purchaselist
-- UNION ALL SELECT 'productdiscount', COUNT(*) FROM productdiscount
-- UNION ALL SELECT 'employeediscount', COUNT(*) FROM employeediscount
-- UNION ALL SELECT 'transaction', COUNT(*) FROM transaction
-- UNION ALL SELECT 'transactiondetailslist', COUNT(*) FROM transactiondetailslist
-- UNION ALL SELECT 'transactionpaymentmethod', COUNT(*) FROM transactionpaymentmethod
-- UNION ALL SELECT 'transactionemployee', COUNT(*) FROM transactionemployee
-- UNION ALL SELECT 'shifts', COUNT(*) FROM shifts
-- UNION ALL SELECT 'staffleave', COUNT(*) FROM staffleave
-- UNION ALL SELECT 'userlogs', COUNT(*) FROM userlogs
-- UNION ALL SELECT 'voidhistory', COUNT(*) FROM voidhistory
-- UNION ALL SELECT 'deviceauth', COUNT(*) FROM deviceauth
-- UNION ALL SELECT 'managertoggle', COUNT(*) FROM managertoggle
-- UNION ALL SELECT 'salesreport', COUNT(*) FROM salesreport
-- UNION ALL SELECT 'passwordresettoken', COUNT(*) FROM passwordresettoken;
