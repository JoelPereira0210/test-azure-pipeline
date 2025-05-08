import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { useTheme } from '../../../../theme/themeProvider';

type Props = {
  label: string;
  required?: boolean;
  errorMessage?: string;
  value: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
};

const TextEditor = forwardRef<RichEditor, Props>((props, ref) => {
  const { label, required, errorMessage, value, readOnly, onChange, ...rest } = props;
  const { theme } = useTheme();

  // If using forwardRef, we can also keep a local ref to pass to RichToolbar.
  const editorRef = useRef<RichEditor | null>(null) as React.MutableRefObject<RichEditor | null>;

  const handleChange = (content: string) => {
    // Convert empty content to an empty string
    if (content === '<p><br></p>' || content.trim() === '') {
      onChange('');
    } else {
      onChange(content);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.mainText }]}>
        {label} {required && <Text style={{ color: 'red' }}>*</Text>}
      </Text>

{/* Toolbar Container */}
 {!readOnly && (
  <RichToolbar
    editor={editorRef}
    actions={[
      actions.setBold,
      actions.setItalic,
      actions.setUnderline,
      actions.insertLink,
      actions.setStrikethrough,
      actions.insertBulletsList,
      actions.insertOrderedList
  
    ]}
    style={[
      styles.toolbar, 
      { 
        backgroundColor: theme.colors.sidebar,
        borderWidth: 0,
        borderColor: '#1F64FF66',
        // borderRadius: 8,
  
      }
    ]}
    iconMap={{
      [actions.undo]: ({ tintColor }:any) => (
              <Text style={{ color: tintColor }}>↺</Text>
            ),
            [actions.redo]: ({ tintColor }:any) => (
              <Text style={{ color: tintColor }}>↻</Text>
            ),
          }}
        />
      )}

      {/* Editor Container */}
      <View style={[styles.editorWrapper, { borderColor: '#1F64FF66'}]}>
        <RichEditor
          ref={(r) => {
            if (r) {
              // Update the local ref
              editorRef.current = r;
              // Update the forwarded ref
              if (typeof ref === 'function') {
                ref(r);
              } else if (ref) {
                useImperativeHandle(ref, () => r);
              }
            }
          }}
            initialContentHTML={value}
            onChange={handleChange}
            disabled={readOnly}
            placeholder={label}
            editorStyle={{
            backgroundColor: 'transparent',
            cssText: `
              body {
                font-size: 16px;
                color: ${theme.colors.mainText};
              }
              ::placeholder {
                font-size: 16px;
              }
            `,
            placeholderColor: 'gray'
            }}
            style={styles.richEditor}
          {...rest}
        />
      </View>

     

      {/* Error Message */}
      {errorMessage && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorMessage}</Text>
      )}
    </View>
  );
});

TextEditor.displayName = 'TextEditor';

const styles = StyleSheet.create({
  container: {
    marginBottom: 27,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editorWrapper: {
    minHeight: 150,
    borderRadius: 8,
    borderWidth: 2,
    // elevation: 1,
    shadowColor: '#465FF1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  richEditor: {
    borderRadius: 8,
    // Add more styling as needed
  },
  toolbar: {
    marginTop: 5,
    // borderRadius: 8,
    // backgroundColor: '#f2f2f2',
    // Adjust height, padding, etc. to style the toolbar
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
  },
});

export default TextEditor;
