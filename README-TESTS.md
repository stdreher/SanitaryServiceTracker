# Customer Management Test Cases

This document outlines comprehensive test cases for the customer management functionality, covering adding, changing, and deleting customers.

## Test Structure

The test suite is organized into three main categories:

### 1. Backend Storage Tests (`server/__tests__/customer.test.ts`)

Tests the core database operations and business logic:

**Creating Customers:**
- ✅ Create customer with valid data
- ✅ Create multiple customers with unique IDs
- ✅ Handle special characters in names
- ✅ Support various phone number formats
- ✅ Handle long addresses and names

**Retrieving Customers:**
- ✅ Retrieve all customers
- ✅ Retrieve specific customer by ID
- ✅ Handle non-existent customer queries

**Deleting Customers:**
- ✅ Delete customer without work orders
- ✅ Delete customer with cascade deletion of work orders and measurements
- ✅ Handle deletion of non-existent customers
- ✅ Verify data integrity after cascade deletion

### 2. API Endpoint Tests (`server/__tests__/customer-api.test.ts`)

Tests the REST API endpoints and request/response handling:

**GET /api/customers:**
- ✅ Return all customers
- ✅ Handle database errors gracefully

**POST /api/customers:**
- ✅ Create customer with valid data
- ✅ Validate required fields
- ✅ Reject incomplete data
- ✅ Handle database errors during creation
- ✅ Accept various phone formats
- ✅ Handle special characters in names

**DELETE /api/customers/:id:**
- ✅ Delete customer and return deletion summary
- ✅ Return 404 for non-existent customers
- ✅ Handle invalid ID formats
- ✅ Handle database errors during deletion
- ✅ Verify cascade deletion reporting

### 3. UI Component Tests (`client/src/__tests__/customer-management.test.tsx`)

Tests the user interface components and user interactions:

**Create Customer Modal:**
- 🔧 Render form with all required fields
- 🔧 Validate required fields before submission
- 🔧 Submit valid customer data
- 🔧 Handle form cancellation

**Delete Customer Dialog:**
- 🔧 Display customer information and work order count
- 🔧 Show appropriate warnings for customers with work orders
- 🔧 Handle delete confirmation
- 🔧 Handle delete cancellation

**Customer Search and Filter:**
- 🔧 Filter customers by name, phone, or address

**Error Handling:**
- 🔧 Display error messages for failed operations
- 🔧 Handle network errors gracefully

## Running Tests

### Backend Tests
```bash
npx vitest run server/__tests__/
```

### All Tests
```bash
npx vitest run
```

### Watch Mode
```bash
npx vitest
```

## Test Coverage Areas

### Data Validation
- Required field validation
- Phone number format flexibility
- Special character handling
- Long text field support

### Business Logic
- Cascade deletion of related data
- Work order count tracking
- Customer-work order relationships

### Error Scenarios
- Database connection failures
- Invalid data submission
- Non-existent record operations
- Network timeouts

### User Experience
- Form validation feedback
- Confirmation dialogs
- Loading states
- Success/error notifications

## Test Data Examples

The tests use realistic data scenarios:

```javascript
// Valid customer data
{
  name: 'John Doe',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001'
}

// Edge cases tested
{
  name: "O'Connor & Associates, Inc.",  // Special characters
  phone: '555-123-4567',                // Alternative phone format
  address: 'Very long address...',      // Long text
}
```

## Database Integration

The backend tests use the actual DatabaseStorage implementation to ensure:
- Real database operations
- Proper transaction handling
- Constraint validation
- Cascade deletion verification

## Continuous Integration

These tests should be run:
- Before code commits
- During pull request reviews
- In deployment pipelines
- After database schema changes

## Future Enhancements

Additional test scenarios to consider:
- Performance testing with large datasets
- Concurrent user operations
- Database migration testing
- Mobile UI responsiveness
- Accessibility compliance