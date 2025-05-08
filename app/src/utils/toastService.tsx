import Toast, { BaseToast } from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: 'black',
        borderLeftColor: '#3FC28A',
        width: '80%', // Set a fixed width
        alignSelf: 'center',
        minHeight: 40, // Reduce height
        borderRadius: 8, // Rounded edges
        paddingVertical: 5, // Adjust padding for better alignment
      }}
      contentContainerStyle={{
        flexDirection: 'row',
        alignItems: 'center', // Ensure vertical centering
        justifyContent: 'center', // Align left
        paddingHorizontal: 10,
      }}
      text1Style={{
        color: 'white',
        fontSize: 14, // Reduce font size for better balance
        fontWeight: 'bold',
        textAlignVertical: 'center', // Ensures text is vertically aligned
      }}
      renderLeadingIcon={() => (
        <MaterialIcons
          name="check-circle"
          size={24} // Adjust icon size
          color="#3FC28A"
          style={{ marginRight: 8,marginLeft:'5%', alignSelf: 'center' }} // Ensure proper positioning
        />
      )}
    />
  ),

  error: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: 'black',
        borderLeftColor: '#E41D1D',
        width: '80%',
        alignSelf: 'center',
        minHeight: 40,
        borderRadius: 8,
        paddingVertical: 5,
      }}
      contentContainerStyle={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
      }}
      text1Style={{
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlignVertical: 'center',
      }}
      renderLeadingIcon={() => (
        <MaterialIcons
          name="cancel"
          size={24}
          color="#E41D1D"
          style={{ marginRight: 8,marginLeft:'5%', alignSelf: 'center' }}
        />
      )}
    />
  ),
};

// Helper function to show the toast
export const showToast = (message: string, type: 'success' | 'error') => {
  Toast.show({
    type,
    text1: message,
    position: 'top',
    visibilityTime: 5000,
    autoHide: true,
    topOffset: 50,
  });
};
