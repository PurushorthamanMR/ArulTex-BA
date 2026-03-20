-- POS shifts: one open register session; sales attach to shift; Z closes shift.
-- Run after z_reports exists. Adjust if your DB already has these columns.

CREATE TABLE IF NOT EXISTS shifts (
  id INT NOT NULL AUTO_INCREMENT,
  openedByUserId INT NOT NULL,
  openedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closedAt DATETIME NULL,
  closedByUserId INT NULL,
  zReportId INT NULL,
  PRIMARY KEY (id),
  KEY idx_shifts_open (closedAt),
  KEY idx_shifts_opened_by (openedByUserId),
  CONSTRAINT fk_shifts_opened_by FOREIGN KEY (openedByUserId) REFERENCES user (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Optional FK for closer / zReportId — omit if you prefer loose coupling
-- ALTER TABLE shifts ADD CONSTRAINT fk_shifts_closed_by FOREIGN KEY (closedByUserId) REFERENCES user (id);
-- ALTER TABLE shifts ADD CONSTRAINT fk_shifts_z_report FOREIGN KEY (zReportId) REFERENCES z_reports (id);

ALTER TABLE sales ADD COLUMN shiftId INT NULL;
CREATE INDEX idx_sales_shift ON sales (shiftId);

-- One archived Z per shift (NULL allowed multiple for legacy rows without shift)
ALTER TABLE z_reports ADD COLUMN shiftId INT NULL;
CREATE UNIQUE INDEX uq_z_reports_shift_id ON z_reports (shiftId);
