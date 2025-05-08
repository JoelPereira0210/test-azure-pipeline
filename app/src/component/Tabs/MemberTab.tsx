// Tabs.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../../theme/themeProvider'; // Adjust path as needed
import { MemberContext } from '../context/MemberContext';

const Tabs = () => {
  const {
    viewMembersForm,
    setViewmembersForm,
    MemberActionType,
    setMemberActionType,
    contextUserId,
    setContextUserId,
    step,
    setStep,
  } = useContext(MemberContext);

  const { theme } = useTheme();
  const isMobile = Dimensions.get('window').width < 600;

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, (step === 1 || step === 4) && styles.activeTab]}
          onPress={() => setStep(1)}
          disabled={step === 4} // Disable clicking when in edit mode (step 4)
        >
          <Text style={[styles.tabText, { color: theme.colors.mainText }]}>
            Personal Information
          </Text>
        </TouchableOpacity>
        {step !== 4 && (
          <>
            <TouchableOpacity
              style={[styles.tab, step === 2 && styles.activeTab]}
              onPress={() => setStep(2)}
            >
              <Text style={[styles.tabText, { color: theme.colors.mainText }]}>
                Registered Event
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, step === 3 && styles.activeTab]}
              onPress={() => setStep(3)}
            >
              <Text style={[styles.tabText, { color: theme.colors.mainText }]}>
                Maintenance Fees
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2', // You can replace this with theme.colors.primary if available
  },
  tabText: {
    fontSize: 14,
  },
});

export default Tabs;
