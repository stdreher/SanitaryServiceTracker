import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Phone, MapPin, Calendar, Clock, Edit, Eye, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkOrderWithCustomer } from "@shared/schema";

interface WorkOrderCardProps {
  workOrder: WorkOrderWithCustomer;
  onMeasurementClick: (workOrder: WorkOrderWithCustomer) => void;
  onDetailsClick: (workOrder: WorkOrderWithCustomer) => void;
  onStartWork: (workOrder: WorkOrderWithCustomer) => void;
}

export function WorkOrderCard({ workOrder, onMeasurementClick, onDetailsClick, onStartWork }: WorkOrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "in-progress":
        return "status-in-progress";
      case "completed":
        return "status-completed";
      case "on-hold":
        return "status-on-hold";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "on-hold":
        return "On Hold";
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <Card className="border border-border overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <Badge className={cn("text-xs font-medium", getStatusColor(workOrder.status))}>
              {getStatusText(workOrder.status)}
            </Badge>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{workOrder.orderNumber}</h3>
              <p className="text-sm text-muted-foreground">{workOrder.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {workOrder.status === "pending" && (
              <Button size="sm" onClick={() => onStartWork(workOrder)} className="bg-primary hover:bg-primary/90">
                <Play className="h-4 w-4 mr-2" />
                Start Work
              </Button>
            )}
            {workOrder.status === "in-progress" && (
              <Button size="sm" onClick={() => onMeasurementClick(workOrder)} className="bg-primary hover:bg-primary/90">
                <Edit className="h-4 w-4 mr-2" />
                Record Measurements
              </Button>
            )}

            <Button size="sm" variant="outline" onClick={() => onDetailsClick(workOrder)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Customer</p>
            <p className="text-sm text-foreground flex items-center">
              <User className="h-4 w-4 mr-2" />
              {workOrder.customer.name}
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              {workOrder.customer.phone}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p className="text-sm text-foreground flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {workOrder.customer.address}
            </p>
            <p className="text-sm text-muted-foreground">
              {workOrder.customer.city}, {workOrder.customer.state} {workOrder.customer.zipCode}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {workOrder.status === "completed" ? "Completed" : "Schedule"}
            </p>
            <p className="text-sm text-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(workOrder.scheduledDate)}
              {workOrder.status !== "completed" && `, ${formatTime(workOrder.scheduledTime)}`}
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {workOrder.status === "completed" ? `Duration: ${workOrder.estimatedHours} hours` : `Est. ${workOrder.estimatedHours} hours`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
