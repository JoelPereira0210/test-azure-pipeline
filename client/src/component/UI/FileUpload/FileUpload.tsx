import React, { useRef, useState } from 'react';
type Props = {
    setFiles: React.Dispatch<any>
    setError: React.Dispatch<React.SetStateAction<string>>
}
const FileUpload = ({ setError, setFiles }: Props) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    // const [error, setError] = useState<string | null>(null);

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        setError(null); // Reset error message

        if (files) {
            // Check number of files
            if (files.length > 3) {
                setError('You can upload a maximum of 3 files.');
                return;
            }

            let totalSize = 0;
            const allowedTypes = ['image/*', 'video/*', 'audio/*']; // Allow images, videos, and audio
            const invalidFiles: string[] = [];

            // Check file sizes and types
            for (let i = 0; i < files.length; i++) {
                totalSize += files[i].size;

                // Check for allowed types
                if (!allowedTypes.some((type) => files[i].type.match(type))) {
                    invalidFiles.push(files[i].name);
                }
            }

            // Check total size
            if (totalSize > 10 * 1024 * 1024) { // 10MB in bytes
                setError('Total file size cannot exceed 10MB.');
                return;
            }

            // If there are invalid files, set an error message
            if (invalidFiles.length > 0) {
                setError(`Invalid file types: ${invalidFiles.join(', ')}`);
                return;
            }

            console.log('Selected files:', Array.from(files));
            setFiles(Array.from(files))
            // Handle valid files (upload or preview)
        }
    };

    return (
        <div>
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }} // Hide the input
                multiple // Allow multiple file selections
                accept="image/*,video/*,audio/*" // Restrict file types
            />

            {/* Attachment Icon */}
            <img
                src="/images/attachmentIcon.png"
                width={24}
                height={24}

                alt="attachment"
                onClick={handleImageClick}
                style={{ cursor: 'pointer', minWidth: '24px' }} // Change cursor to pointer
            />

            {/* Error Message */}

        </div>
    );
};

export default FileUpload;
