// import React from 'react';
// import { Dialog, Button, IconButton, Text, Paragraph } from 'react-native-paper';
// import { View, StyleSheet } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useTheme } from '../../../../theme/themeProvider'; // Corrected useTheme import

// interface ErrorAlertModalProps {
//   open: boolean;
//   onClose: () => void;
//   errorMessage: string;
// }

// const ErrorAlertModal: React.FC<ErrorAlertModalProps> = ({ open, onClose, errorMessage }) => {
//   const { theme } = useTheme(); // Access the theme from useTheme hook

//   return (
//     <Dialog visible={open} onDismiss={onClose} style={{ backgroundColor: theme.colors.background }}>
//       <Dialog.Title>
//         <View style={[styles.titleContainer, { backgroundColor: theme.colors.surface }]}>
//           <MaterialCommunityIcons
//             name="alert-circle"
//             size={30}
//             color={theme.colors.error}
//             style={styles.icon}
//           />
//           <Text style={[styles.titleText, theme.typography.text1]}>Error</Text>
//         </View>
//       </Dialog.Title>
//       <Dialog.Content>
//         <Paragraph style={theme.typography.text2}>{errorMessage}</Paragraph>
//       </Dialog.Content>
//       <Dialog.Actions>
//         <Button onPress={onClose} style={[styles.button, { backgroundColor: theme.colors.primary }]}>
//           Close
//         </Button>
//       </Dialog.Actions>
//     </Dialog>
//   );
// };

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 8,
//     borderRadius: 8,
//   },
//   icon: {
//     marginRight: 8,
//   },
//   titleText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   button: {
//     marginRight: 8,
//   },
// });

// export default ErrorAlertModal;

import React from 'react';
import { Dialog, Button, Text, Paragraph } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../../theme/themeProvider';

interface ErrorAlertModalProps {
  open: boolean;
  onClose: () => void;
  errorMessage: string;
}

const ErrorAlertModal: React.FC<ErrorAlertModalProps> = ({ open, onClose, errorMessage }) => {
  const { theme } = useTheme(); // Access the theme from your theme provider

  return (
    <Dialog
      visible={open}
      onDismiss={onClose}
      style={[
        styles.dialogStyle,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* Custom Title Layout */}
      <View style={styles.titleContainer}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={30}
          color={theme.colors.error}
          style={styles.icon}
        />
        <Text style={[styles.titleText, theme.typography.text10]}>
          Error
        </Text>
      </View>

      <Dialog.Content>
        <Paragraph style={theme.typography.text2}>
          {errorMessage}
        </Paragraph>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          onPress={onClose}
          style={styles.button}
          labelStyle={{ color: theme.colors.mainText }} // Override text color if desired
          // color={theme.colors.primary}
        >
          Close
          
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialogStyle: {
    borderRadius: 8, // Slight rounding of the dialog corners
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginRight: 8,
  },
});

export default ErrorAlertModal;
