import { customers, workOrders, measurements, type Customer, type InsertCustomer, type WorkOrder, type InsertWorkOrder, type Measurement, type InsertMeasurement, type WorkOrderWithCustomer } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Customer operations
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  
  // Work order operations
  getWorkOrders(): Promise<WorkOrderWithCustomer[]>;
  getWorkOrder(id: number): Promise<WorkOrderWithCustomer | undefined>;
  getWorkOrderByNumber(orderNumber: string): Promise<WorkOrderWithCustomer | undefined>;
  createWorkOrder(workOrder: InsertWorkOrder): Promise<WorkOrder>;
  updateWorkOrder(id: number, updates: Partial<WorkOrder>): Promise<WorkOrder | undefined>;
  
  // Measurement operations
  getMeasurements(workOrderId: number): Promise<Measurement[]>;
  createMeasurement(measurement: InsertMeasurement): Promise<Measurement>;
  updateMeasurement(id: number, updates: Partial<Measurement>): Promise<Measurement | undefined>;
  
  // Statistics
  getWorkOrderStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
  }>;
}

export class MemStorage implements IStorage {
  private customers: Map<number, Customer>;
  private workOrders: Map<number, WorkOrder>;
  private measurements: Map<number, Measurement>;
  private customerIdCounter: number;
  private workOrderIdCounter: number;
  private measurementIdCounter: number;

  constructor() {
    this.customers = new Map();
    this.workOrders = new Map();
    this.measurements = new Map();
    this.customerIdCounter = 1;
    this.workOrderIdCounter = 1;
    this.measurementIdCounter = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create customers
    const customer1 = this.createCustomerSync({
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Suite 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    });

    const customer2 = this.createCustomerSync({
      name: "Michael Brown",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Avenue",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201"
    });

    const customer3 = this.createCustomerSync({
      name: "Emily Davis",
      phone: "+1 (555) 456-7890",
      address: "789 Pine Street",
      city: "Manhattan",
      state: "NY",
      zipCode: "10012"
    });

    // Create work orders
    this.createWorkOrderSync({
      orderNumber: "WO-2024-001",
      customerId: customer1.id,
      title: "Bathroom Installation",
      description: "Complete bathroom renovation with new fixtures",
      status: "in-progress",
      scheduledDate: "2024-01-15",
      scheduledTime: "14:00",
      estimatedHours: "3.0",
      assignedTo: "John Smith"
    });

    this.createWorkOrderSync({
      orderNumber: "WO-2024-002",
      customerId: customer2.id,
      title: "Pipe Repair",
      description: "Fix leaking pipes in basement",
      status: "pending",
      scheduledDate: "2024-01-16",
      scheduledTime: "10:00",
      estimatedHours: "2.0",
      assignedTo: "John Smith"
    });

    this.createWorkOrderSync({
      orderNumber: "WO-2024-003",
      customerId: customer3.id,
      title: "Faucet Replacement",
      description: "Replace kitchen faucet with new model",
      status: "completed",
      scheduledDate: "2024-01-14",
      scheduledTime: "15:30",
      estimatedHours: "1.5",
      assignedTo: "John Smith"
    });
  }

  private createCustomerSync(customer: InsertCustomer): Customer {
    const id = this.customerIdCounter++;
    const newCustomer: Customer = { ...customer, id };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  private createWorkOrderSync(workOrder: InsertWorkOrder): WorkOrder {
    const id = this.workOrderIdCounter++;
    const newWorkOrder: WorkOrder = { 
      ...workOrder, 
      id,
      status: workOrder.status || "pending"
    };
    this.workOrders.set(id, newWorkOrder);
    return newWorkOrder;
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.customerIdCounter++;
    const newCustomer: Customer = { ...customer, id };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async getWorkOrders(): Promise<WorkOrderWithCustomer[]> {
    const workOrdersWithCustomers: WorkOrderWithCustomer[] = [];
    
    for (const workOrder of Array.from(this.workOrders.values())) {
      const customer = this.customers.get(workOrder.customerId);
      if (customer) {
        const measurements = Array.from(this.measurements.values()).filter(
          m => m.workOrderId === workOrder.id
        );
        workOrdersWithCustomers.push({
          ...workOrder,
          customer,
          measurements
        });
      }
    }
    
    return workOrdersWithCustomers;
  }

  async getWorkOrder(id: number): Promise<WorkOrderWithCustomer | undefined> {
    const workOrder = this.workOrders.get(id);
    if (!workOrder) return undefined;
    
    const customer = this.customers.get(workOrder.customerId);
    if (!customer) return undefined;
    
    const measurements = Array.from(this.measurements.values()).filter(
      m => m.workOrderId === workOrder.id
    );
    
    return {
      ...workOrder,
      customer,
      measurements
    };
  }

  async getWorkOrderByNumber(orderNumber: string): Promise<WorkOrderWithCustomer | undefined> {
    const workOrder = Array.from(this.workOrders.values()).find(
      wo => wo.orderNumber === orderNumber
    );
    if (!workOrder) return undefined;
    
    const customer = this.customers.get(workOrder.customerId);
    if (!customer) return undefined;
    
    const measurements = Array.from(this.measurements.values()).filter(
      m => m.workOrderId === workOrder.id
    );
    
    return {
      ...workOrder,
      customer,
      measurements
    };
  }

  async createWorkOrder(workOrder: InsertWorkOrder): Promise<WorkOrder> {
    const id = this.workOrderIdCounter++;
    const newWorkOrder: WorkOrder = { 
      ...workOrder, 
      id,
      status: workOrder.status || "pending"
    };
    this.workOrders.set(id, newWorkOrder);
    return newWorkOrder;
  }

  async updateWorkOrder(id: number, updates: Partial<WorkOrder>): Promise<WorkOrder | undefined> {
    const workOrder = this.workOrders.get(id);
    if (!workOrder) return undefined;
    
    const updatedWorkOrder = { ...workOrder, ...updates };
    this.workOrders.set(id, updatedWorkOrder);
    return updatedWorkOrder;
  }

  async getMeasurements(workOrderId: number): Promise<Measurement[]> {
    return Array.from(this.measurements.values()).filter(
      m => m.workOrderId === workOrderId
    );
  }

  async createMeasurement(measurement: InsertMeasurement): Promise<Measurement> {
    const id = this.measurementIdCounter++;
    const newMeasurement: Measurement = { 
      ...measurement, 
      id,
      pipeDiameter: measurement.pipeDiameter || null,
      pipeLength: measurement.pipeLength || null,
      waterPressure: measurement.waterPressure || null,
      installationHeight: measurement.installationHeight || null,
      notes: measurement.notes || null
    };
    this.measurements.set(id, newMeasurement);
    return newMeasurement;
  }

  async updateMeasurement(id: number, updates: Partial<Measurement>): Promise<Measurement | undefined> {
    const measurement = this.measurements.get(id);
    if (!measurement) return undefined;
    
    const updatedMeasurement = { ...measurement, ...updates };
    this.measurements.set(id, updatedMeasurement);
    return updatedMeasurement;
  }

  async getWorkOrderStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
  }> {
    const workOrders = Array.from(this.workOrders.values());
    
    return {
      total: workOrders.length,
      pending: workOrders.filter(wo => wo.status === "pending").length,
      inProgress: workOrders.filter(wo => wo.status === "in-progress").length,
      completed: workOrders.filter(wo => wo.status === "completed").length,
      onHold: workOrders.filter(wo => wo.status === "on-hold").length,
    };
  }
}

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db
      .insert(customers)
      .values(customer)
      .returning();
    return newCustomer;
  }

  async getWorkOrders(): Promise<WorkOrderWithCustomer[]> {
    const workOrdersWithCustomers = await db.query.workOrders.findMany({
      with: {
        customer: true,
        measurements: true,
      },
    });
    return workOrdersWithCustomers;
  }

  async getWorkOrder(id: number): Promise<WorkOrderWithCustomer | undefined> {
    const workOrder = await db.query.workOrders.findFirst({
      where: eq(workOrders.id, id),
      with: {
        customer: true,
        measurements: true,
      },
    });
    return workOrder || undefined;
  }

  async getWorkOrderByNumber(orderNumber: string): Promise<WorkOrderWithCustomer | undefined> {
    const workOrder = await db.query.workOrders.findFirst({
      where: eq(workOrders.orderNumber, orderNumber),
      with: {
        customer: true,
        measurements: true,
      },
    });
    return workOrder || undefined;
  }

  async createWorkOrder(workOrder: InsertWorkOrder): Promise<WorkOrder> {
    const [newWorkOrder] = await db
      .insert(workOrders)
      .values(workOrder)
      .returning();
    return newWorkOrder;
  }

  async updateWorkOrder(id: number, updates: Partial<WorkOrder>): Promise<WorkOrder | undefined> {
    const [updatedWorkOrder] = await db
      .update(workOrders)
      .set(updates)
      .where(eq(workOrders.id, id))
      .returning();
    return updatedWorkOrder || undefined;
  }

  async getMeasurements(workOrderId: number): Promise<Measurement[]> {
    const measurementsList = await db
      .select()
      .from(measurements)
      .where(eq(measurements.workOrderId, workOrderId));
    return measurementsList;
  }

  async createMeasurement(measurement: InsertMeasurement): Promise<Measurement> {
    const [newMeasurement] = await db
      .insert(measurements)
      .values(measurement)
      .returning();
    return newMeasurement;
  }

  async updateMeasurement(id: number, updates: Partial<Measurement>): Promise<Measurement | undefined> {
    const [updatedMeasurement] = await db
      .update(measurements)
      .set(updates)
      .where(eq(measurements.id, id))
      .returning();
    return updatedMeasurement || undefined;
  }

  async getWorkOrderStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
  }> {
    const allWorkOrders = await db.select().from(workOrders);
    
    return {
      total: allWorkOrders.length,
      pending: allWorkOrders.filter(wo => wo.status === "pending").length,
      inProgress: allWorkOrders.filter(wo => wo.status === "in-progress").length,
      completed: allWorkOrders.filter(wo => wo.status === "completed").length,
      onHold: allWorkOrders.filter(wo => wo.status === "on-hold").length,
    };
  }
}

export const storage = new DatabaseStorage();
