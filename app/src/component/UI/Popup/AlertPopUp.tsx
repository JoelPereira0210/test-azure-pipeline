// import React from 'react';
// import { Dialog, Button, Text } from 'react-native-paper';
// import { StyleSheet } from 'react-native';
// import { useTheme } from '../../../../theme/themeProvider'; // Corrected themeProvider hook import

// interface AlertModalProps {
//   open: boolean;
//   onClose: () => void;
//   title: string;
//   note?: string;
//   buttonText: string;
// }

// const AlertModal: React.FC<AlertModalProps> = ({ open, onClose, title, note, buttonText }) => {
//   const { theme } = useTheme(); // Access the theme from the useTheme hook

//   return (
//     <Dialog visible={open} onDismiss={onClose} style={[styles.modal, { backgroundColor: theme.colors.background }]}>
//       <Dialog.Title style={[styles.dialogTitle, theme.typography.text1]}>{title}</Dialog.Title>
//       {note && (
//         <Dialog.Content>
//           <Text style={[styles.dialogNote, theme.typography.text2]}>{note}</Text>
//         </Dialog.Content>
//       )}
//       <Dialog.Actions>
//         <Button mode="contained" onPress={onClose} style={[styles.button, { backgroundColor: theme.colors.primary }]}>
//           {buttonText}
//         </Button>
//       </Dialog.Actions>
//     </Dialog>
//   );
// };

// const styles = StyleSheet.create({
//   modal: {
//     width: '90%', // Makes modal responsive
//     alignSelf: 'center', // Center the modal
//     borderRadius: 8,
//     padding: 16,
//   },
//   dialogTitle: {
//     textAlign: 'center',
//   },
//   dialogNote: {
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   button: {
//     borderRadius: 4,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
// });

// export default AlertModal;
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dialog, Button, Text, Portal } from 'react-native-paper';
import { useTheme } from '../../../../theme/themeProvider';
import ButtonInput from '../Button/Button';

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  note?: string;
  buttonText: string;
  icon?: React.ReactNode;
}

const AlertModal: React.FC<AlertModalProps> = ({ open, onClose, title, note, buttonText,icon }) => {
  const { theme } = useTheme();

  return (
    <Portal>
      <Dialog
        visible={open}
        onDismiss={onClose}
        style={[styles.modal, { backgroundColor: theme.colors.background }]}
      >
        <Dialog.Title style={[styles.dialogTitle, theme.typography.text13]}>
          <View style={styles.titleContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[theme.typography.text13]}>{title}</Text>
          </View>
        </Dialog.Title>
        {note && (
          <Dialog.Content>
            <Text style={[styles.dialogNote, theme.typography.text12]}>
              {note}
            </Text>
          </Dialog.Content>
        )}
        <Dialog.Actions>
          <ButtonInput
            onPress={onClose}
            text={buttonText}
            type='button'
          />
          
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '90%', // Makes modal responsive
    alignSelf: 'center', // Center the modal
    borderRadius: 8,
    padding: 16,
  },
  dialogTitle: {
    textAlign: 'center',
  },
  dialogNote: {
    fontSize: 14,
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});

export default AlertModal;
