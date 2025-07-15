import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/app-header";
import { StatusSummary } from "@/components/status-summary";
import { WorkOrderCard } from "@/components/work-order-card";
import { MeasurementModal } from "@/components/measurement-modal";
import { WorkOrderDetailsModal } from "@/components/work-order-details-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { WorkOrderWithCustomer } from "@shared/schema";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrderWithCustomer | null>(null);
  const [detailsWorkOrder, setDetailsWorkOrder] = useState<WorkOrderWithCustomer | null>(null);

  const { data: workOrders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["/api/work-orders"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/work-orders/stats/summary"],
  });

  const filteredWorkOrders = workOrders.filter((order: WorkOrderWithCustomer) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleMeasurementClick = (workOrder: WorkOrderWithCustomer) => {
    setSelectedWorkOrder(workOrder);
  };

  const handleDetailsClick = (workOrder: WorkOrderWithCustomer) => {
    setDetailsWorkOrder(workOrder);
  };

  if (isLoadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading work orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Work Orders</h2>
              <p className="text-muted-foreground mt-1">Manage your assigned installations and repairs</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search work orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <StatusSummary stats={stats} />

        {/* Work Orders List */}
        <div className="space-y-4">
          {filteredWorkOrders.map((workOrder: WorkOrderWithCustomer) => (
            <WorkOrderCard
              key={workOrder.id}
              workOrder={workOrder}
              onMeasurementClick={handleMeasurementClick}
              onDetailsClick={handleDetailsClick}
            />
          ))}
          
          {filteredWorkOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No work orders found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      {/* Measurement Modal */}
      {selectedWorkOrder && (
        <MeasurementModal
          workOrder={selectedWorkOrder}
          isOpen={!!selectedWorkOrder}
          onClose={() => setSelectedWorkOrder(null)}
        />
      )}

      {/* Work Order Details Modal */}
      {detailsWorkOrder && (
        <WorkOrderDetailsModal
          workOrder={detailsWorkOrder}
          isOpen={!!detailsWorkOrder}
          onClose={() => setDetailsWorkOrder(null)}
        />
      )}

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border sm:hidden">
        <div className="flex justify-around py-2">
          <a href="#" className="flex flex-col items-center py-2 px-3 text-primary">
            <i className="fas fa-home text-xl"></i>
            <span className="text-xs mt-1">Dashboard</span>
          </a>
          <a href="#" className="flex flex-col items-center py-2 px-3 text-muted-foreground">
            <i className="fas fa-clipboard-list text-xl"></i>
            <span className="text-xs mt-1">Orders</span>
          </a>
          <a href="#" className="flex flex-col items-center py-2 px-3 text-muted-foreground">
            <i className="fas fa-chart-bar text-xl"></i>
            <span className="text-xs mt-1">Reports</span>
          </a>
          <a href="#" className="flex flex-col items-center py-2 px-3 text-muted-foreground">
            <i className="fas fa-cog text-xl"></i>
            <span className="text-xs mt-1">Settings</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
