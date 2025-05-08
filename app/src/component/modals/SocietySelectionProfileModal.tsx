import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dialog, Portal, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decryptValue } from "../../utils/encryptiondecryption";
import ButtonInput from "../UI/Button/Button";
import { useTheme } from "../../../theme/themeProvider";
import { Dimensions } from "react-native";


type Society = {
  societyId: string;
  societyName: string;
};

interface SocietySelectionProfileModalProps {
  open: boolean;
  societies: Society[];
  onSelect: any;
  onClose: () => void;
}

const SocietySelectionProfileModal: React.FC<SocietySelectionProfileModalProps> = ({
  open,
  societies,
  onSelect,
  onClose,
}) => {
  const [currentSociety, setCurrentSociety] = useState<string | null>(null);
  const {theme} = useTheme();

  useEffect(() => {
    const fetchSocietyId = async () => {
      const storedSocietyId = await AsyncStorage.getItem("societyId");
      if (storedSocietyId) {
        const decryptedValue = await decryptValue(storedSocietyId);
        setCurrentSociety(decryptedValue);
      }
    };
    fetchSocietyId();
  }, []);

  console.log("Current Society:", currentSociety);

  return (
    <Portal>
      <Dialog visible={open} onDismiss={onClose} style={[styles.dialog, { backgroundColor: theme.colors.background }]}>
        <Dialog.Title>
         <Text style={[styles.dialogTitle, { color: theme.colors.mainText }]}>Select Your Society</Text>
        </Dialog.Title>
        <Dialog.Content>
          {societies.map((society) => (
            <ButtonInput
              key={society.societyId}
              text={society.societyName}
              onPress={() => {
                onSelect(society.societyId);
                onClose();
              }}
              buttonBackgroundColor={society.societyId === currentSociety ? theme.colors.main : theme.colors.background}
              buttonFontColor={society.societyId === currentSociety ? "#fff" : theme.colors.mainText}
              borderColor={theme.colors.main}
              width="100%"
              // height={50}
            />
          ))}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    // width: "80%",
    // alignSelf: "center",
    // borderRadius: 10,
    // padding: "1%",

    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    padding: "2%",
    maxHeight: Dimensions.get("window").height * 0.8, // Match modal size
  },
  dialogTitle: {
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
});

export default SocietySelectionProfileModal;
