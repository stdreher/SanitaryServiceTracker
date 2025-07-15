import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { WorkOrderWithCustomer } from "@shared/schema";

const measurementSchema = z.object({
  pipeDiameter: z.string().optional(),
  pipeLength: z.string().optional(),
  waterPressure: z.string().optional(),
  installationHeight: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed", "on-hold"]).optional(),
});

type MeasurementFormData = z.infer<typeof measurementSchema>;

interface MeasurementModalProps {
  workOrder: WorkOrderWithCustomer;
  isOpen: boolean;
  onClose: () => void;
}

export function MeasurementModal({ workOrder, isOpen, onClose }: MeasurementModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      pipeDiameter: "",
      pipeLength: "",
      waterPressure: "",
      installationHeight: "",
      notes: "",
      status: workOrder.status as any,
    },
  });

  const createMeasurementMutation = useMutation({
    mutationFn: async (data: MeasurementFormData) => {
      const measurementData = {
        pipeDiameter: data.pipeDiameter ? parseFloat(data.pipeDiameter) : undefined,
        pipeLength: data.pipeLength ? parseFloat(data.pipeLength) : undefined,
        waterPressure: data.waterPressure ? parseInt(data.waterPressure) : undefined,
        installationHeight: data.installationHeight ? parseFloat(data.installationHeight) : undefined,
        notes: data.notes || undefined,
      };

      await apiRequest("POST", `/api/work-orders/${workOrder.id}/measurements`, measurementData);
      
      if (data.status && data.status !== workOrder.status) {
        await apiRequest("PATCH", `/api/work-orders/${workOrder.id}`, { status: data.status });
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Measurements recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/work-orders/stats/summary"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record measurements",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MeasurementFormData) => {
    createMeasurementMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Measurements</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">
              Work Order: {workOrder.orderNumber}
            </h4>
            <p className="text-sm text-muted-foreground">
              {workOrder.title} - {workOrder.customer.name}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pipeDiameter">Pipe Diameter (inches)</Label>
                <Input
                  id="pipeDiameter"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("pipeDiameter")}
                />
              </div>
              <div>
                <Label htmlFor="pipeLength">Pipe Length (feet)</Label>
                <Input
                  id="pipeLength"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("pipeLength")}
                />
              </div>
              <div>
                <Label htmlFor="waterPressure">Water Pressure (PSI)</Label>
                <Input
                  id="waterPressure"
                  type="number"
                  placeholder="0"
                  {...form.register("waterPressure")}
                />
              </div>
              <div>
                <Label htmlFor="installationHeight">Installation Height (inches)</Label>
                <Input
                  id="installationHeight"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("installationHeight")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="Additional notes about the installation..."
                {...form.register("notes")}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) => form.setValue("status", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMeasurementMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {createMeasurementMutation.isPending ? "Saving..." : "Save Measurements"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
