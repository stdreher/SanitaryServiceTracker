import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Customer } from "@shared/schema";

interface DeleteCustomerDialogProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  workOrderCount?: number;
}

export function DeleteCustomerDialog({ customer, isOpen, onClose, workOrderCount = 0 }: DeleteCustomerDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: number) => {
      setIsDeleting(true);
      return apiRequest("DELETE", `/api/customers/${customerId}`);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Customer Deleted",
        description: `Successfully deleted ${customer.name} and ${data.deletedWorkOrders} work orders.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/work-orders/stats/summary"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
      console.error("Error deleting customer:", error);
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const handleConfirmDelete = () => {
    deleteCustomerMutation.mutate(customer.id);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Customer
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div>
              Are you sure you want to delete <strong>{customer.name}</strong>?
            </div>
            
            {workOrderCount > 0 && (
              <div className="p-4 bg-destructive/10 rounded-md border border-destructive/20">
                <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Warning: This action will also delete data
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• {workOrderCount} work order{workOrderCount !== 1 ? 's' : ''}</li>
                  <li>• All measurements and records for these work orders</li>
                </ul>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              This action cannot be undone. All customer data, work orders, and measurements will be permanently removed from the system.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Customer
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}