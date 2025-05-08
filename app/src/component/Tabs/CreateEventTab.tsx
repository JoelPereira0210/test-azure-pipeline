// import React, { useContext } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
// import { useTheme } from '../../../theme/themeProvider';  // Assuming useTheme is defined in your theme provider
// import { EventContext } from '../context/EventContext'; // Assuming EventContext is defined in your context

// interface TabsProps {
//   step: number;
//   setStep: (step: number) => void;
// }

// const Tabs: React.FC<TabsProps> = ({ step, setStep }) => {
//   const { setCreateEvent, setEventActionType, eventId, setEventId, eventActionType } = useContext(EventContext);
//   const { theme } = useTheme();  // Assuming theme is accessible from useTheme hook
//   const { width } = useWindowDimensions();  // This will help with responsive layout

//   const isMobile = width < 600;  // Logic to determine if the screen size is small or mobile

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={[styles.title, { color: theme.colors.text1 }]}>{eventActionType}</Text>
//       </View>
//       <View style={styles.tabsContainer}>
//         {/* Details Tab */}
//         <TouchableOpacity
//           style={[styles.tab, step === 1 && styles.activeTab]}
//           onPress={() => setStep(1)} // Always allow access to step 1
//         >
//           <Text style={[styles.tabText, { color: theme.colors.text12 }]}>Details</Text>
//         </TouchableOpacity>

//         {/* Upload Tab */}
//         <TouchableOpacity
//           style={[styles.tab, step === 2 && styles.activeTab]}
//           onPress={() => setStep(2)} // Validation handled inside setStep
//         >
//           <Text style={[styles.tabText, { color: theme.colors.text12 }]}>Upload</Text>
//         </TouchableOpacity>

//         {/* Event Type Tab */}
//         <TouchableOpacity
//           style={[styles.tab, step === 3 && styles.activeTab]}
//           onPress={() => setStep(3)} // Validation handled inside setStep
//         >
//           <Text style={[styles.tabText, { color: theme.colors.text12 }]}>Event Type</Text>
//         </TouchableOpacity>

//         {/* Review Tab */}
//         <TouchableOpacity
//           style={[styles.tab, step === 4 && styles.activeTab]}
//           onPress={() => setStep(4)} // Validation handled inside setStep
//         >
//           <Text style={[styles.tabText, { color: theme.colors.text12 }]}>Review</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: '1%',
//     marginBottom: '1%',
//     marginLeft: '1%',
//   },
//   header: {
//     marginBottom: '1%',
//   },
//   title: {
//     fontSize: 16,
//     marginLeft: '4%',
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//   },
//   tab: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderBottomWidth: 2,
//     borderBottomColor: 'transparent',
//   },
//   activeTab: {
//     borderBottomColor: '#007AFF',
//   },
//   tabText: {
//     fontSize: 14,
//   },
// });

// export default Tabs;

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../../theme/themeProvider';
import { EventContext } from '../context/EventContext';

const Tabs = ({ step, setStep }:any) => {
  const { eventActionType } = useContext(EventContext);
  const { theme } = useTheme();
  // Consider mobile if the screen width is less than 600
  const isMobile = Dimensions.get('window').width < 600;

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { marginLeft: isMobile ? "4%" : "1%" }]}>
        <Text style={[styles.headerText, { color: theme.colors.mainText }]}>
          {eventActionType}
        </Text>
      </View>
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, step === 1 && styles.activeTab]}
          onPress={() => setStep(1)}
        >
          <Text style={[styles.tabText, { color: theme.colors.mainText }]}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, step === 2 && styles.activeTab]}
          onPress={() => setStep(2)}
        >
          <Text style={[styles.tabText, { color: theme.colors.mainText }]}>Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, step === 3 && styles.activeTab]}
          onPress={() => setStep(3)}
        >
          <Text style={[styles.tabText, { color: theme.colors.mainText }]}>Event Type</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, step === 4 && styles.activeTab]}
          onPress={() => setStep(4)}
        >
          <Text style={[styles.tabText, { color: theme.colors.mainText }]}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Optional container styles
  },
  headerContainer: {
    marginTop: '1%',
    marginBottom: '1%',
  },
  headerText: {
    fontSize: 16, // Adjust as needed to mimic variant "text1"
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2', // You can use theme.colors.primary if defined
  },
  tabText: {
    fontSize: 12, // Adjust to mimic variant "text12"
  },
});

export default Tabs;
