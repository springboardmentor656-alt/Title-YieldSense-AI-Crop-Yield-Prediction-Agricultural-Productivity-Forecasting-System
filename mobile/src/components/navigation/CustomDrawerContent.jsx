import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import {
  Leaf,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react-native";

import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../constants/colors";
import { getErrorMessage } from "../../utils/errorMessage";

export default function CustomDrawerContent(props) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();

              props.navigation.closeDrawer();
              router.replace("/(auth)/login");
            } catch (error) {
              Alert.alert(
                "Logout failed",
                getErrorMessage(
                  error,
                  "Unable to log out."
                )
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Brand */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Leaf size={27} color={colors.surface} />
          </View>

          <View style={styles.brandText}>
            <Text style={styles.brandName}>
              YieldSense AI
            </Text>

            <Text style={styles.brandSubtitle}>
              Agricultural Intelligence
            </Text>
          </View>
        </View>

        {/* User summary */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <UserRound
              size={26}
              color={colors.primary}
            />
          </View>

          <View style={styles.userDetails}>
            <Text
              style={styles.userName}
              numberOfLines={1}
            >
              {user?.full_name || "YieldSense User"}
            </Text>

            <Text
              style={styles.userEmail}
              numberOfLines={1}
            >
              {user?.email || ""}
            </Text>

            <View style={styles.roleRow}>
              <ShieldCheck
                size={14}
                color={colors.primary}
              />

              <Text style={styles.roleText}>
                {user?.role || "User"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.menuLabel}>
          MENU
        </Text>

        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Logout */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
        >
          <LogOut
            size={21}
            color={colors.danger}
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  scrollContent: {
    paddingTop: 0,
  },

  brandSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 22,
  },

  logoContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.primary,
  },

  brandText: {
    flex: 1,
    marginLeft: 13,
  },

  brandName: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.surface,
  },

  brandSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: "#BBF7D0",
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    padding: 14,
  },

  avatar: {
    width: 47,
    height: 47,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.surface,
  },

  userDetails: {
    flex: 1,
    marginLeft: 12,
  },

  userName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },

  userEmail: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textSecondary,
  },

  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 4,
  },

  roleText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
    color: colors.primaryDark,
  },

  menuLabel: {
    marginHorizontal: 22,
    marginTop: 25,
    marginBottom: 7,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    color: colors.textSecondary,
  },

  drawerItems: {
    paddingHorizontal: 5,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 16,
  },

  logoutButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 13,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 16,
  },

  logoutText: {
    marginLeft: 13,
    fontSize: 15,
    fontWeight: "800",
    color: colors.danger,
  },

  pressed: {
    opacity: 0.72,
  },
});