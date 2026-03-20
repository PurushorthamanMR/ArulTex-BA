-- Z-Report archives (saved when user prints / closes Z from Sales Analysis)
-- Run once on your MySQL database if the table does not exist.

CREATE TABLE IF NOT EXISTS z_reports (
  id INT NOT NULL AUTO_INCREMENT,
  closedByUserId INT NOT NULL,
  filterUserId INT NULL,
  fromDate VARCHAR(10) NOT NULL,
  toDate VARCHAR(10) NOT NULL,
  grandTotal DECIMAL(12, 2) NOT NULL,
  transactionCount INT NOT NULL,
  snapshot JSON NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_z_reports_created (createdAt),
  KEY idx_z_reports_closed_by (closedByUserId),
  CONSTRAINT fk_z_reports_user FOREIGN KEY (closedByUserId) REFERENCES user (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
