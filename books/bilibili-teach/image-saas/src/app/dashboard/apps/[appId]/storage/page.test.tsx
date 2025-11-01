import { render, screen } from '@testing-library/react';
import { trpcClientReact } from '@/utils/api';
import StoragePage from './page';

// Mock the trpcClientReact hooks
jest.mock('@/utils/api', () => ({
  trpcClientReact: {
    storages: {
      listStorages: {
        useQuery: jest.fn(),
      },
    },
    apps: {
      listApps: {
        useQuery: jest.fn(),
      },
    },
  },
}));

describe('StoragePage', () => {
  /**
   * Test case: Renders the component with storage data
   * - Verifies that the component renders correctly with storage data
   * - Checks if the "Storage" heading is displayed
   * - Verifies that storage items are rendered with correct names and button states
   */
  it('renders with storage data', () => {
    // Mock data for storages and apps
    const mockStorages = [
      { id: '1', name: 'Storage 1' },
      { id: '2', name: 'Storage 2' },
    ];
    const mockApps = [{ id: '1', storageId: '1' }];

    // Mock the useQuery hooks
    trpcClientReact.storages.listStorages.useQuery.mockReturnValue({ data: mockStorages });
    trpcClientReact.apps.listApps.useQuery.mockReturnValue({ data: mockApps });

    // Render the component
    render(<StoragePage params={{ appId: '1' }} />);

    // Assertions
    expect(screen.getByText('Storage')).toBeInTheDocument();
    expect(screen.getByText('Storage 1')).toBeInTheDocument();
    expect(screen.getByText('Storage 2')).toBeInTheDocument();
    expect(screen.getByText('Used')).toBeInTheDocument();
    expect(screen.getByText('Use')).toBeInTheDocument();
  });

  /**
   * Test case: Renders with no storage data
   * - Verifies that the component handles empty storage data gracefully
   * - Checks if no storage items are rendered
   */
  it('renders with no storage data', () => {
    // Mock empty data
    trpcClientReact.storages.listStorages.useQuery.mockReturnValue({ data: [] });
    trpcClientReact.apps.listApps.useQuery.mockReturnValue({ data: [] });

    // Render the component
    render(<StoragePage params={{ appId: '1' }} />);

    // Assertions
    expect(screen.getByText('Storage')).toBeInTheDocument();
    expect(screen.queryByText('Storage 1')).not.toBeInTheDocument();
  });

  /**
   * Test case: Renders with loading state
   * - Verifies that the component handles loading state correctly
   * - Checks if loading indicators are displayed (if applicable)
   */
  it('renders with loading state', () => {
    // Mock loading state
    trpcClientReact.storages.listStorages.useQuery.mockReturnValue({ isPending: true });
    trpcClientReact.apps.listApps.useQuery.mockReturnValue({ isPending: true });

    // Render the component
    render(<StoragePage params={{ appId: '1' }} />);

    // Assertions
    expect(screen.getByText('Storage')).toBeInTheDocument();
    // Add loading state assertions if applicable
  });
});