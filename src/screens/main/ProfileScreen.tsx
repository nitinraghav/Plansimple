import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Profile
          </Text>
          <Text variant="bodyLarge" style={styles.email}>
            {user?.email}
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
      >
        Logout
      </Button>

      <Text variant="bodySmall" style={styles.version}>
        Version 1.0.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
  },
  title: {
    marginBottom: 8,
  },
  email: {
    opacity: 0.7,
  },
  logoutButton: {
    marginTop: 'auto',
    borderRadius: 8,
  },
  version: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.5,
  },
}); 