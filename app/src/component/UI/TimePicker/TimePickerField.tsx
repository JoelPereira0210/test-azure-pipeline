// import React, { useState, forwardRef } from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import { TextInput, HelperText } from 'react-native-paper';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useTheme } from '../../../../theme/themeProvider'; // Your custom theme hook

// type Props = {
//   label: string;
//   required?: boolean;
//   error?: string;
//   value: string | undefined;
//   minTime?: string; // Expected format: 'HH:mm'
//   onChange: (newValue: string) => void;
//   disabled?: boolean;
//   style?: any;
// } & React.ComponentPropsWithoutRef<any>;

// const TimePickerField = forwardRef<any, Props>((props, ref) => {
//   const { label, required, error, value, onChange, minTime, disabled, style } = props;
//   const [showPicker, setShowPicker] = useState(false);
//   const { theme } = useTheme(); // Access your theme object
//   const [focused, setFocused] = useState(false); // Track focus state
//   // Convert a "HH:mm" string to a Date object (today’s date with that time)
//   const parseTime = (time: string) => {
//     const [hours, minutes] = time.split(':').map(Number);
//     const now = new Date();
//     now.setHours(hours, minutes, 0, 0);
//     return now;
//   };

//   // When the native picker returns a new time, format it as "HH:mm AM/PM"
//   const handleTimeChange = (event: any, selectedTime?: Date) => {
//     setShowPicker(false);
//     // Check if user pressed "set" and a valid date was selected
//     if (event.type === 'set' && selectedTime) {
//       const formattedTime = selectedTime.toLocaleTimeString([], {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       });
//       onChange(formattedTime);
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }, style]}>
//       <Text style={[styles.label, { color: theme.colors.mainText }]}>
//         {label} {required && <Text style={{ color: 'red' }}>*</Text>}
//       </Text>
//       <View style={styles.inputContainer}>
//         <TextInput
//           mode="outlined"
//           ref={ref}
//           value={value}
//           placeholder="Select time"
//           placeholderTextColor={'gray'}
//           editable={!disabled}
//           onPressIn={() => !disabled && setShowPicker(true)}
//           textColor={theme.colors.mainText}
//           outlineStyle={{
//             borderColor: focused ? '#A7C7FF':'#1F64FF66',
//             borderWidth: 1,
//             borderRadius: 9  // Add this line to change border radius
//           }}
//           style={[
//             styles.input,
//             {
//               backgroundColor: theme.colors.background, // Set background to black
//               color: theme.colors.mainText, // Set text color to white
//               borderWidth:0
//               // borderColor: focused ? '#A7C7FF':'#1F64FF66'
//             },
//           ]}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           right={
//             <TextInput.Icon
//               icon="clock-outline"
//               color={disabled ? theme.colors.disabled : 'gray'}
//               onPress={() => !disabled && setShowPicker(true)}
//             />
//           }
//         />
//       </View>
//       {showPicker && (
//         <DateTimePicker
//           value={value ? parseTime(value) : new Date()}
//           mode="time"
//           is24Hour={false}
//           display="default"
//           onChange={handleTimeChange}
//           // If a minimum time is provided, set it as the minimum value (converted to Date)
//           minimumDate={minTime ? parseTime(minTime) : undefined}
//         />
//       )}
//       {error && (
//         <HelperText type="error" style={{ color: theme.colors.error }}>
//           {error}
//         </HelperText>
//       )}
//     </View>
//   );
// });

// TimePickerField.displayName = 'TimePickerField';

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 20,
//     // padding: 12,
//     borderRadius: 8,
//     width: '100%',
//   },
//   inputContainer: {
//     width: '100%',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   input: {
//     height: 50,
//     borderRadius: 9,
//     fontSize: 16,
//   },
// });

// export default TimePickerField;


import React, { useState, forwardRef } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { useTheme } from '../../../../theme/themeProvider';

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  value: string | undefined;
  // minTime is provided as 'HH:mm' but DateTimePicker doesn’t support it natively.
  minTime?: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
  style?: any;
} & React.ComponentPropsWithoutRef<any>;

const TimePickerField = forwardRef<any, Props>((props, ref) => {
  const { label, required, error, value, onChange, minTime, disabled, style } = props;
  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  // Convert a "HH:mm" string to a Date object using today’s date
  const parseTime = (timeStr: string) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const now = new Date();
    now.setHours(hour, minute, 0, 0);
    return now;
  };

  // When the picker returns a new time, format it as "HH:mm"
  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedTime) {
      const formattedTime = dayjs(selectedTime).format('HH:mm');
      onChange(formattedTime);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: theme.colors.mainText }]}>
        {label} {required && <Text style={{ color: theme.colors.error }}>*</Text>}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          ref={ref}
          value={value}
          placeholder="Select time"
          placeholderTextColor="gray"
          editable={!disabled}
          onPressIn={() => !disabled && setShowPicker(true)}
          textColor={theme.colors.mainText}
          outlineStyle={{
            borderColor: focused ? '#A7C7FF':'#1F64FF66',
            borderWidth: 1,
            borderRadius: 9  // Add this line to change border radius
          }}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.background, // Set background to black
              color: theme.colors.mainText, // Set text color to white
              borderWidth:0
              // borderColor: focused ? '#A7C7FF':'#1F64FF66'
            },
          ]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          right={
            <TextInput.Icon
              icon="clock-outline"
              color={disabled ? theme.colors.disabled : theme.colors.primary}
              onPress={() => !disabled && setShowPicker(true)}
            />
          }
        />
      </View>
      {showPicker && (
        <DateTimePicker
          value={value ? parseTime(value) : new Date()}
          mode="time"
          is24Hour={true} // Ensures 24-hour mode so the format remains "HH:mm"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          // Note: DateTimePicker doesn't directly support minTime.
          // You can add extra logic if needed.
        />
      )}
         {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
});

TimePickerField.displayName = 'TimePickerField';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 8,
    width: '100%',
  },
  inputContainer: {
    width: '100%',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderRadius: 9,
    fontSize: 16,
    borderWidth: 0,
  },
});

export default TimePickerField;
