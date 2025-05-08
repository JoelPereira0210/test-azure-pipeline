import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Dialog, Portal, Text, Divider, Avatar, List } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../../theme/themeProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ButtonInput from "../UI/Button/Button";
import SocietySelectionProfileModal from "./SocietySelectionProfileModal";
import { checkSocietySuperAdmin } from "../../actions/profile";
import { setSocietyIdInLocalStorage } from "../../utils/auth";

type Society = {
  societyId: string;
  societyName: string;
};

interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  firstName: string;
  lastName: string;
  userId?: string;
  adminPrivileges?: boolean;
  profilePicture?: string;
  societies: Society[];
  navigation?: any;
}
const SimpleDialog: React.FC<SimpleDialogProps> = ({
  open,
  onClose,
  firstName,
  lastName,
  userId,
  adminPrivileges,
  profilePicture,
  societies,
  navigation,
}) => {
//  const navigation = useNavigation();r
  const {theme}= useTheme();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdminAccess, setIsSuperAdminAccess] = useState<boolean | null>(true);
  const [showSocietyModal, setShowSocietyModal] = useState(false);

  const [menuItems, setMenuItems] = useState<{ label: string; icon: string; onPress: () => void }[]>([]);

  console.log("admin priv", adminPrivileges);

useEffect(() => {
  const checkAdminStatus = async () => {
    const role = await AsyncStorage.getItem("flow");
    console.log("Role in checkAdminStatus:", role);
    console.log("adminPrivileges in checkAdminStatus:", adminPrivileges);
    
    setIsAdmin(role === "admin");
    const updatedMenuItems = [
      ...(role === "admin" && adminPrivileges //  Ensure only admins see "Switch To User Profile"
        ? [{
            label: "Switch To User Profile",
            icon: "account-switch-outline",
            onPress: () => handleListItemClick("Switch To User Profile"),
          }]
        : role !== "admin" && adminPrivileges //  Ensure only admins can see "Switch To Admin Profile"
        ? [{
            label: "Switch To Admin Profile",
            icon: "account-switch-outline",
            onPress: () => handleListItemClick("Switch To Admin Profile"),
          }]
        : []
      ),
      ...(societies.length > 1
        ? [{
            label: "Switch Society",
            icon: "home-city",
            onPress: () => handleListItemClick("Switch Society"),
          }]
        : []
      ),
      {
        label: "Upgrade Plan",
        icon: "arrow-up-bold-circle",
        onPress: () => handleListItemClick("Upgrade Plan"),
      },
      {
        label: "Sign Out",
        icon: "logout",
        onPress: () => handleListItemClick("Sign Out"),
      }
    ];

    setMenuItems(updatedMenuItems); 
  };

  checkAdminStatus();
}, []);


  useEffect(() => {
    const checkAccess = async () => {
      if (!userId) return;
      const isSuperAdmin = await checkSocietySuperAdmin(userId);
      setIsSuperAdminAccess(isSuperAdmin);
    };
    if (userId) {
      checkAccess();
    }
  }, [userId]);

  const handleListItemClick = async (value: string) => {
    if (value === "Switch To User Profile") {
      await AsyncStorage.setItem("flow", "adminuser");
      navigation.reset({ index: 0, routes: [{ name: "AuthNavigator" }] });
    } else if (value === "Switch To Admin Profile") {
      await AsyncStorage.setItem("flow", "admin");
      navigation.reset({ index: 0, routes: [{ name: "AuthNavigator" }] });
    }
     else if (value === "Upgrade Plan") {

      navigation.navigate("UnauthNavigator", { screen: "Subscriptions" });
    } else if (value === "Sign Out") {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("societyId");
      await AsyncStorage.removeItem("isSuperAdmin");
      await AsyncStorage.removeItem("flow");
      onClose("closed");
      setShowSocietyModal(false);
       navigation.navigate("UnauthNavigator", { screen: "Signup" });
    } else if (value === "Switch Society") {
      setShowSocietyModal(true);
    }
  };

  const handleSocietySelection = async (society: Society) => {
    if (society) {
      console.log("alis", society);
      const success = await setSocietyIdInLocalStorage(society);
      const token = await AsyncStorage.getItem("authToken");

      if (success) {
        navigation.navigate("AuthNavigator", {
          screen:  "Members",
        });
        // Reload the entire application
        setTimeout(() => {
          if (token) {          
            navigation.reset({ index: 0, routes: [{ name: "AuthNavigator" }] });
          }
        }, 500); // Small delay to ensure navigation happens first
      }
    }
  };

  const truncateName = (name:string, maxLength:number) => {
    if (name.length > maxLength) {
      return `${name.slice(0, maxLength - 1)}.`; // Truncate and add a pointer
    }
    return name;
  };

  return (
    <Portal>
      <Dialog visible={open} onDismiss={() => onClose("closed")} style={[styles.dialog,{backgroundColor:theme.colors.background}]}> 
        <Dialog.Content>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Avatar.Image
              size={50}
              source={profilePicture ? { uri: profilePicture } : require("../../images/avatar-placeholder.png")}
            />
            <Text style={[styles.profileName,{color:theme.colors.mainText}]}>{`${truncateName(firstName, 9)} ${truncateName(lastName, 9)}`}</Text>
          </View>

          <Divider style={[styles.divider,{backgroundColor:theme.colors.smallText}]} />

      

<ScrollView>
  {menuItems.map((item, index) => (
    <List.Item
      key={index}
      title={item.label}
      titleStyle={{ color: theme.colors.mainText }}
      style={{ backgroundColor: theme.colors.background }}
      left={() => <Icon name={item.icon} size={22} color={theme.colors.mainText} />}
      onPress={item.onPress}
    />
  ))}
</ScrollView>


        </Dialog.Content>
      </Dialog>

      {/* Society Selection Modal */}
      {showSocietyModal && (
        <SocietySelectionProfileModal
          open={showSocietyModal}
          societies={societies}
          onSelect={handleSocietySelection}
          onClose={() => setShowSocietyModal(false)}
        />
      )}
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    width: "65%",
    borderRadius: 10,
    padding: "1%",

    position: "absolute",
    top: 10, // Position below the profile icon
    right: 10, // Align to the right like the UI design

    elevation: 5,
  },
  dialogTitle: {
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  profileName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 10,
  },
});

export default SimpleDialog;
