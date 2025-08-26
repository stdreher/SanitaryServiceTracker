import { describe, it, expect, beforeEach } from 'vitest';
import { DatabaseStorage } from '../storage';
import type { InsertCustomer } from '@shared/schema';

describe('Customer Management - Database Storage', () => {
  let storage: DatabaseStorage;
  
  beforeEach(() => {
    storage = new DatabaseStorage();
  });

  describe('Creating Customers', () => {
    it('should create a new customer with valid data', async () => {
      const customerData: InsertCustomer = {
        name: 'John Doe',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      };

      const customer = await storage.createCustomer(customerData);

      expect(customer).toBeDefined();
      expect(customer.id).toBeDefined();
      expect(customer.name).toBe(customerData.name);
      expect(customer.phone).toBe(customerData.phone);
      expect(customer.address).toBe(customerData.address);
      expect(customer.city).toBe(customerData.city);
      expect(customer.state).toBe(customerData.state);
      expect(customer.zipCode).toBe(customerData.zipCode);
    });

    it('should create multiple customers with unique IDs', async () => {
      const customer1Data: InsertCustomer = {
        name: 'Alice Smith',
        phone: '+1 (555) 111-1111',
        address: '456 Oak Avenue',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201'
      };

      const customer2Data: InsertCustomer = {
        name: 'Bob Johnson',
        phone: '+1 (555) 222-2222',
        address: '789 Pine Street',
        city: 'Manhattan',
        state: 'NY',
        zipCode: '10012'
      };

      const customer1 = await storage.createCustomer(customer1Data);
      const customer2 = await storage.createCustomer(customer2Data);

      expect(customer1.id).not.toBe(customer2.id);
      expect(customer1.name).toBe(customer1Data.name);
      expect(customer2.name).toBe(customer2Data.name);
    });
  });

  describe('Retrieving Customers', () => {
    it('should retrieve all customers', async () => {
      const customerData: InsertCustomer = {
        name: 'Test Customer',
        phone: '+1 (555) 999-9999',
        address: '999 Test Street',
        city: 'Test City',
        state: 'TC',
        zipCode: '99999'
      };

      await storage.createCustomer(customerData);
      const customers = await storage.getAllCustomers();

      expect(customers).toBeDefined();
      expect(Array.isArray(customers)).toBe(true);
      expect(customers.length).toBeGreaterThan(0);
    });

    it('should retrieve a specific customer by ID', async () => {
      const customerData: InsertCustomer = {
        name: 'Specific Customer',
        phone: '+1 (555) 888-8888',
        address: '888 Specific Street',
        city: 'Specific City',
        state: 'SC',
        zipCode: '88888'
      };

      const createdCustomer = await storage.createCustomer(customerData);
      const retrievedCustomer = await storage.getCustomer(createdCustomer.id);

      expect(retrievedCustomer).toBeDefined();
      expect(retrievedCustomer?.id).toBe(createdCustomer.id);
      expect(retrievedCustomer?.name).toBe(customerData.name);
    });

    it('should return undefined for non-existent customer ID', async () => {
      const nonExistentCustomer = await storage.getCustomer(99999);
      expect(nonExistentCustomer).toBeUndefined();
    });
  });

  describe('Deleting Customers', () => {
    it('should delete a customer without work orders', async () => {
      const customerData: InsertCustomer = {
        name: 'Delete Test Customer',
        phone: '+1 (555) 777-7777',
        address: '777 Delete Street',
        city: 'Delete City',
        state: 'DC',
        zipCode: '77777'
      };

      const customer = await storage.createCustomer(customerData);
      const deleteResult = await storage.deleteCustomer(customer.id);

      expect(deleteResult).toBeDefined();
      expect(deleteResult?.deletedCustomer.id).toBe(customer.id);
      expect(deleteResult?.deletedWorkOrders).toBe(0);
      expect(deleteResult?.deletedMeasurements).toBe(0);

      // Verify customer is actually deleted
      const deletedCustomer = await storage.getCustomer(customer.id);
      expect(deletedCustomer).toBeUndefined();
    });

    it('should delete a customer with associated work orders and measurements', async () => {
      // Create customer
      const customerData: InsertCustomer = {
        name: 'Customer With Work Orders',
        phone: '+1 (555) 666-6666',
        address: '666 Work Street',
        city: 'Work City',
        state: 'WC',
        zipCode: '66666'
      };

      const customer = await storage.createCustomer(customerData);

      // Create work order for customer
      const workOrderData = {
        orderNumber: 'TEST-001',
        customerId: customer.id,
        title: 'Test Work Order',
        description: 'Test description',
        status: 'pending',
        scheduledDate: '2024-12-31',
        scheduledTime: '10:00',
        estimatedHours: '2.0',
        assignedTo: 'Test Technician'
      };

      const workOrder = await storage.createWorkOrder(workOrderData);

      // Create measurement for work order
      const measurementData = {
        workOrderId: workOrder.id,
        pipeDiameter: '1.5',
        pipeLength: '10.0',
        waterPressure: 45,
        installationHeight: '3.5',
        notes: 'Test measurement',
        recordedAt: new Date().toISOString()
      };

      await storage.createMeasurement(measurementData);

      // Delete customer
      const deleteResult = await storage.deleteCustomer(customer.id);

      expect(deleteResult).toBeDefined();
      expect(deleteResult?.deletedCustomer.id).toBe(customer.id);
      expect(deleteResult?.deletedWorkOrders).toBe(1);
      expect(deleteResult?.deletedMeasurements).toBe(1);

      // Verify cascade deletion
      const deletedCustomer = await storage.getCustomer(customer.id);
      const deletedWorkOrder = await storage.getWorkOrder(workOrder.id);
      const measurements = await storage.getMeasurements(workOrder.id);

      expect(deletedCustomer).toBeUndefined();
      expect(deletedWorkOrder).toBeUndefined();
      expect(measurements).toHaveLength(0);
    });

    it('should return undefined when trying to delete non-existent customer', async () => {
      const deleteResult = await storage.deleteCustomer(99999);
      expect(deleteResult).toBeUndefined();
    });
  });

  describe('Customer Data Validation', () => {
    it('should handle customers with special characters in name', async () => {
      const customerData: InsertCustomer = {
        name: "O'Connor & Associates",
        phone: '+1 (555) 123-4567',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      };

      const customer = await storage.createCustomer(customerData);
      expect(customer.name).toBe("O'Connor & Associates");
    });

    it('should handle various phone number formats', async () => {
      const phoneFormats = [
        '+1 (555) 123-4567',
        '555-123-4567',
        '5551234567',
        '+1-555-123-4567'
      ];

      for (let i = 0; i < phoneFormats.length; i++) {
        const customerData: InsertCustomer = {
          name: `Phone Test ${i + 1}`,
          phone: phoneFormats[i],
          address: '123 Test Street',
          city: 'Test City',
          state: 'TC',
          zipCode: '12345'
        };

        const customer = await storage.createCustomer(customerData);
        expect(customer.phone).toBe(phoneFormats[i]);
      }
    });

    it('should handle long addresses and names', async () => {
      const longName = 'A'.repeat(100);
      const longAddress = 'Very Long Address Name That Goes On And On '.repeat(3);

      const customerData: InsertCustomer = {
        name: longName,
        phone: '+1 (555) 123-4567',
        address: longAddress,
        city: 'Long City Name',
        state: 'LC',
        zipCode: '12345'
      };

      const customer = await storage.createCustomer(customerData);
      expect(customer.name).toBe(longName);
      expect(customer.address).toBe(longAddress);
    });
  });
});