import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import express from "express";
import { registerRoutes } from "../routes";

// Mock the storage
vi.mock("../storage", () => {
  const mockStorage = {
    getAllCustomers: vi.fn(),
    getCustomer: vi.fn(),
    createCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
    createWorkOrder: vi.fn(),
    createMeasurement: vi.fn(),
  };

  return {
    storage: mockStorage,
  };
});

describe("Customer API Endpoints", () => {
  let app: express.Application;
  let mockStorage: any;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);

    // Get the mocked storage after the module is loaded
    const { storage } = await import("../storage");
    mockStorage = storage;

    vi.clearAllMocks();
  });

  describe("GET /api/customers", () => {
    it("should return all customers", async () => {
      const mockCustomers = [
        {
          id: 1,
          name: "John Doe",
          phone: "+1 (555) 123-4567",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
        {
          id: 2,
          name: "Jane Smith",
          phone: "+1 (555) 987-6543",
          address: "456 Oak Ave",
          city: "Brooklyn",
          state: "NY",
          zipCode: "11201",
        },
      ];

      mockStorage.getAllCustomers.mockResolvedValue(mockCustomers);

      const response = await request(app).get("/api/customers").expect(200);

      expect(response.body).toEqual(mockCustomers);
      expect(mockStorage.getAllCustomers).toHaveBeenCalledOnce();
    });

    it("should handle database errors", async () => {
      mockStorage.getAllCustomers.mockRejectedValue(
        new Error("Database error"),
      );

      await request(app)
        .get("/api/customers")
        .expect(500)
        .expect({ message: "Failed to fetch customers" });
    });
  });

  describe("POST /api/customers", () => {
    it("should create a new customer with valid data", async () => {
      const customerData = {
        name: "New Customer",
        phone: "+1 (555) 555-5555",
        address: "789 New Street",
        city: "New City",
        state: "NC",
        zipCode: "12345",
      };

      const createdCustomer = { id: 3, ...customerData };
      mockStorage.createCustomer.mockResolvedValue(createdCustomer);

      const response = await request(app)
        .post("/api/customers")
        .send(customerData)
        .expect(201);

      expect(response.body).toEqual(createdCustomer);
      expect(mockStorage.createCustomer).toHaveBeenCalledWith(customerData);
    });

    it("should validate required fields", async () => {
      const invalidData = {
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      };

      await request(app).post("/api/customers").send(invalidData).expect(400);

      expect(mockStorage.createCustomer).not.toHaveBeenCalled();
    });

    it("should reject requests with missing fields", async () => {
      const incompleteData = {
        name: "John Doe",
        phone: "+1 (555) 123-4567",
        // Missing required fields
      };

      await request(app)
        .post("/api/customers")
        .send(incompleteData)
        .expect(400);

      expect(mockStorage.createCustomer).not.toHaveBeenCalled();
    });

    it("should handle database errors during creation", async () => {
      const customerData = {
        name: "Test Customer",
        phone: "+1 (555) 123-4567",
        address: "123 Test St",
        city: "Test City",
        state: "TC",
        zipCode: "12345",
      };

      mockStorage.createCustomer.mockRejectedValue(new Error("Database error"));

      await request(app)
        .post("/api/customers")
        .send(customerData)
        .expect(500)
        .expect({ message: "Failed to create customer" });
    });
  });

  describe("DELETE /api/customers/:id", () => {
    it("should delete a customer and return deletion summary", async () => {
      const customerId = 1;
      const deletionResult = {
        deletedCustomer: {
          id: 1,
          name: "John Doe",
          phone: "+1 (555) 123-4567",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
        deletedWorkOrders: 2,
        deletedMeasurements: 5,
      };

      mockStorage.deleteCustomer.mockResolvedValue(deletionResult);

      const response = await request(app)
        .delete(`/api/customers/${customerId}`)
        .expect(200);

      expect(response.body).toEqual({
        message: "Customer deleted successfully",
        ...deletionResult,
      });
      expect(mockStorage.deleteCustomer).toHaveBeenCalledWith(customerId);
    });

    it("should return 404 for non-existent customer", async () => {
      const customerId = 99999;
      mockStorage.deleteCustomer.mockResolvedValue(undefined);

      await request(app)
        .delete(`/api/customers/${customerId}`)
        .expect(404)
        .expect({ message: "Customer not found" });
    });

    it("should handle invalid customer ID format", async () => {
      await request(app).delete("/api/customers/invalid-id").expect(404);
    });

    it("should handle database errors during deletion", async () => {
      const customerId = 1;
      mockStorage.deleteCustomer.mockRejectedValue(new Error("Database error"));

      await request(app)
        .delete(`/api/customers/${customerId}`)
        .expect(500)
        .expect({ message: "Failed to delete customer" });
    });
  });

  describe("Customer Data Validation", () => {
    it("should accept various valid phone formats", async () => {
      const validPhoneFormats = [
        "+1 (555) 123-4567",
        "555-123-4567",
        "5551234567",
        "+1-555-123-4567",
      ];

      for (const phone of validPhoneFormats) {
        const customerData = {
          name: "Test Customer",
          phone,
          address: "123 Test St",
          city: "Test City",
          state: "TC",
          zipCode: "12345",
        };

        mockStorage.createCustomer.mockResolvedValue({
          id: 1,
          ...customerData,
        });

        await request(app)
          .post("/api/customers")
          .send(customerData)
          .expect(201);
      }
    });

    it("should accept customers with special characters in names", async () => {
      const customerData = {
        name: "O'Connor & Associates, Inc.",
        phone: "+1 (555) 123-4567",
        address: "123 Test St",
        city: "Test City",
        state: "TC",
        zipCode: "12345",
      };

      mockStorage.createCustomer.mockResolvedValue({ id: 1, ...customerData });

      const response = await request(app)
        .post("/api/customers")
        .send(customerData)
        .expect(201);

      expect(response.body.name).toBe("O'Connor & Associates, Inc.");
    });

    it("should handle long addresses", async () => {
      const longAddress =
        "A very long address that might be typical for commercial properties or apartment complexes with detailed suite information";

      const customerData = {
        name: "Test Customer",
        phone: "+1 (555) 123-4567",
        address: longAddress,
        city: "Test City",
        state: "TC",
        zipCode: "12345",
      };

      mockStorage.createCustomer.mockResolvedValue({ id: 1, ...customerData });

      const response = await request(app)
        .post("/api/customers")
        .send(customerData)
        .expect(201);

      expect(response.body.address).toBe(longAddress);
    });
  });

  describe("Customer-Work Order Relationship", () => {
    it("should cascade delete work orders when customer is deleted", async () => {
      const customerId = 1;
      const deletionResult = {
        deletedCustomer: { id: customerId, name: "Test Customer" },
        deletedWorkOrders: 3,
        deletedMeasurements: 7,
      };

      mockStorage.deleteCustomer.mockResolvedValue(deletionResult);

      const response = await request(app)
        .delete(`/api/customers/${customerId}`)
        .expect(200);

      expect(response.body.deletedWorkOrders).toBe(3);
      expect(response.body.deletedMeasurements).toBe(7);
    });

    it("should handle deletion of customer with no work orders", async () => {
      const customerId = 1;
      const deletionResult = {
        deletedCustomer: { id: customerId, name: "Test Customer" },
        deletedWorkOrders: 0,
        deletedMeasurements: 0,
      };

      mockStorage.deleteCustomer.mockResolvedValue(deletionResult);

      const response = await request(app)
        .delete(`/api/customers/${customerId}`)
        .expect(200);

      expect(response.body.deletedWorkOrders).toBe(0);
      expect(response.body.deletedMeasurements).toBe(0);
    });
  });
});
