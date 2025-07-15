import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
});

export const workOrders = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: integer("customer_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // pending, in-progress, completed, on-hold
  scheduledDate: text("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  estimatedHours: decimal("estimated_hours", { precision: 3, scale: 1 }).notNull(),
  assignedTo: text("assigned_to").notNull(),
});

export const measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),
  workOrderId: integer("work_order_id").notNull(),
  pipeDiameter: decimal("pipe_diameter", { precision: 8, scale: 2 }),
  pipeLength: decimal("pipe_length", { precision: 10, scale: 2 }),
  waterPressure: integer("water_pressure"),
  installationHeight: decimal("installation_height", { precision: 8, scale: 2 }),
  notes: text("notes"),
  recordedAt: text("recorded_at").notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
});

export const insertWorkOrderSchema = createInsertSchema(workOrders).omit({
  id: true,
});

export const insertMeasurementSchema = createInsertSchema(measurements).omit({
  id: true,
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type WorkOrder = typeof workOrders.$inferSelect;
export type InsertWorkOrder = z.infer<typeof insertWorkOrderSchema>;
export type Measurement = typeof measurements.$inferSelect;
export type InsertMeasurement = z.infer<typeof insertMeasurementSchema>;

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  workOrders: many(workOrders),
}));

export const workOrdersRelations = relations(workOrders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [workOrders.customerId],
    references: [customers.id],
  }),
  measurements: many(measurements),
}));

export const measurementsRelations = relations(measurements, ({ one }) => ({
  workOrder: one(workOrders, {
    fields: [measurements.workOrderId],
    references: [workOrders.id],
  }),
}));

export type WorkOrderWithCustomer = WorkOrder & {
  customer: Customer;
  measurements?: Measurement[];
};
