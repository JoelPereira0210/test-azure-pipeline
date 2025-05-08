import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';

type Props = {
  setFiles: React.Dispatch<any>;
  setError: React.Dispatch<React.SetStateAction<string | null>>; // Allowing null type here
};

const FileUpload = ({ setError, setFiles }: Props) => {
  const fileInputRef = useRef<any>(null);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleImageClick = () => {
    // Trigger file picker (use any library like 'react-native-document-picker' or 'expo-document-picker')
    fileInputRef.current?.pickDocument();
  };

  const handleFileChange = (files: any[]) => {
    setError(""); // Clear error message by setting an empty string

    if (files.length > 3) {
      setError('You can upload a maximum of 3 files.');
      return;
    }

    let totalSize = 0;
    const allowedTypes = ['image/*', 'video/*', 'audio/*']; // Allow images, videos, and audio
    const invalidFiles: string[] = [];

    // Check file sizes and types
    files.forEach((file) => {
      totalSize += file.size;

      // Check for allowed types
      if (!allowedTypes.some((type) => file.type.match(type))) {
        invalidFiles.push(file.name);
      }
    });

    // Check total size
    if (totalSize > 10 * 1024 * 1024) {
      setError('Total file size cannot exceed 10MB.');
      return;
    }

    // If there are invalid files, set an error message
    if (invalidFiles.length > 0) {
      setError(`Invalid file types: ${invalidFiles.join(', ')}`);
      return;
    }

    console.log('Selected files:', files);
    setFiles(files);
  };

  return (
    <View style={styles.container}>
      {/* Image picker using document picker */}
      <TouchableOpacity onPress={handleImageClick} style={styles.imageButton}>
        <Image
          // source={{ uri: '/images/attachmentIcon.png' }}
           source={require('../../../images/attachmentIcon.png')}
          style={styles.imageIcon}
        />
      </TouchableOpacity>

      {/* Show Snackbar with error message */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setVisible(false);
          },
        }}
      >
        {errorMessage}
      </Snackbar>

      {/* You can implement the file picker using any React Native library */}
      {/* Example for using react-native-document-picker */}
      {/* <DocumentPicker ref={fileInputRef} onChange={handleFileChange} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButton: {
    padding: 10,
  },
  imageIcon: {
    width: 24,
    height: 24,
  },
});

export default FileUpload;