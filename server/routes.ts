import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkOrderSchema, insertMeasurementSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all work orders
  app.get("/api/work-orders", async (req, res) => {
    try {
      const workOrders = await storage.getWorkOrders();
      res.json(workOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch work orders" });
    }
  });

  // Get work order by ID
  app.get("/api/work-orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workOrder = await storage.getWorkOrder(id);
      
      if (!workOrder) {
        return res.status(404).json({ message: "Work order not found" });
      }
      
      res.json(workOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch work order" });
    }
  });

  // Update work order status
  app.patch("/api/work-orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedWorkOrder = await storage.updateWorkOrder(id, updates);
      
      if (!updatedWorkOrder) {
        return res.status(404).json({ message: "Work order not found" });
      }
      
      res.json(updatedWorkOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update work order" });
    }
  });

  // Get work order statistics
  app.get("/api/work-orders/stats/summary", async (req, res) => {
    try {
      const stats = await storage.getWorkOrderStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Create measurement for work order
  app.post("/api/work-orders/:id/measurements", async (req, res) => {
    try {
      const workOrderId = parseInt(req.params.id);
      
      // Clean the data to handle undefined/null properly
      const measurementData = {
        workOrderId,
        pipeDiameter: req.body.pipeDiameter || null,
        pipeLength: req.body.pipeLength || null,
        waterPressure: req.body.waterPressure || null,
        installationHeight: req.body.installationHeight || null,
        notes: req.body.notes || null,
        recordedAt: new Date().toISOString()
      };
      
      const validatedData = insertMeasurementSchema.parse(measurementData);
      const measurement = await storage.createMeasurement(validatedData);
      
      res.status(201).json(measurement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        console.error("Request body:", req.body);
        return res.status(400).json({ message: "Invalid measurement data", errors: error.errors });
      }
      console.error("Error creating measurement:", error);
      res.status(500).json({ message: "Failed to create measurement" });
    }
  });

  // Get measurements for work order
  app.get("/api/work-orders/:id/measurements", async (req, res) => {
    try {
      const workOrderId = parseInt(req.params.id);
      const measurements = await storage.getMeasurements(workOrderId);
      res.json(measurements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch measurements" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
