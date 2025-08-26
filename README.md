# FieldService Pro - Work Order Management System

## Overview

FieldService Pro is a comprehensive web application for managing field service work orders in the sanitary installation industry. The application provides an intuitive dashboard for fitters to view their assigned work orders, track status, record technical measurements on-site, and manage customer information.

## Features

### Work Order Management
- **Dashboard View**: Comprehensive overview of all work orders with status filtering
- **Status Tracking**: Track work orders through pending, in-progress, completed, and on-hold states
- **Work Order Details**: View complete work order information including customer details and scheduling
- **Start Work**: One-click status update from pending to in-progress
- **Measurement Recording**: Record technical measurements (pipe diameter, length, water pressure, installation height) directly in the field

### Customer Management
- **Customer Database**: Maintain complete customer records with contact information and addresses
- **Create Customers**: Add new customers with validation for all required fields
- **Delete Customers**: Remove customers with cascade deletion of associated work orders and measurements
- **Customer Search**: Search and filter customers by name, phone, or address
- **Data Integrity**: Automatic cleanup of related data when customers are deleted

### Work Order Creation
- **New Work Order Form**: Create work orders with comprehensive details
- **Customer Assignment**: Link work orders to existing customers
- **Scheduling**: Set scheduled dates and time slots for work
- **Technician Assignment**: Assign work orders to specific field technicians
- **Estimation**: Include estimated hours for job completion

### Technical Measurements
- **Field Data Collection**: Record precise measurements during installation
- **Water Pressure Monitoring**: Track water pressure readings
- **Pipe Specifications**: Record pipe diameter and length measurements
- **Installation Details**: Document installation height and additional notes
- **Timestamp Tracking**: Automatic recording of measurement timestamps

### Data Management
- **PostgreSQL Database**: Robust data persistence with referential integrity
- **Cascade Operations**: Automatic cleanup of related data during deletions
- **Data Validation**: Comprehensive validation for all input fields
- **Search and Filter**: Advanced search capabilities across all data entities

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Radix UI** components with shadcn/ui styling system
- **Tailwind CSS** for responsive design
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation for forms
- **Wouter** for lightweight client-side routing

### Backend
- **Express.js** with TypeScript for the API server
- **PostgreSQL** with Neon serverless driver for database
- **Drizzle ORM** for type-safe database operations
- **Zod** for request validation and type safety

### Development & Testing
- **Vitest** for unit and integration testing
- **Testing Library** for React component testing
- **Hot Module Replacement** for instant development feedback
- **TypeScript** for compile-time error checking

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database (or Neon serverless)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (DATABASE_URL)
4. Push database schema: `npm run db:push`
5. Start development server: `npm run dev`

The application will be available at `http://localhost:5000`

### Testing
Run the comprehensive test suite:
```bash
npm run test          # Run all tests
npm run test:run      # Run tests once
npm run test:ui       # Run with UI interface
```

## Database Schema

The application uses a normalized database structure:

- **Customers**: Store customer contact information and addresses
- **Work Orders**: Track service requests with scheduling and status
- **Measurements**: Record technical field measurements and notes

All entities are properly related with foreign key constraints and cascade deletion for data integrity.

## Key Benefits

- **Mobile-First Design**: Optimized for field technicians using tablets and smartphones
- **Real-Time Updates**: Live data synchronization across all connected devices
- **Data Integrity**: Comprehensive validation and referential integrity
- **Scalable Architecture**: Built to handle growing business needs
- **Type Safety**: Full TypeScript coverage for reduced runtime errors
- **Comprehensive Testing**: Extensive test coverage for reliability

## Deployment

The application is designed for easy deployment on modern cloud platforms with built-in support for:
- PostgreSQL databases
- Environment variable configuration
- Production optimizations
- Health monitoring

Built with modern web technologies and best practices for a professional field service management solution.