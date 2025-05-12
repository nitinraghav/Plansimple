import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { createEntry, updateEntry, getEntries } from '../../services/entryService';
import { Entry } from '../../types';

type Props = NativeStackScreenProps<MainTabParamList, 'EntryForm'>;

export default function EntryFormScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { user } = useAuth();
  const { category, entryId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (entryId) {
      loadEntry();
    }
  }, [entryId]);

  const loadEntry = async () => {
    if (!user || !entryId) return;
    try {
      const entries = await getEntries(user.uid, category);
      const entry = entries.find(e => e.id === entryId);
      if (entry) {
        setTitle(entry.title);
        setDescription(entry.description);
      }
    } catch (error) {
      console.error('Error loading entry:', error);
      setError('Failed to load entry');
    }
  };

  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const filename = asset.uri.split('/').pop() || 'file';
        const file = new File([blob], filename, { type: blob.type });
        setFile(file);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      setError('Failed to pick file');
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (entryId) {
        await updateEntry(entryId, user.uid, {
          title: title.trim(),
          description: description.trim(),
          category,
        }, file || undefined);
      } else {
        await createEntry(
          user.uid,
          category,
          title.trim(),
          description.trim(),
          file || undefined
        );
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving entry:', error);
      setError('Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Button
          mode="outlined"
          onPress={pickFile}
          style={styles.fileButton}
          icon="file-upload"
        >
          {file ? 'Change File' : 'Attach File'}
        </Button>

        {file && (
          <Text style={styles.fileName}>
            Selected: {file.name}
          </Text>
        )}

        {error ? (
          <Text style={[styles.error, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          {entryId ? 'Update Entry' : 'Create Entry'}
        </Button>
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
  input: {
    marginBottom: 16,
  },
  fileButton: {
    marginBottom: 8,
  },
  fileName: {
    marginBottom: 16,
    opacity: 0.7,
  },
  error: {
    textAlign: 'center',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
  },
}); 