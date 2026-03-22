-- Insert Line Items (static data) with group names
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (1, 'Gross Rent', 'Expected Rent in 10 Years');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (2, 'Foundation Phase', 'Excavation and Transportation');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (3, 'Foundation Phase', 'Compaction and leveling');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (4, 'Foundation Phase', 'Foundation');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (5, 'External Structure', 'Steel & RCC');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (6, 'External Structure', 'Brick & Stone');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (7, 'External Structure', 'Lumber');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (8, 'External Structure', 'Roofing');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (9, 'Internal Construction (base)', 'Dry Wall and Ply');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (10, 'Internal Construction (base)', 'Insulation');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (11, 'Internal Construction (base)', 'Paint');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (12, 'Internal Construction (base)', 'Grills and Railings');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (13, 'Internal Construction (base)', 'Windows and Doors');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (14, 'Internal Construction (base)', 'Wooden Flooring');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (15, 'Internal Construction (base)', 'Tiles and Granite');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (16, 'Internal Construction (base)', 'Bathrooms and Toilets');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (17, 'Internal Construction (Utilities)', 'Electrical Wiring');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (18, 'Internal Construction (Utilities)', 'Plumbing');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (19, 'Internal Construction (Utilities)', 'Sewage and Rain water arrangements');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (20, 'Internal Construction (Utilities)', 'Air Conditioning');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (21, 'Internal Construction (Utilities)', 'Heating');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (22, 'Fixtures', 'Electrical Sockets and Switches');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (23, 'Fixtures', 'Kitchen cabinets');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (24, 'Fixtures', 'Garage Door');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (25, 'Fixtures', 'Fans and Lights');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (26, 'Fixtures', 'Sensors and Alarms');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (27, 'Fees and Taxes', 'Construction Permit Fee');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (28, 'Fees and Taxes', 'Environment Tax');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (29, 'Fees and Taxes', 'Transportation Tax');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (30, 'Workers', 'Carpenters');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (31, 'Workers', 'Electricians');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (32, 'Workers', 'Plumbers');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (33, 'Workers', 'Forklift Operators');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (34, 'Workers', 'Dumper Drivers');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (35, 'Workers', 'General Construction Workers');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (36, 'Workers', 'Supervisors');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (37, 'Workers', 'Accountants');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (38, 'Workers', 'HR & Payroll');
MERGE INTO line_items (line_item_id, group_name, line_item_name) KEY (line_item_id) VALUES (39, 'Workers', 'Sales and Marketing');

-- Insert Mock Case Data - only if not already present
MERGE INTO cases (case_id, case_name, case_contact) KEY (case_id) VALUES (1, 'Greenfield Residential Project', 'John Smith - john.smith@example.com');
MERGE INTO cases (case_id, case_name, case_contact) KEY (case_id) VALUES (2, 'Downtown Office Complex', 'Jane Doe - jane.doe@example.com');

-- Insert Mock Case Line Item Data for Case 1
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 1, 2500000.00, 'Expected rental income');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 2, 45000.00, 'Excavation work');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 3, 35000.00, 'Site preparation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 4, 350000.00, 'Deep foundation required');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 5, 620000.00, 'Reinforced cement concrete');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 6, 280000.00, 'Red brick walls');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 7, 195000.00, 'Teak and pine woodwork');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 8, 175000.00, 'Roofing materials');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 9, 85000.00, 'Dry wall installation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 10, 45000.00, 'Thermal insulation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 11, 35000.00, 'Interior and exterior paint');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 12, 25000.00, 'Metal grills and railings');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 13, 120000.00, 'Windows and doors');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 14, 95000.00, 'Hardwood flooring');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 15, 75000.00, 'Tiles and granite');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 16, 110000.00, 'Bathroom fixtures');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 17, 120000.00, 'Wiring and fixtures');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 18, 95000.00, 'Full house plumbing');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 19, 85000.00, 'Drainage and rainwater harvesting');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 20, 150000.00, 'Central air conditioning');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 21, 60000.00, 'Heating system');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 22, 25000.00, 'Sockets and switches');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 23, 80000.00, 'Kitchen cabinets');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 24, 15000.00, 'Garage door');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 25, 35000.00, 'Fans and lights');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 26, 20000.00, 'Security sensors');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 27, 15000.00, 'City permit required');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 28, 8500.00, 'State environment clearance');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 29, 12000.00, 'Transportation tax');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 30, 180000.00, 'Carpentry work');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 31, 120000.00, 'Electrical installation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 32, 90000.00, 'Plumbing labor');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 33, 45000.00, 'Forklift operations');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 34, 35000.00, 'Dumper operations');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 35, 250000.00, 'General labor');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 36, 150000.00, 'Site supervisors');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 37, 80000.00, 'Project accounting');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 38, 60000.00, 'HR and payroll management');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (1, 39, 45000.00, 'Sales and marketing');

-- Insert Mock Case Line Item Data for Case 2
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 1, 5800000.00, 'Commercial rental income');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 2, 120000.00, 'Large excavation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 3, 85000.00, 'Large site preparation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 4, 850000.00, 'Pile foundation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 5, 1450000.00, 'Heavy RCC structure');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 6, 520000.00, 'Glass and stone facade');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 7, 310000.00, 'Interior wooden panels');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 8, 480000.00, 'Commercial roofing');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 9, 195000.00, 'Dry wall installation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 10, 120000.00, 'Commercial insulation');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 11, 95000.00, 'Commercial painting');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 12, 65000.00, 'Commercial grills');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 13, 280000.00, 'Commercial windows');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 14, 175000.00, 'Commercial flooring');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 15, 150000.00, 'Commercial tiles');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 16, 250000.00, 'Commercial bathrooms');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 17, 350000.00, 'Commercial electrical');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 18, 225000.00, 'Multi-floor plumbing');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 19, 195000.00, 'Commercial grade drainage');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 20, 450000.00, 'Central AC system');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 21, 180000.00, 'Commercial heating');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 22, 55000.00, 'Commercial sockets');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 23, 120000.00, 'Office kitchenette');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 24, 35000.00, 'Garage doors');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 25, 85000.00, 'Commercial lighting');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 26, 65000.00, 'Security systems');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 27, 35000.00, 'Commercial permit');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 28, 22000.00, 'Environmental impact assessment');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 29, 45000.00, 'Transportation tax');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 30, 350000.00, 'Commercial carpentry');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 31, 280000.00, 'Commercial electrical labor');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 32, 180000.00, 'Commercial plumbing labor');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 33, 95000.00, 'Forklift operations');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 34, 75000.00, 'Dumper operations');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 35, 550000.00, 'General labor force');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 36, 300000.00, 'Site supervisors');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 37, 150000.00, 'Project accounting');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 38, 120000.00, 'HR and payroll');
MERGE INTO case_line_item_data (case_id, line_item_id, amount, comments) KEY (case_id, line_item_id)
VALUES (2, 39, 95000.00, 'Sales and marketing');

-- Insert default Admin Settings
MERGE INTO admin_settings (id, number_of_units, total_square_feet) KEY (id) VALUES (1, 100, 20000);

-- Reset auto-increment sequence past the seeded row so new inserts get id=2+
ALTER TABLE admin_settings ALTER COLUMN id RESTART WITH 2;
