import React, { useEffect, useState } from 'react';
import { Text, IconButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { useFormContext } from 'react-hook-form';
import ButtonInput from '../Button/Button';
import { useTheme } from '../../../../theme/themeProvider';
import { View, StyleSheet } from 'react-native';

interface DropZoneInputProps {
  close?: () => void;
  media: any[];
  onChange: (files: any[]) => void;
  FileSize: number;
  MaxFiles: number;
  mode: 'light' | 'dark';
}

const DropZoneInput: React.FC<DropZoneInputProps> = ({
  close,
  media,
  onChange,
  FileSize,
  MaxFiles,
}) => {
  const { setValue, watch } = useFormContext();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { theme, mode } = useTheme(); // Access theme and mode
  const MAX_FILE_SIZE = FileSize * 1024 * 1024; // Convert to bytes
  const MAX_FILE_COUNT = MaxFiles || 1;
  const logo = watch('logo');

  useEffect(() => {
    if (Array.isArray(logo)) {
      setFiles(logo);
    } else if (logo) {
      setFiles([logo]);
    } else if (media.length > 0) {
      setFiles(media);
    }
  }, [logo]);

  const handleSelectMedia = () => {
    const options = {
      mediaType: 'mixed',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      selectionLimit: MAX_FILE_COUNT,
    };

    //@ts-ignore
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled media picker');
      } else if (response.errorCode) {
        setErrorMessage(`Error: ${response.errorMessage}`);
      } else {
        const newFiles =
          response.assets?.map((asset: any) => ({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
            size: asset.fileSize,
          })) || [];

        const validFiles = newFiles.filter(
          (file) => file.size <= MAX_FILE_SIZE
        );

        if (validFiles.length < newFiles.length) {
          setErrorMessage(
            `Some files exceeded the size limit of ${FileSize}MB.`
          );
        }

        if (files.length + validFiles.length > MAX_FILE_COUNT) {
          setErrorMessage(`You can upload up to ${MAX_FILE_COUNT} files.`);
        } else {
          setFiles((prevFiles) => [...prevFiles, ...validFiles]);
        }
      }
    });
  };

  const onRemove = (fileToRemove: any) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileToRemove.name));
  };

  const saveFormMedia = () => {
    setLoading(true);
    setValue('logo', files);
    onChange(files);
    if (close) close();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.colors.mainText }]}>Upload</Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.mainText,
          },
        ]}
        onTouchEnd={handleSelectMedia}
      >
        <Text style={[styles.instructionText, { color: theme.colors.mainText }]}>
          Tap to Select Files (Images, Videos, or Audio)
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.mainText }]}>
          Max {FileSize} MB files are allowed
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.mainText }]}>
          Supported formats: PNG, JPG, MP4, MP3, WAV, etc.
        </Text>
      </View>

      {errorMessage && (
        <Text style={[styles.errorMessage, { color: theme.colors.error }]}>
          {errorMessage}
        </Text>
      )}

      {files.length > 0 && (
        <View>
          <Text style={[styles.fileListHeader, { color: theme.colors.mainText }]}>
            Files to be uploaded
          </Text>
          {files.map((file, index) => (
            <View key={index} style={styles.fileRow}>
              <Text style={[styles.fileName, { color: theme.colors.mainText}]}>
                {file.name}
              </Text>
              <IconButton
                icon="close"
                onPress={() => onRemove(file)}
                iconColor={theme.colors.error}
              />
            </View>
          ))}
        </View>
      )}

      <ButtonInput
        styles={styles.saveButton}
        text="Save"
        type="button"
        loading={loading}
        disabled={files.length === 0}
        onPress={saveFormMedia}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    alignItems: 'center',
  },
  header: {
    fontWeight: '600',
    marginBottom: 20,
    fontSize: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontWeight: '700',
    fontSize: 14,
  },
  infoText: {
    fontSize: 12,
    marginTop: 10,
  },
  errorMessage: {
    marginTop: 10,
    fontSize: 12,
  },
  fileListHeader: {
    fontWeight: '700',
    marginBottom: 10,
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 5,
  },
  fileName: {
    fontSize: 14,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default DropZoneInput;