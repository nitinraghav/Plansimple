import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import { categories } from '../../theme';

type Props = NativeStackScreenProps<MainTabParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Your Legacy Plan
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Organize your important information
        </Text>

        <View style={styles.categories}>
          {categories.map((category) => (
            <Card
              key={category.id}
              style={styles.card}
              onPress={() => navigation.navigate('EntryList', { category: category.id })}
            >
              <Card.Content>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  {category.title}
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  {category.description}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 30,
  },
  categories: {
    gap: 15,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardDescription: {
    opacity: 0.7,
  },
}); 