import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Phone, MapPin, Calendar, Clock, Wrench, FileText, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkOrderWithCustomer, Measurement } from "@shared/schema";

interface WorkOrderDetailsModalProps {
  workOrder: WorkOrderWithCustomer;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkOrderDetailsModal({ workOrder, isOpen, onClose }: WorkOrderDetailsModalProps) {
  const { data: measurements = [] } = useQuery({
    queryKey: ["/api/work-orders", workOrder.id, "measurements"],
    enabled: isOpen,
  });

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
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const formatMeasurementDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-primary" />
            Work Order Details - {workOrder.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={cn("text-sm font-medium", getStatusColor(workOrder.status))}>
                  {getStatusText(workOrder.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">Assigned to {workOrder.assignedTo}</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">{workOrder.title}</h3>
              <p className="text-muted-foreground mt-1">{workOrder.description}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm text-foreground">{workOrder.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {workOrder.customer.phone}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-sm text-foreground flex items-start">
                    <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>
                      {workOrder.customer.address}<br />
                      {workOrder.customer.city}, {workOrder.customer.state} {workOrder.customer.zipCode}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {workOrder.status === "completed" ? "Completed Date" : "Scheduled Date"}
                  </p>
                  <p className="text-sm text-foreground">{formatDate(workOrder.scheduledDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {workOrder.status === "completed" ? "Start Time" : "Scheduled Time"}
                  </p>
                  <p className="text-sm text-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(workOrder.scheduledTime)}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Duration</p>
                  <p className="text-sm text-foreground">{workOrder.estimatedHours} hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Measurements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Measurements & Notes
                <span className="text-sm font-normal text-muted-foreground">
                  ({measurements.length} recorded)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {measurements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No measurements recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {measurements.map((measurement: Measurement, index: number) => (
                    <div key={measurement.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground">
                          Measurement #{index + 1}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatMeasurementDate(measurement.recordedAt)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {measurement.pipeDiameter && (
                          <div>
                            <p className="text-muted-foreground">Pipe Diameter</p>
                            <p className="font-medium">{measurement.pipeDiameter}"</p>
                          </div>
                        )}
                        {measurement.pipeLength && (
                          <div>
                            <p className="text-muted-foreground">Pipe Length</p>
                            <p className="font-medium">{measurement.pipeLength} ft</p>
                          </div>
                        )}
                        {measurement.waterPressure && (
                          <div>
                            <p className="text-muted-foreground">Water Pressure</p>
                            <p className="font-medium">{measurement.waterPressure} PSI</p>
                          </div>
                        )}
                        {measurement.installationHeight && (
                          <div>
                            <p className="text-muted-foreground">Installation Height</p>
                            <p className="font-medium">{measurement.installationHeight}"</p>
                          </div>
                        )}
                      </div>
                      
                      {measurement.notes && (
                        <div>
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="text-sm text-foreground bg-muted rounded p-2 mt-1">
                            {measurement.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}