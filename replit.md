# FieldService Pro - Work Order Management System

## Overview

FieldService Pro is a full-stack web application for managing field service work orders in the sanitary installation industry. The application provides a comprehensive dashboard for fitters to view their assigned work orders, track status, and record technical measurements on-site. Built with a modern React frontend and Express backend, using PostgreSQL database for persistent data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints for CRUD operations
- **Development**: Hot reloading with Vite middleware integration

### Database Schema
The application uses three main entities:
- **Customers**: Store customer information (name, contact details, address)
- **Work Orders**: Track service requests with status, scheduling, and assignment details
- **Measurements**: Record field measurements and notes for each work order

## Key Components

### Frontend Components
- **Dashboard**: Main view displaying work orders with filtering and search
- **WorkOrderCard**: Individual work order display with status badges and actions
- **MeasurementModal**: Modal for recording measurements and updating work order status
- **StatusSummary**: Statistics cards showing work order counts by status
- **AppHeader**: Navigation header with branding and user info

### Backend Services
- **Storage Layer**: Abstracted storage interface with PostgreSQL database implementation
- **Route Handlers**: Express routes for work orders, measurements, and statistics
- **Database Operations**: Drizzle ORM queries with Neon serverless PostgreSQL

## Data Flow

1. **Client Request**: React components use TanStack Query to fetch data
2. **API Layer**: Express routes handle HTTP requests and validation
3. **Business Logic**: Storage interface provides data access methods
4. **Database**: Drizzle ORM executes type-safe SQL queries against PostgreSQL
5. **Response**: Data flows back through the same layers to update the UI

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL driver for Neon database
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework
- **zod**: Schema validation library

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration and schema management

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite bundles React app into static assets
2. **Backend Build**: esbuild compiles TypeScript server code
3. **Database**: Drizzle migrations ensure schema consistency

### Production Setup
- **Server**: Node.js application serving both API and static files
- **Database**: PostgreSQL database (configured for Neon serverless)
- **Environment**: Requires `DATABASE_URL` environment variable

### Development Mode
- **Hot Reloading**: Vite middleware provides instant updates
- **Database**: Uses Drizzle push for schema synchronization
- **Logging**: Request logging with response times and payloads

The application follows a traditional full-stack architecture with modern tooling, emphasizing type safety, developer experience, and maintainable code structure.

## Recent Changes

### July 15, 2025
- **Database integration**: Migrated from in-memory storage to PostgreSQL database with Neon serverless
- **Database schema**: Created tables for customers, work orders, and measurements with proper relations
- **Data persistence**: All work orders, measurements, and customer data now stored persistently
- **Fixed measurement validation error**: Resolved API validation issue where measurement data types weren't matching schema expectations
- **Enhanced error handling**: Added detailed logging for measurement creation to improve debugging
- **Updated CSS classes**: Fixed missing Tailwind CSS warning classes by using standard color utilities
- **TypeScript fixes**: Resolved type compatibility issues in storage layer for work orders and measurements
- **Application deployment**: Successfully deployed and verified all core functionality is working