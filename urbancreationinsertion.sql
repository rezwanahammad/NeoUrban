
DROP DATABASE IF EXISTS neourban;
CREATE DATABASE neourban;
USE neourban;

-- Citizens Table
CREATE TABLE Citizens (
  citizen_id INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)                NOT NULL,
  age         INT                         NOT NULL CHECK (age > 0),
  gender      ENUM('Male','Female','Other') NOT NULL,
  address     VARCHAR(255),
  contact     VARCHAR(20) UNIQUE
);

-- Services Table
CREATE TABLE Services (
  service_id INT AUTO_INCREMENT PRIMARY KEY,
  service_name VARCHAR(100) NOT NULL,
  category ENUM('Waste','Electricity','Water','Transport','Healthcare') NOT NULL,
  provider VARCHAR(100) NOT NULL
);

-- Utilities Table
CREATE TABLE Utilities (
  utility_id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('Electricity','Water','Internet','Gas') NOT NULL,
  provider VARCHAR(100) NOT NULL
);

-- Transportation Table
CREATE TABLE Transportation (
  transport_id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('Bus','Metro','Train') NOT NULL,
  route VARCHAR(100) NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0)
);

-- Healthcare Table
CREATE TABLE Healthcare (
  hospital_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0)
);

-- Requests Table
CREATE TABLE Requests (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  citizen_id INT NOT NULL,
  service_id INT NOT NULL,
  status ENUM('Pending','In Progress','Completed') NOT NULL,
  priority ENUM('Low','Medium','High') NOT NULL,
  request_date DATE NOT NULL,
  FOREIGN KEY (citizen_id) REFERENCES Citizens(citizen_id),
  FOREIGN KEY (service_id) REFERENCES Services(service_id)
);

-- Tickets Table
CREATE TABLE Tickets (
  ticket_id INT AUTO_INCREMENT PRIMARY KEY,
  citizen_id INT NOT NULL,
  transport_id INT NOT NULL,
  fare DECIMAL(10,2) NOT NULL,
  booking_date DATE NOT NULL,
  FOREIGN KEY (citizen_id) REFERENCES Citizens(citizen_id),
  FOREIGN KEY (transport_id) REFERENCES Transportation(transport_id)
);

-- Appointments Table
CREATE TABLE Appointments (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  citizen_id INT NOT NULL,
  hospital_id INT NOT NULL,
  doctor_name VARCHAR(100) NOT NULL,
  appointment_date DATE NOT NULL,
  status ENUM('Scheduled','Completed','Cancelled') NOT NULL,
  FOREIGN KEY (citizen_id) REFERENCES Citizens(citizen_id),
  FOREIGN KEY (hospital_id) REFERENCES Healthcare(hospital_id)
);

-- Bills Table
CREATE TABLE Bills (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  citizen_id INT NOT NULL,
  utility_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  payment_status ENUM('Paid','Unpaid') NOT NULL,
  FOREIGN KEY (citizen_id) REFERENCES Citizens(citizen_id),
  FOREIGN KEY (utility_id) REFERENCES Utilities(utility_id)
);

-------------------------------------------------
-- INSERT DATA
-------------------------------------------------

-- Citizens
INSERT INTO Citizens (name, age, gender, address, contact) VALUES
('Alice Khan',   28, 'Female', 'Dhaka',       '01710000001'),
('Rahim Uddin',  35, 'Male',   'Khulna',      '01710000002'),
('Sadia Noor',   22, 'Female', 'Rajshahi',    '01710000003'),
('Tanvir A.',    41, 'Male',   'Chattogram',  '01710000004'),
('Mitu Rahman',  30, 'Female', 'Sylhet',      '01710000005'),
('Arif Hossain', 50, 'Male',   'Barishal',    '01710000006'),
('Nusrat J.',    27, 'Female', 'Rangpur',     '01710000007'),
('Sajib Karim',  33, 'Male',   'Mymensingh',  '01710000008');

-- Services
INSERT INTO Services (service_name, category, provider) VALUES
('Waste Collection',   'Waste',       'City Corp'),
('Electricity Supply', 'Electricity', 'DESCO'),
('Water Supply',       'Water',       'WASA'),
('Metro Service',      'Transport',   'Dhaka Metro'),
('Public Clinic',      'Healthcare',  'City Health'),
('Street Cleaning',    'Waste',       'City Corp'),
('Community Hospital', 'Healthcare',  'City Health');

-- Utilities
INSERT INTO Utilities (type, provider) VALUES
('Electricity','DESCO'),
('Water','WASA'),
('Internet','BDCom'),
('Gas','Titas'),
('Internet','Link3'),
('Electricity','REB');

-- Transportation
INSERT INTO Transportation (type, route, capacity) VALUES
('Bus','B-12 Uttara–Motijheel',60),
('Metro','MRT-6', 800),
('Train','Intercity 702', 1200),
('Bus','B-21 Gabtoli–Gulistan',55),
('Metro','MRT-1', 700),
('Train','Mail 101', 1500);

-- Healthcare
INSERT INTO Healthcare (name, location, capacity) VALUES
('Dhaka City Hospital','Shahbag', 300),
('Metro Clinic','Uttara', 80),
('Chattogram General','Agrabad', 200),
('Sylhet Care Center','Zindabazar', 150),
('Rajshahi Medical','Rajpara', 400);

-- Requests
INSERT INTO Requests (citizen_id, service_id, status, priority, request_date) VALUES
(1,1,'Pending','High',  CURRENT_DATE),
(2,2,'In Progress','Medium', CURRENT_DATE - INTERVAL 1 DAY),
(1,3,'Completed','Low', CURRENT_DATE - INTERVAL 5 DAY),
(3,4,'Pending','High', CURRENT_DATE - INTERVAL 2 DAY),
(4,5,'In Progress','High', CURRENT_DATE - INTERVAL 3 DAY),
(5,6,'Completed','Medium', CURRENT_DATE - INTERVAL 7 DAY);

-- Tickets
INSERT INTO Tickets (citizen_id, transport_id, fare, booking_date) VALUES
(1,2, 100.00, CURRENT_DATE),
(2,1, 35.00, CURRENT_DATE - INTERVAL 2 DAY),
(3,3, 550.00, CURRENT_DATE - INTERVAL 1 DAY),
(4,4, 25.00, CURRENT_DATE - INTERVAL 4 DAY),
(5,5, 120.00, CURRENT_DATE - INTERVAL 5 DAY);

-- Appointments
INSERT INTO Appointments (citizen_id, hospital_id, doctor_name, appointment_date, status) VALUES
(1,1,'Dr. Reza','2025-10-05','Scheduled'),
(3,2,'Dr. Lima','2025-10-02','Completed'),
(4,3,'Dr. Hasan','2025-10-08','Scheduled'),
(2,4,'Dr. Mita','2025-10-06','Cancelled'),
(5,5,'Dr. Alam','2025-10-07','Scheduled');

-- Bills
INSERT INTO Bills (citizen_id, utility_id, amount, due_date, payment_status) VALUES
(1,1, 1200.00, '2025-10-10','Unpaid'),
(1,2,  650.00, '2025-10-05','Paid'),
(2,3,  999.99, '2025-10-12','Unpaid'),
(3,4,  550.00, '2025-10-07','Unpaid'),
(4,5,  799.50, '2025-10-15','Paid'),
(5,6, 1350.00, '2025-10-20','Unpaid'),
(6,2,  720.00, '2025-10-11','Paid');

