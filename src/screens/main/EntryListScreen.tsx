import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Card, FAB, Text, IconButton, useTheme, Portal, Dialog, Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { getEntries, deleteEntry } from '../../services/entryService';
import { Entry } from '../../types';

type Props = NativeStackScreenProps<MainTabParamList, 'EntryList'>;

export default function EntryListScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { user } = useAuth();
  const { category } = route.params;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  useEffect(() => {
    loadEntries();
  }, [category]);

  const loadEntries = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getEntries(user.uid, category);
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !selectedEntry) return;
    try {
      await deleteEntry(selectedEntry.id, user.uid);
      setEntries(entries.filter(entry => entry.id !== selectedEntry.id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    } finally {
      setDeleteDialogVisible(false);
      setSelectedEntry(null);
    }
  };

  const renderItem = ({ item }: { item: Entry }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium">{item.title}</Text>
          <View style={styles.cardActions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => navigation.navigate('EntryForm', { category, entryId: item.id })}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => {
                setSelectedEntry(item);
                setDeleteDialogVisible(true);
              }}
            />
          </View>
        </View>
        <Text variant="bodyMedium" style={styles.description}>
          {item.description}
        </Text>
        {item.fileUrl && (
          <Text variant="bodySmall" style={styles.fileLink}>
            📎 Attachment available
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>
              No entries yet. Tap + to add one.
            </Text>
          ) : null
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('EntryForm', { category })}
      />

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Entry</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this entry?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
  },
  description: {
    opacity: 0.7,
  },
  fileLink: {
    marginTop: 8,
    color: '#2196F3',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 32,
  },
}); 