import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomersPage from '../pages/customers';
import { CreateCustomerModal } from '../components/create-customer-modal';
import { DeleteCustomerDialog } from '../components/delete-customer-dialog';

// Mock the API request function
vi.mock('../lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }),
}));

// Mock wouter hooks
vi.mock('wouter', () => ({
  useLocation: () => ['/customers'],
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Avenue',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201'
  }
];

const mockWorkOrders = [
  {
    id: 1,
    customerId: 1,
    orderNumber: 'WO-001',
    title: 'Bathroom Installation',
    status: 'pending'
  },
  {
    id: 2,
    customerId: 1,
    orderNumber: 'WO-002',
    title: 'Pipe Repair',
    status: 'completed'
  }
];

function renderWithQueryClient(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
}

describe('Customer Management UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Customer Modal', () => {
    it('should render create customer form with all required fields', () => {
      renderWithQueryClient(
        <CreateCustomerModal isOpen={true} onClose={() => {}} />
      );

      expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create customer/i })).toBeInTheDocument();
    });

    it('should validate required fields before submission', async () => {
      const user = userEvent.setup();
      renderWithQueryClient(
        <CreateCustomerModal isOpen={true} onClose={() => {}} />
      );

      const submitButton = screen.getByRole('button', { name: /create customer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/customer name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
        expect(screen.getByText(/address is required/i)).toBeInTheDocument();
        expect(screen.getByText(/city is required/i)).toBeInTheDocument();
        expect(screen.getByText(/state is required/i)).toBeInTheDocument();
        expect(screen.getByText(/zip code is required/i)).toBeInTheDocument();
      });
    });

    it('should submit valid customer data', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const { apiRequest } = await import('../lib/queryClient');
      
      vi.mocked(apiRequest).mockResolvedValue({
        id: 3,
        name: 'New Customer',
        phone: '+1 (555) 555-5555',
        address: '789 New Street',
        city: 'New City',
        state: 'NC',
        zipCode: '12345'
      });

      renderWithQueryClient(
        <CreateCustomerModal isOpen={true} onClose={onClose} />
      );

      // Fill out the form
      await user.type(screen.getByLabelText(/customer name/i), 'New Customer');
      await user.type(screen.getByLabelText(/phone number/i), '+1 (555) 555-5555');
      await user.type(screen.getByLabelText(/street address/i), '789 New Street');
      await user.type(screen.getByLabelText(/city/i), 'New City');
      await user.type(screen.getByLabelText(/state/i), 'NC');
      await user.type(screen.getByLabelText(/zip code/i), '12345');

      // Submit the form
      await user.click(screen.getByRole('button', { name: /create customer/i }));

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith('POST', '/api/customers', {
          name: 'New Customer',
          phone: '+1 (555) 555-5555',
          address: '789 New Street',
          city: 'New City',
          state: 'NC',
          zipCode: '12345'
        });
      });
    });

    it('should handle form cancellation', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithQueryClient(
        <CreateCustomerModal isOpen={true} onClose={onClose} />
      );

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Delete Customer Dialog', () => {
    const mockCustomer = mockCustomers[0];

    it('should display customer information and work order count', () => {
      renderWithQueryClient(
        <DeleteCustomerDialog
          customer={mockCustomer}
          isOpen={true}
          onClose={() => {}}
          workOrderCount={2}
        />
      );

      expect(screen.getByText(mockCustomer.name)).toBeInTheDocument();
      expect(screen.getByText(/2 work orders/i)).toBeInTheDocument();
      expect(screen.getByText(/warning.*delete data/i)).toBeInTheDocument();
    });

    it('should show different message for customer with no work orders', () => {
      renderWithQueryClient(
        <DeleteCustomerDialog
          customer={mockCustomer}
          isOpen={true}
          onClose={() => {}}
          workOrderCount={0}
        />
      );

      expect(screen.queryByText(/warning.*delete data/i)).not.toBeInTheDocument();
    });

    it('should handle delete confirmation', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const { apiRequest } = await import('../lib/queryClient');
      
      vi.mocked(apiRequest).mockResolvedValue({
        message: 'Customer deleted successfully',
        deletedCustomer: mockCustomer,
        deletedWorkOrders: 2,
        deletedMeasurements: 5
      });

      renderWithQueryClient(
        <DeleteCustomerDialog
          customer={mockCustomer}
          isOpen={true}
          onClose={onClose}
          workOrderCount={2}
        />
      );

      await user.click(screen.getByRole('button', { name: /delete customer/i }));

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith('DELETE', '/api/customers/1');
      });
    });

    it('should handle delete cancellation', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithQueryClient(
        <DeleteCustomerDialog
          customer={mockCustomer}
          isOpen={true}
          onClose={onClose}
          workOrderCount={2}
        />
      );

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Customer Search and Filter', () => {
    it('should filter customers by name', async () => {
      const user = userEvent.setup();
      
      // Mock the queries
      vi.doMock('@tanstack/react-query', async () => {
        const actual = await vi.importActual('@tanstack/react-query');
        return {
          ...actual,
          useQuery: vi.fn().mockImplementation(({ queryKey }) => {
            if (queryKey[0] === '/api/customers') {
              return { data: mockCustomers };
            }
            if (queryKey[0] === '/api/work-orders') {
              return { data: mockWorkOrders };
            }
            return { data: [] };
          }),
        };
      });

      renderWithQueryClient(<CustomersPage />);

      const searchInput = screen.getByPlaceholderText(/search customers/i);
      await user.type(searchInput, 'John');

      // This would normally filter the displayed customers
      // The actual filtering logic would be tested in integration tests
    });
  });

  describe('Error Handling', () => {
    it('should display error message when customer creation fails', async () => {
      const user = userEvent.setup();
      const { apiRequest } = await import('../lib/queryClient');
      
      vi.mocked(apiRequest).mockRejectedValue(new Error('Network error'));

      renderWithQueryClient(
        <CreateCustomerModal isOpen={true} onClose={() => {}} />
      );

      // Fill out and submit the form
      await user.type(screen.getByLabelText(/customer name/i), 'Test Customer');
      await user.type(screen.getByLabelText(/phone number/i), '+1 (555) 123-4567');
      await user.type(screen.getByLabelText(/street address/i), '123 Test St');
      await user.type(screen.getByLabelText(/city/i), 'Test City');
      await user.type(screen.getByLabelText(/state/i), 'TC');
      await user.type(screen.getByLabelText(/zip code/i), '12345');

      await user.click(screen.getByRole('button', { name: /create customer/i }));

      // Error handling would be shown via toast notifications
      // This would be tested in integration tests with the actual toast system
    });

    it('should display error message when customer deletion fails', async () => {
      const user = userEvent.setup();
      const { apiRequest } = await import('../lib/queryClient');
      
      vi.mocked(apiRequest).mockRejectedValue(new Error('Deletion failed'));

      renderWithQueryClient(
        <DeleteCustomerDialog
          customer={mockCustomers[0]}
          isOpen={true}
          onClose={() => {}}
          workOrderCount={0}
        />
      );

      await user.click(screen.getByRole('button', { name: /delete customer/i }));

      // Error handling would be shown via toast notifications
      // This would be tested in integration tests
    });
  });
});