import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ButtonInput from '../Button/Button';
import { useFormContext } from 'react-hook-form';
// interface FileError {
//   code: string;
//   message: string;
// }

// interface FileInfo {
//   path: string;
//   name: string;
//   size: number
// }

// interface ErrorResponse {
//   file: FileInfo;
//   errors: FileError[];
// }
const DropZoneInput = ({
  close,
  media,
  onChange,
  FileSize,
  MaxFiles,
  filesAccepted,
}) => {
  const { setValue, watch, getValues } = useFormContext();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const MAX_FILE_SIZE = FileSize ? FileSize * 1024 * 1024 : 2 * 1024 * 1024; // 2MB
  console.log('MAX_FILE_SIZE', MAX_FILE_SIZE);
  const MAX_FILE_COUNT = MaxFiles ? MaxFiles : 1;
  const defaultAcceptTypes = {
    'image/*': [], // Accept all image types
    'audio/*': [], // Accept all audio types
    'video/*': [], // Accept all video types
  };
  const logo = watch('logo');
  console.log('media', media);

  useEffect(() => {
    console.log('sss', getValues('logo'));
    if (Array.isArray(logo)) {
      setFiles(logo);
    } else if (logo) {
      setFiles([logo]);
    } else if (media.length > 0) {
      setFiles(media);
    }
  }, [logo]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setErrorMessage(null); // Reset error message

      // Filter out files that exceed the size limit
      const validFiles = acceptedFiles.filter((file) => {
        return file.size <= MAX_FILE_SIZE;
      });

      // Notify the user if any files were rejected due to size
      if (validFiles.length < acceptedFiles.length) {
        alert(
          `Some files were rejected because they exceeded the size limit of ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB.`
        );
      }

      // Check if the total number of files exceeds the allowed limit
      if (files.length + validFiles.length > MAX_FILE_COUNT) {
        alert(`You can only upload up to ${MAX_FILE_COUNT} files.`);
        return; // Discard all files if the limit is exceeded
      }

      // Filter out duplicates
      const newFiles = validFiles.filter(
        (file) => !files.some((f) => f.name === file.name)
      );

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
    [files, MAX_FILE_SIZE, MAX_FILE_COUNT]
  );

  const onDropRejected = (fileRejections: FileRejection[]) => {
    console.log('rejectedFiles', fileRejections);
    fileRejections.forEach((rejection) => {
      const { file, errors } = rejection;
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(
          `File ${file.name} exceeds the size limit of ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB.`
        );
      } else if (errors.length > 0) {
        setErrorMessage(errors[0].message); // Access the first error message
      }
    });
  };

  const onRemove = async (fileToRemove: File) => {
    await setFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileToRemove.name)
    );
    // await setValue('logo', files);
  };

  const saveFormImages = () => {
    setLoading(true);
    console.log('FILE', files);
    setValue('logo', files);
    onChange(files);
    if (close) close();
    setLoading(false);
    // Close the modal
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxSize: MAX_FILE_SIZE, // Enforce the file size limit on drop
    accept: filesAccepted ? filesAccepted : defaultAcceptTypes,
  });

  return (
    <Box
      className="flex flex-col items-center justify-center"
      sx={{
        marginBottom: '27px',
        marginTop: '32px',
        maxWidth: '487px',
        color: `${
          theme.palette.mode === 'light'
            ? 'var(--tw-text-light-mainText)'
            : 'var(--tw-text-dark-mainText)'
        }`,
        background: `${
          theme.palette.mode === 'light'
            ? 'var(--tw-bg-light-background)'
            : 'var(--tw-bg-dark-background)'
        }`,
      }}
    >
      <Typography
        variant="h4"
        fontWeight={600}
        className="!mb-[20px]"
        sx={{
          marginBottom: '27px',
          color: `${
            theme.palette.mode === 'light'
              ? 'var(--tw-text-light-mainText)'
              : 'var(--tw-text-dark-mainText)'
          }`,
        }}
      >
        Upload
      </Typography>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p
            className="upload_container"
            // style={{
            //   color: `${
            //     theme.palette.mode === 'light'
            //       ? 'var(--tw-text-light-mainText)'
            //       : 'var(--tw-text-dark-mainText)'
            //   }`,
            //   background: `${
            //     theme.palette.mode === 'light'
            //       ? 'var(--tw-bg-light-background)'
            //       : 'var(--tw-bg-dark-background)'
            //   }`,
            //   border: `${
            //     theme.palette.mode === 'light'
            //       ? '1.076px rgba(39, 116, 207, 0.3) dashed'
            //       : '1.076px dashed rgba(55, 86, 122, 0.30)'
            //   }`,
            // }}
            style={{
              border: '1px solid white',
            }}
          >
            <Box
              width="100%"
              height="100%"
              className="flex flex-col justify-center items-center"
              sx={{
                color: `${
                  theme.palette.mode === 'light'
                    ? 'var(--tw-text-light-mainText)'
                    : 'var(--tw-text-dark-mainText)'
                }`,
                background: `${
                  theme.palette.mode === 'light'
                    ? 'var(--tw-bg-light-background)'
                    : 'var(--tw-bg-dark-background)'
                }`,
                border: `${
                  theme.palette.mode === 'light'
                    ? '1px solid black'
                    : '1.076px white'
                }`,
              }}
            >
              <div className="cloud-image !mb-6"></div>
              <Typography variant="text8" fontWeight={700}>
                Drop the files here
              </Typography>
            </Box>
          </p>
        ) : (
          <p className="upload_container">
            <Box
              width="100%"
              height="100%"
              className="flex flex-col justify-center items-center"
            >
              <div className="cloud-image !mb-6"></div>
              <Typography variant="text8" fontWeight={700}>
                Drag & drop files or{' '}
                <span style={{ textDecoration: 'underline', color: '#4c95eb' }}>
                  Browse
                </span>
              </Typography>
              <Typography variant="text5" color="#676767">
                Max {FileSize} MB files are allowed
              </Typography>
              <Typography
                variant="text5"
                color="#676767"
                sx={{ marginTop: '15px' }}
              >
                PNG format only
              </Typography>
            </Box>
          </p>
        )}
      </div>
      {errorMessage && (
        <Box marginTop={2}>
          <Typography
            className=" !text-light-redText"
            color={'rgba(228, 29, 29, 1)'}
          >
            {errorMessage}
          </Typography>
        </Box>
      )}

      {files.length > 0 && (
        <Box mt={2} className="flex flex-col justify-between gap-4 w-full">
          <Box
            sx={{
              height: `${isMobile ? 'fit-content' : '250px'}`,
              overflowY: 'auto',
            }}
          >
            <Box mt={1} mb={1} sx={{ overflowY: 'auto' }}>
              <Typography variant="text8" fontWeight={700}>
                Files to be uploaded
              </Typography>
            </Box>
            {files.map((file, index) => (
              <Box
                key={index}
                position="relative"
                sx={{
                  border: '1px solid #e3e3e3',
                  height: '39px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '4.305px',
                  paddingLeft: '10px',
                  marginBottom: '8px',
                }}
              >
                <Typography variant="body2">{file.name}</Typography>
                <IconButton
                  onClick={() => onRemove(file)}
                  style={{ color: '#E6E6E6' }}
                >
                  <CancelIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      <ButtonInput
        styles={{ marginTop: '20px' }}
        text="Save"
        type="button"
        loading={loading}
        disabled={!(media.length === 0 || files.length === 0)}
        onClick={saveFormImages}
      />
    </Box>
  );
};

export default DropZoneInput;
