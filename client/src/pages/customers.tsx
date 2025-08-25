import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/app-header";
import { CreateCustomerModal } from "@/components/create-customer-modal";
import { DeleteCustomerDialog } from "@/components/delete-customer-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Trash2, MapPin, Phone } from "lucide-react";
import type { Customer, WorkOrderWithCustomer } from "@shared/schema";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: workOrders = [] } = useQuery({
    queryKey: ["/api/work-orders"],
  });

  // Filter customers based on search term
  const filteredCustomers = (customers as Customer[]).filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get work order count for each customer
  const getWorkOrderCount = (customerId: number) => {
    return (workOrders as WorkOrderWithCustomer[]).filter(wo => wo.customerId === customerId).length;
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Customer Management</h2>
            <p className="text-muted-foreground mt-1">Manage your customer database</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Customer
            </Button>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer: Customer) => {
            const workOrderCount = getWorkOrderCount(customer.id);
            
            return (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(customer)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {customer.phone}
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <div>
                      <div>{customer.address}</div>
                      <div>{customer.city}, {customer.state} {customer.zipCode}</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      {workOrderCount} work order{workOrderCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? "No customers found matching your search." : "No customers found."}
            </p>
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateCustomerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {customerToDelete && (
        <DeleteCustomerDialog
          customer={customerToDelete}
          isOpen={!!customerToDelete}
          onClose={() => setCustomerToDelete(null)}
          workOrderCount={getWorkOrderCount(customerToDelete.id)}
        />
      )}
    </div>
  );
}