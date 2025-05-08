import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useFormContext } from 'react-hook-form';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import { EventContext } from '../../context/EventContext';
import { deleteMediaAction } from '@/src/actions/createevent';
import { log } from 'console';
import toast from 'react-hot-toast';

interface DropZoneInputProps {
  name: string;
  label?: string;
  FileSize?: number;
  MaxFiles?: number;
  filesAccepted?: { [key: string]: string[] };
  onChange?: (files: File[]) => void;
  close?: () => void;
  InitialFiles?: Array<{ id: string; data: string }>;
}

interface CustomFile extends File {
  mediaId?: string; // Optional mediaId
}

const EventFileDropZone: React.FC<DropZoneInputProps> = ({
  name,
  label = 'Upload Files',
  FileSize = 10,
  MaxFiles = 3,
  filesAccepted = { 'image/*': [], 'video/*': [], 'audio/*': [] },
  InitialFiles = [],
  onChange,
  close,
}) => {
  const { setValue, watch, getValues } = useFormContext();
  const { setCreateEvent, setEventActionType, eventId, setEventId, eventActionType } = useContext(EventContext);
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isLoaded = useRef(false);
  const theme = useTheme();

  const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
  const MAX_VIDEO_SIZE = 10 * 1024 * 1024;
  const MAX_AUDIO_SIZE = 10 * 1024 * 1024;

  const getMimeTypeFromPrefix = (base64: string) => {
    if (base64.startsWith('/9j/')) {
      return 'image/jpeg';
    } else if (base64.startsWith('iVBORw0KGgo')) {
      return 'image/png';
    } else if (base64.startsWith('SUQz')) {
      return 'audio/mp3';
    } else if (base64.startsWith('AAAAIGZ0eXB')) {
      return 'video/mp4';
    }
    return '';
  };

  const convertBase64ToFile = (base64String: string, id: string) => {
    const mimeType = getMimeTypeFromPrefix(base64String);
    if (!mimeType) {
      console.error('Unsupported file type');
      return null;
    }

    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: mimeType });
    const fileName = `${id}.${mimeType.split('/')[1]}`;
  

    const file = new File([blob], fileName, { type: mimeType });
    Object.defineProperty(file, 'mediaId', {
      value: id,
      writable: false,
      enumerable: true,
      configurable: false
    });

    return file;
  };

  const isInitialized = useRef(false);

  const loadInitialFiles = useCallback(() => {
    if (!isInitialized.current) {
      const existingFiles = getValues(name) || [];
      const newFiles: File[] = [];

      InitialFiles.forEach(({ id, data }) => {
        const file = convertBase64ToFile(data, id);
        if (file && !existingFiles.some((f: File) => f.name === file.name)) {
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
    const subscription = watch((value, { name: fieldName }) => {
      if (fieldName === name) {
        const currentFiles = value[name];
        if (Array.isArray(currentFiles)) {
          setFiles(currentFiles);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, name]);

  useEffect(() => {
    const initialFiles = getValues(name);
    if (Array.isArray(initialFiles)) {
      setFiles(initialFiles);
    }
  }, [getValues, name]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setErrorMessage(null);

      const validFiles = acceptedFiles.filter((file) => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');

        if (isImage && file.size <= MAX_IMAGE_SIZE) return true;
        if (isVideo && file.size <= MAX_VIDEO_SIZE) return true;
        if (isAudio && file.size <= MAX_AUDIO_SIZE) return true;

        toast.error(`File ${file.name} exceeds the size limit.`);
        return false;
      });

      if (files.length + validFiles.length > MaxFiles) {
        toast.error(`You can upload up to ${MaxFiles} files only.`);
        return;
      }

      const updatedFiles = [...files, ...validFiles];
  
      setFiles(updatedFiles);
      setValue(name, updatedFiles);
      if (onChange) onChange(updatedFiles);
    },
    [files, setValue, name, onChange, MaxFiles]
  );

  const handleRemoveFile = async (fileToRemove: File) => {
    const updatedFiles = files.filter(
      (file) => file.name !== fileToRemove.name
    );
    setFiles(updatedFiles);
    setValue(name, updatedFiles);

    const customFile = fileToRemove as CustomFile; //to resolve ts error of mediaId for file type
    

    if (customFile.mediaId) {
      console.log(customFile.mediaId);
      try {
        await deleteMediaAction(customFile.mediaId);
        console.log('Media deleted successfully from server.');
      } catch (error) {
        console.error('Error deleting media from server:', error);
      }
    }
  
    if (onChange) onChange(updatedFiles);
  };



  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // maxSize: MAX_VIDEO_SIZE,
    accept: filesAccepted,
  });

  return (
    <Box>
      <Typography variant="text12" className="form-section-title">
        Media Upload
      </Typography>
      <br />
      <Typography variant="text6">Add up to 3 media files only</Typography>
      <Box
        sx={{
          maxWidth: '98%',
          margin: 'auto',
          textAlign: 'center',
          padding: '20px',
          border: '2px dashed var(--tw-bg-light-main)',
          borderRadius: '8px',
          marginTop: '1%',
        }}
      >
        <div {...getRootProps()} style={{ cursor: 'pointer' }}>
          <input {...getInputProps()} />
          <br />
          <img src="/images/dropzoneInput_lg.png" style={{ margin: 'auto' }} />
          <br />
          {isDragActive ? (
            <Typography
              variant="text6"
              sx={{ color: 'var(--tw-bg-light-main)' }}
            >
              Drop your files here...
            </Typography>
          ) : (
            <Typography variant="text6" fontWeight={400}>
              Drag your file(s) or{' '}
              <span style={{ color: '#1F64FF', fontWeight: '600' }}>
                browse
              </span>
            </Typography>
          )}
          <br />
          <Typography
            variant="text6"
            fontWeight={400}
            sx={{ color: 'var(--tw-text-light-smallText)' }}
          >
            Max {FileSize} MB per file is allowed
          </Typography>
        </div>

        {errorMessage && (
          <Typography color="error" sx={{ marginTop: '10px' }}>
            {errorMessage}
          </Typography>
        )}
      </Box>

      <Typography
        variant="text6"
        fontWeight={400}
        sx={{ marginTop: '2%', color: 'var(--tw-text-light-smallText)' }}
      >
        Only support mp3, mp4, jpg, png
      </Typography>

      {files.length > 0 && (
        <Box
          sx={{
            marginTop: '20px',
            padding: '10px 0',
            borderTop: '1px solid #ccc',
          }}
        >
          {files.map((file, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginBottom: '10px',
                backgroundColor: 'transparent',
              }}
            >
              <Box display="flex" alignItems="center">
                {file.type.startsWith('audio/') ? (
                  <AudioFileIcon
                    color="primary"
                    sx={{ fontSize: '50px', marginRight: '10px' }}
                  />
                ) : file.type.startsWith('video/') ? (
                  <VideoFileIcon
                    color="primary"
                    sx={{ fontSize: '50px', marginRight: '10px' }}
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    style={{
                      width: '50px',
                      height: '50px',
                      marginRight: '10px',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <Box>
                  <Typography variant="text5">{`EventID: ${eventId} - media ${index + 1}`}</Typography>
                  <br />
                  <Typography
                    variant="text5"
                    fontWeight={400}
                    sx={{ color: 'var(--tw-text-light-smallText)' }}
                  >
                    {(file.size / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
              </Box>

              <IconButton onClick={() => handleRemoveFile(file)}>
                <CancelIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EventFileDropZone;