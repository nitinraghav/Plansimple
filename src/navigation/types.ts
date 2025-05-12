import { NavigatorScreenParams } from '@react-navigation/native';
import { Category } from '../types';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  EntryList: { category: Category };
  EntryForm: { category: Category; entryId?: string };
  Profile: undefined;
}; 