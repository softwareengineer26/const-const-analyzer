-- Insert Line Items (static data) - only if not already present
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (1, 'Total Construction Cost quoted by Builder');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (2, 'Construction Permit Fee');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (3, 'Environment Tax');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (4, 'Public Infra. Fee');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (5, 'Compaction and leveling');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (6, 'Foundation');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (7, 'RCC');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (8, 'Brick/Stone');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (9, 'Timber');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (10, 'Metal Beam/Bar');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (11, 'Sewage and Rain water arrangements');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (12, 'Plumbing');
MERGE INTO line_items (line_item_id, line_item_name) KEY (line_item_id) VALUES (13, 'Electrical');

-- Insert Mock Case Data - only if not already present
MERGE INTO cases (case_id, case_name, case_contact) KEY (case_id) VALUES (1, 'Greenfield Residential Project', 'John Smith - john.smith@example.com');
MERGE INTO cases (case_id, case_name, case_contact) KEY (case_id) VALUES (2, 'Downtown Office Complex', 'Jane Doe - jane.doe@example.com');

-- Insert Mock Case Line Item Data for Case 1
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 1, 2500000.00, 1250.00, 125.00, 'Includes labor and materials');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 2, 15000.00, 15000.00, 0.75, 'City permit required');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 3, 8500.00, 8500.00, 0.43, 'State environment clearance');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 4, 12000.00, 12000.00, 0.60, 'Road and drainage contribution');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 5, 45000.00, 22.50, 2.25, 'Site preparation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 6, 350000.00, 175.00, 17.50, 'Deep foundation required');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 7, 620000.00, 310.00, 31.00, 'Reinforced cement concrete');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 8, 280000.00, 140.00, 14.00, 'Red brick walls');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 9, 195000.00, 97.50, 9.75, 'Teak and pine woodwork');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 10, 175000.00, 87.50, 8.75, 'Steel beams and bars');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 11, 85000.00, 42.50, 4.25, 'Drainage and rainwater harvesting');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 12, 95000.00, 47.50, 4.75, 'Full house plumbing');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (1, 13, 120000.00, 60.00, 6.00, 'Wiring and fixtures');

-- Insert Mock Case Line Item Data for Case 2
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 1, 5800000.00, 2900.00, 290.00, 'Commercial grade construction');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 2, 35000.00, 35000.00, 1.75, 'Commercial permit');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 3, 22000.00, 22000.00, 1.10, 'Environmental impact assessment');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 4, 45000.00, 45000.00, 2.25, 'Infrastructure development fee');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 5, 120000.00, 60.00, 6.00, 'Large site preparation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 6, 850000.00, 425.00, 42.50, 'Pile foundation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 7, 1450000.00, 725.00, 72.50, 'Heavy RCC structure');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 8, 520000.00, 260.00, 26.00, 'Glass and stone facade');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 9, 310000.00, 155.00, 15.50, 'Interior wooden panels');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 10, 480000.00, 240.00, 24.00, 'Structural steel framework');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 11, 195000.00, 97.50, 9.75, 'Commercial grade drainage');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 12, 225000.00, 112.50, 11.25, 'Multi-floor plumbing');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, unit_amount, per_sqft, comments) KEY (case_id, line_item_id)
VALUES (2, 13, 350000.00, 175.00, 17.50, 'Commercial electrical with backup');
