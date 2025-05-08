import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { useTheme } from '../../../theme/themeProvider';

type Society = {
  societyId: string;
  societyName: string;
};

type Props = {
  societies: Society[];
  onSelect: (society: Society) => void;
  visible: boolean;
  onDismiss: () => void;
};

const SocietySelectionModal: React.FC<Props> = ({ societies, onSelect, visible, onDismiss }) => {
  console.log("Modal Visibility:", visible); // Debugging
  console.log("Got Societies in Modal:", societies.length > 0 ? societies[0].societyName : "No societies");
const {theme} = useTheme();
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modalContainer,{backgroundColor:theme.colors.background}]}>
        <Text style={[styles.title,{color:theme.colors.mainText}]}>Select Your Society</Text>
        {societies.length > 0 ? (
          societies.map((society) => (
            <Button
              key={society.societyId}
              mode="outlined"
              buttonColor={theme.colors.background}
              textColor={theme.colors.main}
              onPress={() => onSelect(society)}
              style={[styles.societyButton]}
              contentStyle={styles.buttonContent}
            >
              {society.societyName}
            </Button>
          ))
        ) : (
          <Text>No societies available.</Text>
        )}
        {/* <Button mode="contained" onPress={onDismiss} style={styles.closeButton}

           buttonColor={theme.colors.background}
           textColor={theme.colors.main}
        >
          Close
        </Button> */}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    // backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    zIndex: 1000, // Ensure it's on top
    position: 'absolute',
    alignSelf: 'center',
    width: '90%',
    maxHeight: Dimensions.get('window').height * 0.8, // Max height is 80% of the screen height
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  societyButton: {
    marginVertical: 8,
  },
  buttonContent: {
    height: 50,
  },
  closeButton: {
    marginTop: 16,
  },
});

export default SocietySelectionModal;
