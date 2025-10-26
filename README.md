#  NeoUrban Smart City Management System

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat&logo=mysql)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

A comprehensive **Smart City Management System** designed for urban administration in Bangladesh. NeoUrban provides a unified platform for managing citizens, utilities, healthcare, transportation, and municipal services through an integrated web-based dashboard.

## **Project Overview**

NeoUrban digitizes and streamlines urban administration by providing:

- **Citizen Management**: Registration, demographics, and profile management
- **Service Requests**: Municipal service tracking with status updates
- **Utility Management**: Bills management for electricity, water, gas, and internet
- **Healthcare System**: Hospital management and appointment scheduling
- **Transportation**: Public transport ticketing and route management
- **Administrative Dashboard**: Real-time analytics and data visualization
- **CRUD Operations**: Full Create, Read, Update, Delete functionality

## **Technology Stack**

### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive data visualization
- **React Hooks** - Modern React patterns

### **Backend**

- **Next.js API Routes** - Server-side API endpoints
- **MySQL** - Relational database with advanced SQL features
- **Node.js** - JavaScript runtime environment

### **Database Features**

- **Foreign Key Constraints** with CASCADE operations
- **SQL Views** for complex reporting
- **Stored Procedures** for business logic
- **Triggers** for automatic data management
- **Indexes** for optimized performance

## **Database Schema**

### **Core Tables**

- **Citizens** - Central registry of city residents
- **Services** - Municipal services catalog
- **Utilities** - Infrastructure service providers
- **Transportation** - Public transport systems
- **Healthcare** - Medical facilities
- **Requests** - Service request tracking
- **Tickets** - Transport fare management
- **Appointments** - Healthcare scheduling
- **Bills** - Utility billing system

### **Key Relationships**

```
Citizens (1) ←→ (M) Requests ←→ (1) Services
Citizens (1) ←→ (M) Tickets ←→ (1) Transportation
Citizens (1) ←→ (M) Appointments ←→ (1) Healthcare
Citizens (1) ←→ (M) Bills ←→ (1) Utilities
```

## **Getting Started**

### **Prerequisites**

- Node.js 18+
- MySQL 8.0+
- npm or yarn package manager

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/rezwanahammad/neourban.git
   cd neourban
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**

   ```bash
   # Create MySQL database
   mysql -u root -p

   # Run the schema creation script
   mysql -u root -p < urbancreationinsertion.sql
   ```

4. **Configure environment variables**

   ```bash
   # Create .env.local file
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=neourban
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## **Project Structure**

```
neourban/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin panel with authentication
│   │   ├── appointments/       # Healthcare appointments
│   │   ├── bills/             # Utility bills management
│   │   ├── citizens/          # Citizen information
│   │   ├── healthcare/        # Healthcare facilities
│   │   ├── requests/          # Service requests
│   │   ├── services/          # Municipal services
│   │   ├── tickets/           # Transport ticketing
│   │   ├── transport/         # Transportation systems
│   │   ├── utilities/         # Utility providers
│   │   └── api/              # API endpoints
│   │       ├── appointments/
│   │       ├── bills/
│   │       ├── citizens/
│   │       ├── dashboard/
│   │       ├── healthcare/
│   │       ├── requests/
│   │       ├── services/
│   │       ├── tickets/
│   │       ├── transport/
│   │       └── utilities/
│   ├── components/
│   │   └── LoginForm.tsx      # Authentication component
│   └── lib/
│       ├── auth.tsx           # Authentication context
│       └── db.ts              # Database configuration
├── public/                    # Static assets
├── urbancreationinsertion.sql # Database schema and sample data
├── package.json
└── README.md
```

## **Features**

### **Dashboard Analytics**

- Real-time city statistics
- Request status distribution charts
- Citizen demographics visualization
- Revenue tracking with Bangladeshi Taka (৳)

### **Citizen Management**

- Add, edit, delete citizen records
- Demographics tracking (age, gender, location)
- Contact information management
- Activity history

### **Service Management**

- Municipal service catalog
- Service request creation and tracking
- Status updates (Pending, In Progress, Completed)
- Priority levels (Low, Medium, High)

### **Healthcare System**

- Hospital and clinic management
- Doctor appointment scheduling
- Appointment status tracking
- Healthcare facility capacity management

### **Transportation**

- Public transport route management
- Ticket booking system
- Fare collection
- Capacity tracking

### **Utility Management**

- Electricity, water, gas, internet providers
- Bill generation and tracking
- Payment status management
- Due date monitoring

## **Localization**

The system is specifically designed for Bangladesh:

- **Currency**: All amounts displayed in Bangladeshi Taka (৳)
- **Date Format**: Localized date formatting
- **Contact Numbers**: Bangladeshi mobile number format
- **Regional Services**: Local utility providers (DESCO, WASA, Titas, etc.)

## 🔧 **API Endpoints**

### **Dashboard**

- `GET /api/dashboard` - System-wide statistics and analytics

### **Citizens**

- `GET /api/citizens` - List all citizens
- `POST /api/citizens` - Create new citizen
- `PUT /api/citizens/[id]` - Update citizen
- `DELETE /api/citizens/[id]` - Delete citizen

### **Services**

- `GET /api/services` - List all services
- `POST /api/services` - Create new service

### **Utilities**

- `GET /api/utilities` - Utility providers and billing data

### **Healthcare**

- `GET /api/healthcare` - Healthcare facilities
- `POST /api/healthcare` - Add healthcare facility

### **Transportation**

- `GET /api/transport` - Transport systems and statistics

### **Requests**

- `GET /api/requests` - Service requests with analytics

### **Bills**

- `GET /api/bills` - Billing information and payment status

### **Tickets**

- `GET /api/tickets` - Transport tickets and revenue

### **Appointments**

- `GET /api/appointments` - Healthcare appointments

## **SQL Features Used**

### **Advanced SQL Techniques**

- **CASCADE Constraints** - Automatic data cleanup
- **CHECK Constraints** - Data validation
- **ENUM Types** - Categorical data management
- **Views** - Complex query simplification
- **Stored Procedures** - Reusable business logic
- **Triggers** - Automatic data updates
- **Common Table Expressions (CTE)** - Complex analytics
- **UNION ALL** - Result set combination
- **Aggregate Functions** - Statistical calculations

### **Example Views**

```sql
-- Citizen summary with related data
CREATE VIEW CitizenSummary AS
SELECT c.*, COUNT(r.request_id) as total_requests,
       SUM(b.amount) as total_bills
FROM Citizens c
LEFT JOIN Requests r ON c.citizen_id = r.citizen_id
LEFT JOIN Bills b ON c.citizen_id = b.citizen_id
GROUP BY c.citizen_id;

-- Service analytics
CREATE VIEW ServiceAnalytics AS
SELECT s.category, COUNT(r.request_id) as total_requests,
       AVG(DATEDIFF(r.completion_date, r.request_date)) as avg_completion_days
FROM Services s
LEFT JOIN Requests r ON s.service_id = r.service_id
GROUP BY s.category;
```

## **Sample Data**

The system includes comprehensive sample data:

- **8 Citizens** with diverse demographics
- **7 Municipal Services** across different categories
- **6 Utility Providers** (electricity, water, gas, internet)
- **6 Transport Systems** (bus, metro, train)
- **5 Healthcare Facilities** across different locations
- **Sample requests, bills, appointments, and tickets**
