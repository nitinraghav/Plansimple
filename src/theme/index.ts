import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    secondary: '#03DAC6',
    error: '#B00020',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    disabled: '#757575',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 4,
};

export const categories = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Store your personal details and important information',
    icon: 'account-details',
  },
  {
    id: 'legal',
    title: 'Legal Documents',
    description: 'Keep your legal documents and contracts organized',
    icon: 'file-document',
  },
  {
    id: 'digital',
    title: 'Digital Assets',
    description: 'Manage your digital accounts and assets',
    icon: 'desktop-mac-dashboard',
  },
  {
    id: 'wishes',
    title: 'Final Wishes',
    description: 'Document your final wishes and preferences',
    icon: 'heart',
  },
] as const; 