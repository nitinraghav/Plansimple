import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../DashboardScreen';
import { AuthProvider } from '../../../contexts/AuthContext';

const Stack = createNativeStackNavigator();

const mockNavigation = {
  navigate: jest.fn(),
};

const renderWithNavigation = () => {
  return render(
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Dashboard"
            component={(props: any) => (
              <DashboardScreen {...props} navigation={mockNavigation} />
            )}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

describe('DashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all categories', () => {
    const { getByText } = renderWithNavigation();

    expect(getByText('Welcome to Plansimple')).toBeTruthy();
    expect(getByText('Your Legacy Planning Companion')).toBeTruthy();

    // Check if all category cards are rendered
    expect(getByText('Personal Information')).toBeTruthy();
    expect(getByText('Legal Documents')).toBeTruthy();
    expect(getByText('Digital Assets')).toBeTruthy();
    expect(getByText('Final Wishes')).toBeTruthy();
  });

  it('navigates to entry list when a category is pressed', () => {
    const { getByText } = renderWithNavigation();

    fireEvent.press(getByText('Personal Information'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('EntryList', {
      categoryId: 'personal',
      categoryName: 'Personal Information',
    });
  });

  it('navigates to entry list for legal documents', () => {
    const { getByText } = renderWithNavigation();

    fireEvent.press(getByText('Legal Documents'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('EntryList', {
      categoryId: 'legal',
      categoryName: 'Legal Documents',
    });
  });

  it('navigates to entry list for digital assets', () => {
    const { getByText } = renderWithNavigation();

    fireEvent.press(getByText('Digital Assets'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('EntryList', {
      categoryId: 'digital',
      categoryName: 'Digital Assets',
    });
  });

  it('navigates to entry list for final wishes', () => {
    const { getByText } = renderWithNavigation();

    fireEvent.press(getByText('Final Wishes'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('EntryList', {
      categoryId: 'final',
      categoryName: 'Final Wishes',
    });
  });

  it('renders category cards with correct styles', () => {
    const { getByText } = renderWithNavigation();

    const personalInfoCard = getByText('Personal Information').parent;
    const legalDocsCard = getByText('Legal Documents').parent;
    const digitalAssetsCard = getByText('Digital Assets').parent;
    const finalWishesCard = getByText('Final Wishes').parent;

    // Check if cards have the correct styles applied
    expect(personalInfoCard).toHaveStyle({
      marginBottom: 16,
      elevation: 2,
    });
    expect(legalDocsCard).toHaveStyle({
      marginBottom: 16,
      elevation: 2,
    });
    expect(digitalAssetsCard).toHaveStyle({
      marginBottom: 16,
      elevation: 2,
    });
    expect(finalWishesCard).toHaveStyle({
      marginBottom: 16,
      elevation: 2,
    });
  });
}); 