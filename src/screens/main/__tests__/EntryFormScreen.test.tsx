import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EntryFormScreen from '../EntryFormScreen';
import { AuthProvider } from '../../../contexts/AuthContext';
import { createEntry, updateEntry } from '../../../services/entryService';
import * as ImagePicker from 'expo-image-picker';

// Mock the entry service and image picker
jest.mock('../../../services/entryService');
jest.mock('expo-image-picker');

const Stack = createNativeStackNavigator();

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

const mockRoute = {
  params: {
    categoryId: 'personal',
    categoryName: 'Personal Information',
    entryId: undefined, // For new entry
  },
};

const mockEditRoute = {
  params: {
    categoryId: 'personal',
    categoryName: 'Personal Information',
    entryId: '1', // For editing existing entry
  },
};

const mockEntry = {
  id: '1',
  title: 'Test Entry',
  description: 'Test Description',
  categoryId: 'personal',
  userId: 'user123',
  createdAt: new Date(),
};

const renderWithNavigation = (route = mockRoute) => {
  return render(
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="EntryForm"
            component={(props: any) => (
              <EntryFormScreen
                {...props}
                navigation={mockNavigation}
                route={route}
              />
            )}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

describe('EntryFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for new entry', () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation();

    expect(getByPlaceholderText('Title')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByText('Attach File')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
  });

  it('renders correctly for editing entry', async () => {
    (updateEntry as jest.Mock).mockResolvedValue(mockEntry);

    const { getByPlaceholderText, getByText } = renderWithNavigation(mockEditRoute);

    await waitFor(() => {
      expect(getByPlaceholderText('Title')).toHaveProp('value', 'Test Entry');
      expect(getByPlaceholderText('Description')).toHaveProp('value', 'Test Description');
    });
  });

  it('validates required fields', async () => {
    const { getByText } = renderWithNavigation();

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Title is required')).toBeTruthy();
      expect(getByText('Description is required')).toBeTruthy();
    });
  });

  it('creates new entry successfully', async () => {
    (createEntry as jest.Mock).mockResolvedValue(mockEntry);

    const { getByPlaceholderText, getByText } = renderWithNavigation();

    fireEvent.changeText(getByPlaceholderText('Title'), 'New Entry');
    fireEvent.changeText(getByPlaceholderText('Description'), 'New Description');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(createEntry).toHaveBeenCalledWith(
        {
          title: 'New Entry',
          description: 'New Description',
          categoryId: 'personal',
        },
        'user123'
      );
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  it('updates existing entry successfully', async () => {
    (updateEntry as jest.Mock).mockResolvedValue(mockEntry);

    const { getByPlaceholderText, getByText } = renderWithNavigation(mockEditRoute);

    await waitFor(() => {
      expect(getByPlaceholderText('Title')).toHaveProp('value', 'Test Entry');
    });

    fireEvent.changeText(getByPlaceholderText('Title'), 'Updated Entry');
    fireEvent.changeText(getByPlaceholderText('Description'), 'Updated Description');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(updateEntry).toHaveBeenCalledWith(
        '1',
        {
          title: 'Updated Entry',
          description: 'Updated Description',
          categoryId: 'personal',
        },
        'user123'
      );
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  it('handles file attachment', async () => {
    const mockImageResult = {
      canceled: false,
      assets: [
        {
          uri: 'file://test.jpg',
          name: 'test.jpg',
          type: 'image/jpeg',
        },
      ],
    };

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockImageResult);

    const { getByText } = renderWithNavigation();

    fireEvent.press(getByText('Attach File'));

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
    });

    expect(getByText('test.jpg')).toBeTruthy();
  });

  it('handles file attachment cancellation', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: true,
    });

    const { getByText, queryByText } = renderWithNavigation();

    fireEvent.press(getByText('Attach File'));

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });

    expect(queryByText('test.jpg')).toBeNull();
  });

  it('handles error when creating entry', async () => {
    const error = new Error('Failed to create entry');
    (createEntry as jest.Mock).mockRejectedValue(error);

    const { getByPlaceholderText, getByText } = renderWithNavigation();

    fireEvent.changeText(getByPlaceholderText('Title'), 'New Entry');
    fireEvent.changeText(getByPlaceholderText('Description'), 'New Description');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Error saving entry')).toBeTruthy();
    });
  });

  it('handles error when updating entry', async () => {
    const error = new Error('Failed to update entry');
    (updateEntry as jest.Mock).mockRejectedValue(error);

    const { getByPlaceholderText, getByText } = renderWithNavigation(mockEditRoute);

    await waitFor(() => {
      expect(getByPlaceholderText('Title')).toHaveProp('value', 'Test Entry');
    });

    fireEvent.changeText(getByPlaceholderText('Title'), 'Updated Entry');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Error saving entry')).toBeTruthy();
    });
  });
}); 