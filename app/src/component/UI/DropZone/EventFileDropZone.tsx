import React, {
    useCallback,
    useEffect,
    useState,
    useRef,
    useContext,
  } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
  } from 'react-native';
  import { useFormContext } from 'react-hook-form';
  import { useTheme } from '../../../../theme/themeProvider';
  import { EventContext } from '../../context/EventContext';
  // Using @react-native-documents/picker and RNFS:
  import { pick, keepLocalCopy, types } from '@react-native-documents/picker';
  import RNFS from 'react-native-fs';
  // Import icon from react-native-vector-icons:
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import { deleteMediaAction } from '../../../actions/createevent';
  
  interface DropZoneInputProps {
    name: string;
    label?: string;
    FileSize?: number; // in MB, default 10
    MaxFiles?: number; // default 3
    filesAccepted?: { [key: string]: string[] };
    onChange?: (files: CustomFile[]) => void;
    close?: () => void;
    InitialFiles?: Array<{ id: string; data: string }>;
  }
  
  interface CustomFile {
    uri: string;
    name: string;
    type: string;
    size: number;
    mediaId?: string;
  }
  
  const EventFileDropZone: React.FC<DropZoneInputProps> = ({
    name,
    label = 'Upload Files',
    FileSize = 10,
    MaxFiles = 3,
    filesAccepted = { 'image/*': [], 'video/*': [], 'audio/*': [] },
    InitialFiles = [],
    onChange,
  }) => {
    const { setValue, watch, getValues } = useFormContext();
    const { } = useContext(EventContext);
    const [files, setFiles] = useState<CustomFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const isInitialized = useRef(false);
    const {theme} = useTheme();
  
    const MAX_SIZE = FileSize * 1024 * 1024; // MB converted to bytes
  
    // Convert a base64 string to a CustomFile object.
    // Note: In React Native, the file size is not easily determined from base64.
    const convertBase64ToFile = (base64String: string, id: string): CustomFile | null => {
      let mimeType = '';
      if (base64String.startsWith('/9j/')) {
        mimeType = 'image/jpeg';
      } else if (base64String.startsWith('iVBORw0KGgo')) {
        mimeType = 'image/png';
      } else if (base64String.startsWith('SUQz')) {
        mimeType = 'audio/mp3';
      } else if (base64String.startsWith('AAAAIGZ0eXB')) {
        mimeType = 'video/mp4';
      }
      if (!mimeType) {
        console.error('Unsupported file type');
        return null;
      }
      // Create a data URI from the base64 string.
      const uri = `data:${mimeType};base64,${base64String}`;
      return {
        uri,
        name: `${id}.${mimeType.split('/')[1]}`,
        type: mimeType,
        size: 0,
        mediaId: id,
      };
    };
  
    // Load initial files (if any) passed as base64 strings.
    const loadInitialFiles = useCallback(() => {
      if (!isInitialized.current) {
        const existingFiles: CustomFile[] = getValues(name) || [];
        const newFiles: CustomFile[] = [];
        InitialFiles.forEach(({ id, data }) => {
          const file = convertBase64ToFile(data, id);
          if (file && !existingFiles.some((f) => f.name === file.name)) {
            newFiles.push(file);
          }
        });
        if (newFiles.length > 0) {
          const updatedFiles = [...existingFiles, ...newFiles];
          setFiles(updatedFiles);
          setValue(name, updatedFiles);
          if (onChange) onChange(updatedFiles);
        } else {
          setFiles(existingFiles);
        }
        isInitialized.current = true;
      }
    }, [InitialFiles, getValues, setValue, name, onChange]);
  
    useEffect(() => {
      loadInitialFiles();
    }, [loadInitialFiles]);
  
    useEffect(() => {
      const initialFiles = getValues(name);
      if (Array.isArray(initialFiles)) {
        setFiles(initialFiles);
      }
    }, [getValues, name]);
  
    // Use @react-native-documents/picker to select files.
    const pickFiles = async () => {
      try {
        const results = await pick({
          types: [types.images, types.video, types.audio],
          allowMultiSelection: true,
        });
        // Optionally, you can call keepLocalCopy if you need a local path.
        // For now, we simply call onDrop with the results.
        onDrop(results);
      } catch (err: any) {
        if (err.code === 'DOCUMENT_PICKER_CANCELED') {
          // User cancelled
        } else {
          console.error(err);
        }
      }
    };
  
    // Handle picked files.
    const onDrop = useCallback(
      async (selectedFiles: any[]) => {
        setErrorMessage(null);
        const validFiles: CustomFile[] = [];
        for (const file of selectedFiles) {
          const { uri, name, size, type } = file;
          const isImage = type?.startsWith('image/');
          const isVideo = type?.startsWith('video/');
          const isAudio = type?.startsWith('audio/');
          if ((isImage || isVideo || isAudio) && size && size <= MAX_SIZE) {
            validFiles.push({ uri, name, type: type!, size });
          } else {
            Alert.alert('File Error', `File ${name} exceeds the size limit.`);
          }
        }
        if (files.length + validFiles.length > MaxFiles) {
          Alert.alert('File Limit', `You can upload up to ${MaxFiles} files only.`);
          return;
        }
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        setValue(name, updatedFiles);
        if (onChange) onChange(updatedFiles);
      },
      [files, setValue, name, onChange, MaxFiles, MAX_SIZE]
    );
  
    const handleRemoveFile = async (fileToRemove: CustomFile) => {
      const updatedFiles = files.filter((file) => file.name !== fileToRemove.name);
      setFiles(updatedFiles);
      setValue(name, updatedFiles);
      if (fileToRemove.mediaId) {
        try {
          await deleteMediaAction(fileToRemove.mediaId);
          console.log('Media deleted successfully from server.');
        } catch (error) {
          console.error('Error deleting media from server:', error);
        }
      }
      if (onChange) onChange(updatedFiles);
    };
  
    return (
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: theme.colors.mainText }]}>
          {label}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.mainText }]}>
          Add up to {MaxFiles} media files only
        </Text>
        <TouchableOpacity style={styles.dropzone} onPress={pickFiles}>
          <Image
            source={require('../../../images/dropzoneInput_lg.png')}
            style={styles.dropzoneImage}
            resizeMode="contain"
          />
          <Text style={[styles.dropzoneText, { color: theme.colors.smallText }]}>
            {files.length ? 'Tap to add more files' : 'Tap to select file(s)'}
          </Text>
          <Text style={[styles.dropzoneHint, { color: theme.colors.smallText }]}>
            Max {FileSize} MB per file is allowed
          </Text>
        </TouchableOpacity>
        {errorMessage && (
          <Text style={[styles.errorText, { color: 'red' }]}>{errorMessage}</Text>
        )}
        {files.length > 0 && (
          <View style={styles.previewContainer}>
            {files.map((file, index) => (
              <View key={index} style={styles.fileRow}>
                <View style={styles.fileInfo}>
                  {file.type.startsWith('audio/') ? (
                    <Icon
                      name="audiotrack"
                      size={50}
                      color={theme.colors.primary}
                      style={styles.fileIcon}
                    />
                  ) : file.type.startsWith('video/') ? (
                    <Icon
                      name="videocam"
                      size={50}
                      color={theme.colors.primary}
                      style={styles.fileIcon}
                    />
                  ) : (
                    <Image source={{ uri: file.uri }} style={styles.fileImage} />
                  )}
                  <View style={styles.fileTextContainer}>
                    <Text style={styles.fileName}>{`Media ${index + 1}`}</Text>
                    <Text style={styles.fileSize}>
                      {(file.size / 1024).toFixed(2)} KB
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleRemoveFile(file)}>
                  <Icon name="cancel" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <Text style={[styles.supportText, { color: theme.colors.smallText }]}>
          Only supports mp3, mp4, jpg, png
        </Text>
      </View>
    );
  };
  
  export default EventFileDropZone;
  
  const styles = StyleSheet.create({
    container: {
      marginVertical: 10,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 10,
    },
    dropzone: {
      maxWidth: '98%',
      alignSelf: 'center',
      padding: 20,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: '#1976d2',
      borderRadius: 8,
      marginTop: '1%',
      alignItems: 'center',
    },
    dropzoneImage: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    dropzoneText: {
      fontSize: 14,
      fontWeight: '400',
    },
    dropzoneHint: {
      fontSize: 12,
      marginTop: 4,
    },
    errorText: {
      marginTop: 10,
      fontSize: 14,
      textAlign: 'center',
    },
    previewContainer: {
      marginTop: 20,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    },
    fileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 10,
      backgroundColor: 'transparent',
    },
    fileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fileIcon: {
      marginRight: 10,
    },
    fileImage: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 5,
      resizeMode: 'cover',
    },
    fileTextContainer: {
      flex: 1,
    },
    fileName: {
      fontSize: 14,
    },
    fileSize: {
      fontSize: 12,
      color: '#666',
    },
    supportText: {
      fontSize: 12,
      textAlign: 'center',
      marginTop: 10,
    },
  });
  