/* import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
type Props = {
    selectedImage: string,
    setSelectedImage: React.Dispatch<React.SetStateAction<string>>
    setSelectedImageData: React.Dispatch<React.SetStateAction<any>>
}
const ProfileImageUpload = ({ selectedImage, setSelectedImage, setSelectedImageData }: Props) => {
    const [imageUrl, setImageUrl] = useState('')
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedImageData(event.target.files)
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageUrl(imageUrl);
            setSelectedImage('');
        }
    };

    return (
        <Box
            sx={{
                // position: 'relative',
                position: 'absolute',
                width: '123px',
                height: '94px',
                marginTop: '75px',
                textAlign: 'center',
            }}
        >
            {selectedImage ? (
                <img
                    // src={selectedImage}
                    src={`data:image/png;base64,${selectedImage}`}

                    alt="Profile"
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
            ) : (
                <>
                    {imageUrl ? (
                        <img
                            src={imageUrl}

                            alt="Profile"
                            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                        />
                    ) : (<AccountCircleIcon sx={{ width: '100%', height: '100%' }} />
                    )
                    }
                </>

            )
            }

            <input
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
                style={{
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    left: 0,
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                }}
            />
        </Box>
    );
};

export default ProfileImageUpload;
 */

import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

type Props = {
    selectedImage: string,
    setSelectedImage: React.Dispatch<React.SetStateAction<string>>
    setSelectedImageData: React.Dispatch<React.SetStateAction<any>>
}

const ProfileImageUpload = ({ selectedImage, setSelectedImage, setSelectedImageData }: Props) => {
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState(''); // State to store error message

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        // Reset error and selectedImageData
        setError('');
        setSelectedImageData(null);

        if (file) {
            // Check if the file size is greater than 5 MB
            const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
            if (file.size > maxSizeInBytes) {
                setError('Max image upload size is 5 MB');
                return;
            }

            setSelectedImageData(event.target.files);
            const imageUrl = URL.createObjectURL(file);
            setImageUrl(imageUrl);
            setSelectedImage('');
        }
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                width: '123px',
                height: '94px',
                marginTop: '75px',
                textAlign: 'center',
            }}
        >
            {selectedImage ? (
                <img
                    src={`data:image/png;base64,${selectedImage}`}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
            ) : (
                <>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                        />
                    ) : (
                        <AccountCircleIcon sx={{ width: '100%', height: '100%' }} />
                    )}
                </>
            )}

            <input
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
                style={{
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    left: 0,
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                }}
            />

            {/* Display error message */}
            {error && (
                <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>
                    {error}
                </p>
            )}
        </Box>
    );
};

export default ProfileImageUpload;