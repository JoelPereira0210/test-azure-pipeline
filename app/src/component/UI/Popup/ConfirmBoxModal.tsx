// import React from 'react';
// import { Dialog, Button, Text } from 'react-native-paper';
// import { View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
// import { useTheme } from '../../../../theme/themeProvider'; // Corrected themeProvider hook import

// // Extending the styles type to support custom properties like titleText
// interface CustomStyles {
//   modal?: ViewStyle;
//   title?: TextStyle;
//   titleText?: TextStyle;  // Custom property for title text
//   description?: TextStyle;
//   actions?: ViewStyle;
//   button?: ViewStyle;
// }

// interface ConfirmBoxModalProps {
//   open: boolean;
//   title: string;
//   description: string;
//   onAgree: () => void;
//   styles?: CustomStyles;  // Use CustomStyles instead of React.CSSProperties
//   onDisagree: () => void;
//   onClose: () => void;
//   agreeText?: string;
//   disagreeText?: string;
//   titleFontSize?: number; // Ensure it's a number for React Native
// }

// const ConfirmBoxModal: React.FC<ConfirmBoxModalProps> = ({
//   open,
//   title,
//   description,
//   onAgree,
//   styles,
//   onDisagree,
//   onClose,
//   agreeText = 'Agree',
//   disagreeText = 'Disagree',
//   titleFontSize,
// }) => {
//   const { theme } = useTheme(); // Access theme from the useTheme hook

//   return (
//     <Dialog visible={open} onDismiss={onClose} style={[styles?.modal, { backgroundColor: theme.colors.background }]}>
//       <Dialog.Title style={[styles?.title, { fontSize: titleFontSize || 16 }]}>
//         <Text style={[styles?.titleText, theme.typography.text1]}>{title}</Text>
//       </Dialog.Title>
//       <Dialog.Content>
//         <Text style={[styles?.description, theme.typography.text2]}>{description}</Text>
//       </Dialog.Content>
//       <Dialog.Actions style={styles?.actions}>
//         <Button mode="outlined" onPress={onDisagree} style={[styles?.button, { backgroundColor: theme.colors.surface }]}>
//           {disagreeText}
//         </Button>
//         <Button mode="contained" onPress={onAgree} style={[styles?.button, { backgroundColor: theme.colors.primary }]}>
//           {agreeText}
//         </Button>
//       </Dialog.Actions>
//     </Dialog>
//   );
// };

// const defaultStyles = StyleSheet.create({
//   modal: {
//     width: '80%',
//     maxWidth: 600,
//     alignSelf: 'center',
//     borderRadius: 8,
//     textAlign: 'center',
//   },
//   title: {
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   titleText: {
//     color: '#54595E', // Customize based on your theme
//   },
//   description: {
//     color: '#54595E', // Customize based on your theme
//     textAlign: 'center',
//     fontSize: 14,
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   button: {
//     marginHorizontal: 8,
//   },
// });

// export default ConfirmBoxModal;
import React from 'react';
import { Dialog, Button, Text, Portal } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../theme/themeProvider';

interface ConfirmBoxModalProps {
  open: boolean;
  title: string;
  description: string;
  onAgree: () => void;
  onDisagree: () => void;
  onClose: () => void;
  agreeText?: string;
  disagreeText?: string;
}

const ConfirmBoxModal: React.FC<ConfirmBoxModalProps> = ({
  open,
  title,
  description,
  onAgree,
  onDisagree,
  onClose,
  agreeText = 'Delete',
  disagreeText = 'Cancel',
}) => {
  const { theme } = useTheme();

  return (
    <Portal>
      <View style={styles.overlay}>
        <Dialog visible={open} onDismiss={onClose} style={styles.modal}>
          {/* Title */}
          <Dialog.Title style={styles.title}>{title}</Dialog.Title>

          {/* Description */}
          <Dialog.Content>
            <Text style={styles.description}>{description}</Text>
          </Dialog.Content>

          {/* Buttons */}
          <Dialog.Actions style={styles.actions}>
            <Button
              mode="outlined"
              onPress={onDisagree}
              style={styles.cancelButton}
              labelStyle={styles.cancelText}
            >
              {disagreeText}
            </Button>

            <Button
              mode="contained"
              onPress={onAgree}
              style={styles.deleteButton}
              labelStyle={styles.deleteText}
            >
              {agreeText}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    alignSelf: 'center',
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingBottom: 15,
    elevation: 5, // Adds slight shadow effect
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16151C',
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    color: '#8B8B8B',
    marginTop: -5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  cancelButton: {
    borderColor: '#16151C',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 6,
    minWidth: 120,
  },
  cancelText: {
    color: '#16151C',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#16151C',
    borderRadius: 8,
    paddingVertical: 6,
    minWidth: 120,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ConfirmBoxModal;
