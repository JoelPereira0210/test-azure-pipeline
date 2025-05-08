import React, { forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, useTheme } from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import { styled } from '@mui/material/styles';

const ReactQuill: any = dynamic(() => import('react-quill'), { ssr: false });

type Props = {
    label: string;
    required?: boolean;
    errorMessage?: string;
    value: string;
    readOnly?:boolean;
    onChange: (value: string) => void;
} & React.ComponentPropsWithoutRef<'div'>;

// Styled wrapper for the text editor
const EditorWrapper = styled('div')<{ mode: 'light' | 'dark' }>(({ mode }) => ({
    borderRadius: '8px',
    border: '1px solid rgba(70, 95, 241, 0.40)',
    boxShadow: '0px 4px 8px 0px rgba(70, 95, 241, 0.10)',
    marginTop: '8px',
    '& .ql-container': {
        border: 'none',
        borderRadius: '8px',
        height: '120px',
    },
    '& .ql-toolbar': {
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        background: mode === 'light' ? 'transparent' : 'transparent',
        borderColor: 'rgba(70, 95, 241, 0.4)',
    },
}));

const TextEditor = forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { label, required, readOnly, errorMessage, value, onChange, ...inputProps } = props;

    // Use the theme hook to access the current mode (light or dark)
    const theme = useTheme();
    const mode = theme.palette.mode;

    const handleChange = (content: string) => {
        // ReactQuill sometimes returns "<p><br></p>" for an empty editor, normalize it to an empty string
        if (content === '<p><br></p>' || content.trim() === '') {
            onChange('');
        } else {
            onChange(content);
        }
    };

    return (
        <Box sx={{ marginBottom: '27px' }}>
            <label>
                <Typography variant="text8" fontWeight={600}>
                    {label} {required && <span style={{ color: 'red' }}>*</span>}
                </Typography>
            </label>
            {/* Wrapper for the editor with styling */}
            <EditorWrapper mode={mode} aria-readonly={readOnly}>
                <ReactQuill
                    theme="snow"  // Directly pass `theme` to ReactQuill here
                    value={value}  // Quill editor will reflect the current value
                    onChange={handleChange}  // Quill will notify the form of changes and normalize empty values
                    readOnly={readOnly}
                    {...inputProps} // Make sure these are valid props for ReactQuill
                />
            </EditorWrapper>
            {errorMessage && (
                <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
                     {errorMessage}
                </Typography>
            )}
        </Box>
    );
});

TextEditor.displayName = 'TextEditor';

export default TextEditor;
