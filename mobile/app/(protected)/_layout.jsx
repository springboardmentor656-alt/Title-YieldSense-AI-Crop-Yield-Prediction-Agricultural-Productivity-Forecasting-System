import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
  CloudSun,
  Database,
  Home,
  Sprout,
  UserRound,
} from "lucide-react-native";

import LoadingScreen from "../../src/components/common/LoadingScreen";
import CustomDrawerContent from "../../src/components/navigation/CustomDrawerContent";
import { useAuth } from "../../src/hooks/useAuth";
import { colors } from "../../src/constants/colors";

export default function ProtectedLayout() {
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) {
    return (
      <LoadingScreen message="Loading account..." />
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: true,

        headerStyle: {
          backgroundColor: colors.surface,
        },

        headerShadowVisible: false,
        headerTintColor: colors.primaryDark,

        headerTitleStyle: {
          fontWeight: "800",
        },

        drawerActiveBackgroundColor:
          colors.primaryLight,

        drawerActiveTintColor:
          colors.primaryDark,

        drawerInactiveTintColor:
          colors.textSecondary,

        drawerLabelStyle: {
          marginLeft: -18,
          fontSize: 15,
          fontWeight: "700",
        },

        drawerItemStyle: {
          borderRadius: 12,
          marginHorizontal: 8,
          marginVertical: 3,
        },

        drawerStyle: {
          width: 290,
          backgroundColor: colors.surface,
        },

        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          drawerLabel: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="historical-yield"
        options={{
          title: "Historical Yield",
          drawerLabel: "Historical Yield",
          drawerIcon: ({ color, size }) => (
            <Database size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="soil-data"
        options={{
          title: "Soil Data",
          drawerLabel: "Soil Data",
          drawerIcon: ({ color, size }) => (
            <Sprout size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="weather-data"
        options={{
          title: "Weather Data",
          drawerLabel: "Weather Data",
          drawerIcon: ({ color, size }) => (
            <CloudSun size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile & Security",
          drawerLabel: "Profile & Security",
          drawerIcon: ({ color, size }) => (
            <UserRound size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}