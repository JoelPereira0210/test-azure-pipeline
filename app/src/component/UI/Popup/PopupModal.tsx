import React from 'react';
import { Dialog, Button, Portal } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../theme/themeProvider'; // Corrected useTheme import

interface PopupModalProps {
  children: React.ReactElement;
  trigger: React.ReactNode; // This is a button or other trigger element to open the modal
  mode: 'light' | 'dark'; // Manually pass mode to theme
}

const PopupModal: React.FC<PopupModalProps> = ({ children, trigger, mode }) => {
  // Get the theme based on the mode passed as a prop
  const { theme } = useTheme(); // Corrected to access theme correctly
  const [visible, setVisible] = React.useState(false);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  // Content style using the current theme
  const contentStyle = {
    backgroundColor: theme.colors.background, // Use theme's background color
    borderColor: theme.colors.text, // Use theme's text color for border
    borderRadius: 10, // Example border-radius
  };

  return (
    <View>
      {/* Trigger button to open the modal */}
      {React.cloneElement(trigger as React.ReactElement, { onPress: openModal })}

      {/* Modal Dialog */}
      <Portal>
        <Dialog visible={visible} onDismiss={closeModal} style={contentStyle}>
          <Dialog.Title style={[{ color: theme.colors.text }, theme.typography.text1]}>
            Modal Title
          </Dialog.Title>
          <Dialog.Content>
            {React.cloneElement(children, { close: closeModal })}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeModal} color={theme.colors.primary} style={theme.typography.text2}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default PopupModal;