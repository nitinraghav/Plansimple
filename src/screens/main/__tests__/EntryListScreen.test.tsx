import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EntryListScreen from '../EntryListScreen';
import { AuthProvider } from '../../../contexts/AuthContext';
import { getEntries, deleteEntry } from '../../../services/entryService';

// Mock the entry service
jest.mock('../../../services/entryService');

const Stack = createNativeStackNavigator();

const mockNavigation = {
  navigate: jest.fn(),
  setOptions: jest.fn(),
};

const mockRoute = {
  params: {
    categoryId: 'personal',
    categoryName: 'Personal Information',
  },
};

const mockEntries = [
  {
    id: '1',
    title: 'Test Entry 1',
    description: 'Description 1',
    categoryId: 'personal',
    userId: 'user123',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Test Entry 2',
    description: 'Description 2',
    categoryId: 'personal',
    userId: 'user123',
    createdAt: new Date(),
  },
];

const renderWithNavigation = () => {
  return render(
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="EntryList"
            component={(props: any) => (
              <EntryListScreen
                {...props}
                navigation={mockNavigation}
                route={mockRoute}
              />
            )}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

describe('EntryListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getEntries as jest.Mock).mockResolvedValue(mockEntries);
  });

  it('renders correctly with entries', async () => {
    const { getByText, findByText } = renderWithNavigation();

    // Check if the category name is displayed
    expect(getByText('Personal Information')).toBeTruthy();

    // Wait for entries to load
    await waitFor(() => {
      expect(getEntries).toHaveBeenCalledWith('user123', 'personal');
    });

    // Check if entries are displayed
    expect(await findByText('Test Entry 1')).toBeTruthy();
    expect(await findByText('Description 1')).toBeTruthy();
    expect(await findByText('Test Entry 2')).toBeTruthy();
    expect(await findByText('Description 2')).toBeTruthy();
  });

  it('shows empty state when no entries', async () => {
    (getEntries as jest.Mock).mockResolvedValue([]);

    const { getByText } = renderWithNavigation();

    await waitFor(() => {
      expect(getByText('No entries yet')).toBeTruthy();
      expect(getByText('Add your first entry')).toBeTruthy();
    });
  });

  it('navigates to entry form when FAB is pressed', async () => {
    const { getByTestId } = renderWithNavigation();

    await waitFor(() => {
      expect(getEntries).toHaveBeenCalled();
    });

    fireEvent.press(getByTestId('add-entry-fab'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('EntryForm', {
      categoryId: 'personal',
      categoryName: 'Personal Information',
    });
  });

  it('shows delete confirmation dialog', async () => {
    const { getByText, getByTestId } = renderWithNavigation();

    await waitFor(() => {
      expect(getEntries).toHaveBeenCalled();
    });

    // Press delete button on first entry
    fireEvent.press(getByTestId('delete-entry-1'));

    // Check if confirmation dialog is shown
    expect(getByText('Delete Entry')).toBeTruthy();
    expect(getByText('Are you sure you want to delete this entry?')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  it('deletes entry when confirmed', async () => {
    (deleteEntry as jest.Mock).mockResolvedValue(undefined);

    const { getByText, getByTestId } = renderWithNavigation();

    await waitFor(() => {
      expect(getEntries).toHaveBeenCalled();
    });

    // Open delete dialog
    fireEvent.press(getByTestId('delete-entry-1'));

    // Confirm deletion
    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(deleteEntry).toHaveBeenCalledWith('1', 'user123');
      expect(getEntries).toHaveBeenCalledTimes(2); // Initial load + refresh after delete
    });
  });

  it('cancels deletion when cancel is pressed', async () => {
    const { getByText, getByTestId } = renderWithNavigation();

    await waitFor(() => {
      expect(getEntries).toHaveBeenCalled();
    });

    // Open delete dialog
    fireEvent.press(getByTestId('delete-entry-1'));

    // Cancel deletion
    fireEvent.press(getByText('Cancel'));

    await waitFor(() => {
      expect(deleteEntry).not.toHaveBeenCalled();
      expect(getEntries).toHaveBeenCalledTimes(1); // Only initial load
    });
  });

  it('handles error when loading entries', async () => {
    const error = new Error('Failed to load entries');
    (getEntries as jest.Mock).mockRejectedValue(error);

    const { getByText } = renderWithNavigation();

    await waitFor(() => {
      expect(getByText('Error loading entries')).toBeTruthy();
    });
  });

  it('handles error when deleting entry', async () => {
    const error = new Error('Failed to delete entry');
    (deleteEntry as jest.Mock).mockRejectedValue(error);

    const { getByText, getByTestId } = renderWithNavigation();

    await waitFor(() => {
      expect(getEntries).toHaveBeenCalled();
    });

    // Open delete dialog
    fireEvent.press(getByTestId('delete-entry-1'));

    // Confirm deletion
    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(getByText('Error deleting entry')).toBeTruthy();
    });
  });
}); 