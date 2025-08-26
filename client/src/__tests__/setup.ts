import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock Lucide React icons
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    AlertTriangle: () => 'AlertTriangle',
    Trash2: () => 'Trash2',
    UserPlus: () => 'UserPlus',
    Search: () => 'Search',
    MapPin: () => 'MapPin',
    Phone: () => 'Phone',
    Wrench: () => 'Wrench',
    UserCircle: () => 'UserCircle',
    Plus: () => 'Plus',
    User: () => 'User',
    Calendar: () => 'Calendar',
    FileText: () => 'FileText',
    X: () => 'X',
    Check: () => 'Check',
    ChevronDown: () => 'ChevronDown',
    Circle: () => 'Circle',
    CheckCircle: () => 'CheckCircle',
    Info: () => 'Info',
    AlertCircle: () => 'AlertCircle',
    EyeOff: () => 'EyeOff',
    Eye: () => 'Eye',
  };
});