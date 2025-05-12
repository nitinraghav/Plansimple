import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList } from './types';
import { IconButton } from 'react-native-paper';
import DashboardScreen from '../screens/main/DashboardScreen';
import EntryListScreen from '../screens/main/EntryListScreen';
import EntryFormScreen from '../screens/main/EntryFormScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainTabParamList>();

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen 
        name="EntryList" 
        component={EntryListScreen}
        options={({ route }) => ({ 
          title: route.params.category.charAt(0).toUpperCase() + route.params.category.slice(1)
        })}
      />
      <Stack.Screen 
        name="EntryForm" 
        component={EntryFormScreen}
        options={({ route }) => ({ 
          title: route.params.entryId ? 'Edit Entry' : 'New Entry'
        })}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'view-dashboard';
              break;
            case 'Profile':
              iconName = 'account';
              break;
            default:
              iconName = 'circle';
          }

          return <IconButton icon={iconName} size={size} iconColor={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
} 