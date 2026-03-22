-- Line Items Static Table
CREATE TABLE IF NOT EXISTS line_items (
    line_item_id INT PRIMARY KEY,
    group_name VARCHAR(150),
    line_item_name VARCHAR(150) NOT NULL
);

-- Case Table
CREATE TABLE IF NOT EXISTS cases (
    case_id INT AUTO_INCREMENT PRIMARY KEY,
    case_name VARCHAR(300) NOT NULL,
    case_contact VARCHAR(300)
);

-- Case Line Item Data Table (stores editable values per LineItem per Case per Estimate)
CREATE TABLE IF NOT EXISTS case_line_item_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    line_item_id INT NOT NULL,
    estimate_id INT NOT NULL DEFAULT 1,
    amount DECIMAL(12, 2),
    unit_amount DECIMAL(12, 2),
    per_sqft DECIMAL(8, 2),
    comments VARCHAR(300),
    CONSTRAINT fk_case FOREIGN KEY (case_id) REFERENCES cases(case_id),
    CONSTRAINT fk_line_item FOREIGN KEY (line_item_id) REFERENCES line_items(line_item_id),
    CONSTRAINT uk_case_line_item_estimate UNIQUE (case_id, line_item_id, estimate_id)
);

-- Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number_of_units INT,
    total_square_feet INT,
    expected_monthly_rent_est1 DECIMAL(12, 2),
    expected_monthly_rent_est2 DECIMAL(12, 2)
);
