import { db } from "./db";
import { customers, workOrders } from "@shared/schema";

async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Create customers
    const [customer1, customer2, customer3] = await db
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
        }
      ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seedDatabase();