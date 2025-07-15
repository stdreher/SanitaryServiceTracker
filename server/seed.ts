import { db } from "./db";
import { customers, workOrders } from "@shared/schema";

async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Create customers
    const [customer1, customer2, customer3, customer4, customer5, customer6, customer7, customer8] = await db
      .insert(customers)
      .values([
        {
          name: "Sarah Johnson",
          phone: "+1 (555) 123-4567",
          address: "123 Main St, Suite 4B",
          city: "New York",
          state: "NY",
          zipCode: "10001"
        },
        {
          name: "Michael Brown",
          phone: "+1 (555) 987-6543",
          address: "456 Oak Avenue",
          city: "Brooklyn",
          state: "NY",
          zipCode: "11201"
        },
        {
          name: "Emily Davis",
          phone: "+1 (555) 456-7890",
          address: "789 Pine Street",
          city: "Manhattan",
          state: "NY",
          zipCode: "10012"
        },
        {
          name: "Robert Wilson",
          phone: "+1 (555) 234-5678",
          address: "321 Elm Street",
          city: "Queens",
          state: "NY",
          zipCode: "11354"
        },
        {
          name: "Lisa Chen",
          phone: "+1 (555) 345-6789",
          address: "654 Maple Drive",
          city: "Bronx",
          state: "NY",
          zipCode: "10451"
        },
        {
          name: "David Martinez",
          phone: "+1 (555) 567-8901",
          address: "987 Cedar Lane",
          city: "Staten Island",
          state: "NY",
          zipCode: "10301"
        },
        {
          name: "Amanda Taylor",
          phone: "+1 (555) 678-9012",
          address: "147 Birch Avenue",
          city: "Long Island City",
          state: "NY",
          zipCode: "11101"
        },
        {
          name: "James Anderson",
          phone: "+1 (555) 789-0123",
          address: "258 Willow Street",
          city: "Flushing",
          state: "NY",
          zipCode: "11355"
        }
      ])
      .returning();

    // Create work orders
    await db
      .insert(workOrders)
      .values([
        {
          orderNumber: "WO-2024-001",
          customerId: customer1.id,
          title: "Bathroom Installation",
          description: "Complete bathroom renovation with new fixtures",
          status: "in-progress",
          scheduledDate: "2024-01-15",
          scheduledTime: "14:00",
          estimatedHours: "3.0",
          assignedTo: "John Smith"
        },
        {
          orderNumber: "WO-2024-002",
          customerId: customer2.id,
          title: "Pipe Repair",
          description: "Fix leaking pipes in basement",
          status: "pending",
          scheduledDate: "2024-01-16",
          scheduledTime: "10:00",
          estimatedHours: "2.0",
          assignedTo: "John Smith"
        },
        {
          orderNumber: "WO-2024-003",
          customerId: customer3.id,
          title: "Faucet Replacement",
          description: "Replace kitchen faucet with new model",
          status: "completed",
          scheduledDate: "2024-01-14",
          scheduledTime: "15:30",
          estimatedHours: "1.5",
          assignedTo: "John Smith"
        },
        {
          orderNumber: "WO-2024-004",
          customerId: customer4.id,
          title: "Water Heater Installation",
          description: "Install new 40-gallon water heater in utility room",
          status: "pending",
          scheduledDate: "2024-01-17",
          scheduledTime: "09:00",
          estimatedHours: "4.0",
          assignedTo: "Mike Johnson"
        },
        {
          orderNumber: "WO-2024-005",
          customerId: customer5.id,
          title: "Toilet Installation",
          description: "Replace old toilet with new dual-flush model",
          status: "in-progress",
          scheduledDate: "2024-01-15",
          scheduledTime: "11:00",
          estimatedHours: "2.5",
          assignedTo: "Sarah Williams"
        },
        {
          orderNumber: "WO-2024-006",
          customerId: customer6.id,
          title: "Drain Cleaning",
          description: "Clear blockage in main kitchen drain line",
          status: "on-hold",
          scheduledDate: "2024-01-18",
          scheduledTime: "13:00",
          estimatedHours: "1.0",
          assignedTo: "John Smith"
        },
        {
          orderNumber: "WO-2024-007",
          customerId: customer7.id,
          title: "Shower Installation",
          description: "Install new walk-in shower with glass doors",
          status: "pending",
          scheduledDate: "2024-01-19",
          scheduledTime: "08:30",
          estimatedHours: "5.0",
          assignedTo: "Mike Johnson"
        },
        {
          orderNumber: "WO-2024-008",
          customerId: customer8.id,
          title: "Garbage Disposal Repair",
          description: "Fix jammed garbage disposal unit",
          status: "completed",
          scheduledDate: "2024-01-13",
          scheduledTime: "16:00",
          estimatedHours: "1.0",
          assignedTo: "Sarah Williams"
        }
      ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seedDatabase();