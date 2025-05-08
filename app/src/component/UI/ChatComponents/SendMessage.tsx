import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decryptValue } from '../../../utils/encryptiondecryption';
import FileUpload from '../FileUpload/FileUpload';
import { useTheme } from '../../../../theme/themeProvider';
type Props = {
  socket: any; // Adjust type if you have a specific Socket type
  disabled: boolean;
  refreshChats: () => void;  // New callback prop
};

const SendMessage: React.FC<Props> = ({ socket, disabled,refreshChats }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isLargeScreen = width >= 768;

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any>(null);
  const [mediaErrors, setMediaErrors] = useState<string | null>(null);
  const [societyId, setSocietyId] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const getSocietyId = async () => {
      try {
        const storedSocietyId = await AsyncStorage.getItem('societyId');
        if (!storedSocietyId) throw new Error('Society ID not found in AsyncStorage.');
        const decryptedSocietyId = decryptValue(storedSocietyId);
        if (!decryptedSocietyId) throw new Error('Decrypted Society ID is null or invalid.');
        setSocietyId(await decryptedSocietyId);
      } catch (error) {
        console.error('Error decrypting societyId:', error);
        setMediaErrors('Failed to retrieve Society ID. Please try again.');
      }
    };
    getSocietyId();
  }, []);

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async (data: any) => {
    if (!societyId) {
      setMediaErrors('Society ID is missing. Cannot send message.');
      return;
    }
    if (!data.message || !data.message.trim()) {
      setMediaErrors('Message cannot be empty or just spaces.');
      return;
    }
    setMediaErrors(null);
    data.societyId = societyId;
    console.log('DATA', data);
    socket.emit('sendMessage', data);
    // socket.emit('sendMessage', data, (response: any) => {
      // Optionally check response, then refresh chats
      // if (response && response.success) {
        refreshChats();
      // }
    // });
    
    reset({ message: '' });
  };

  return (
    <View
      style={[
        styles.formContainer,
        { width: isMobile ? '100%' : '90%', paddingHorizontal: !isLargeScreen && !isMobile ? 20 : 0 },
      ]}
    >
      <View style={styles.inputRow}>
        <Controller
          name="message"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.textInput, disabled && styles.disabledInput]}
              placeholder={
                disabled
                  ? 'Activate Your membership to enable chat'
                  : 'Send Your Message...'
              }
              placeholderTextColor={theme.colors.smallText}
              multiline
              editable={!disabled}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              numberOfLines={1}
            />
          )}
        />
        {!disabled && (
          <View style={styles.actionContainer}>
            <FileUpload setFiles={setFiles} setError={setMediaErrors} />
            <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.sendButton}>
              <Image
                source={require('../../../images/sendIcon.png')}
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {mediaErrors ? <Text style={styles.errorText}>{mediaErrors}</Text> : null}
    </View>
  );
};

export default SendMessage;

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 10,
    flexDirection: 'column',
  },
  inputRow: {
    flexDirection: 'row',
    maxHeight: 44,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButton: {
    marginLeft: 8,
  },
  sendIcon: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
});
