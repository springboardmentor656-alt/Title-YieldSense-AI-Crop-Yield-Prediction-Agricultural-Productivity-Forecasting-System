import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import {
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react-native";

import ScreenContainer from "../../src/components/common/ScreenContainer";
import AuthCard from "../../src/components/auth/AuthCard";
import AppInput from "../../src/components/common/AppInput";
import AppButton from "../../src/components/common/AppButton";

import { authService } from "../../src/services/authService";
import { colors } from "../../src/constants/colors";
import { commonStyles } from "../../src/styles/commonStyles";
import { validateRegistration } from "../../src/utils/validation";
import { getErrorMessage } from "../../src/utils/errorMessage";

const roles = [
  {
    label: "Farmer",
    value: "farmer",
  },
  {
    label: "Admin",
    value: "admin",
  },
];

export default function RegisterScreen() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "farmer",
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    const validationError = validateRegistration(form);

    if (validationError) {
      Alert.alert("Check your details", validationError);
      return;
    }

    try {
      setLoading(true);

      await authService.register({
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        password: form.password,
        role: form.role,
      });

      router.push({
        pathname: "/(auth)/send-otp",
        params: {
          email: form.email.trim().toLowerCase(),
        },
      });
    } catch (error) {
      Alert.alert(
        "Registration failed",
        getErrorMessage(error, "Unable to create your account.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer contentStyle={styles.screenContent}>
      <AuthCard
        title="Create Account"
        subtitle="Create your YieldSense AI account and verify your email."
      >
        <View style={commonStyles.form}>
          <AppInput
            label="Full name"
            placeholder="Enter your full name"
            value={form.full_name}
            onChangeText={(value) => updateField("full_name", value)}
            autoCapitalize="words"
            autoComplete="name"
            leftIcon={<UserRound size={20} color={colors.textSecondary} />}
          />

          <AppInput
            label="Email address"
            placeholder="farmer@example.com"
            value={form.email}
            onChangeText={(value) => updateField("email", value)}
            keyboardType="email-address"
            autoComplete="email"
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
          />

          <AppInput
            label="Phone number"
            placeholder="Enter phone number"
            value={form.phone}
            onChangeText={(value) => updateField("phone", value)}
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={15}
            leftIcon={<Phone size={20} color={colors.textSecondary} />}
          />

          <AppInput
            label="Password"
            placeholder="Minimum 8 characters"
            value={form.password}
            onChangeText={(value) => updateField("password", value)}
            secureTextEntry
            autoComplete="new-password"
            leftIcon={
              <LockKeyhole size={20} color={colors.textSecondary} />
            }
          />

          <View>
            <Text style={styles.roleLabel}>Account role</Text>

            <View style={styles.roleRow}>
              {roles.map((role) => {
                const selected = form.role === role.value;

                return (
                  <Pressable
                    key={role.value}
                    onPress={() => updateField("role", role.value)}
                    style={[
                      styles.roleOption,
                      selected && styles.selectedRoleOption,
                    ]}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        selected && styles.selectedRadioOuter,
                      ]}
                    >
                      {selected ? <View style={styles.radioInner} /> : null}
                    </View>

                    <Text
                      style={[
                        styles.roleText,
                        selected && styles.selectedRoleText,
                      ]}
                    >
                      {role.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <AppButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
          />

          <View style={commonStyles.centeredRow}>
            <Text style={commonStyles.helperText}>
              Already have an account?{" "}
            </Text>

            <Link href="/(auth)/login" asChild>
              <Pressable hitSlop={10}>
                <Text style={commonStyles.linkText}>Login</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </AuthCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 30,
  },

  roleLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  roleRow: {
    flexDirection: "row",
    gap: 12,
  },

  roleOption: {
    flex: 1,
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },

  selectedRoleOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedRadioOuter: {
    borderColor: colors.primary,
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  roleText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  selectedRoleText: {
    color: colors.primaryDark,
  },
});