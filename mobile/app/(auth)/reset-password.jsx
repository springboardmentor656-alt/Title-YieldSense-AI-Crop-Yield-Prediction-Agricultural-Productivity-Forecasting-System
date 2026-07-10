import { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  KeyRound,
  LockKeyhole,
  Mail,
} from "lucide-react-native";

import ScreenContainer from "../../src/components/common/ScreenContainer";
import AuthCard from "../../src/components/auth/AuthCard";
import AppInput from "../../src/components/common/AppInput";
import AppButton from "../../src/components/common/AppButton";

import { authService } from "../../src/services/authService";
import { colors } from "../../src/constants/colors";
import { commonStyles } from "../../src/styles/commonStyles";
import {
  isValidEmail,
  isValidPassword,
} from "../../src/utils/validation";
import { getErrorMessage } from "../../src/utils/errorMessage";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();

  const initialEmail =
    typeof params.email === "string" ? params.email : "";

  const initialResetToken =
    typeof params.reset_token === "string"
      ? params.reset_token
      : "";

  const [form, setForm] = useState({
    email: initialEmail,
    reset_token: initialResetToken,
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleResetPassword = async () => {
    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedToken = form.reset_token.trim();

    if (!isValidEmail(normalizedEmail)) {
      Alert.alert("Invalid email", "Enter a valid email address.");
      return;
    }

    if (!normalizedToken) {
      Alert.alert("Missing token", "Enter the password reset token.");
      return;
    }

    if (!isValidPassword(form.new_password)) {
      Alert.alert(
        "Weak password",
        "The new password must contain at least eight characters."
      );
      return;
    }

    if (form.new_password !== form.confirm_password) {
      Alert.alert(
        "Passwords do not match",
        "New password and confirmation must be identical."
      );
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword({
        email: normalizedEmail,
        reset_token: normalizedToken,
        new_password: form.new_password,
      });

      Alert.alert(
        "Password updated",
        "Your password has been reset successfully.",
        [
          {
            text: "Login",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Reset failed",
        getErrorMessage(error, "Unable to reset your password.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer contentStyle={commonStyles.authScreen}>
      <AuthCard
        title="Create New Password"
        subtitle="Enter your reset token and choose a secure new password."
      >
        <View style={commonStyles.form}>
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
            label="Reset token"
            placeholder="Enter reset token"
            value={form.reset_token}
            onChangeText={(value) => updateField("reset_token", value)}
            autoCapitalize="none"
            leftIcon={<KeyRound size={20} color={colors.textSecondary} />}
          />

          <AppInput
            label="New password"
            placeholder="Minimum 8 characters"
            value={form.new_password}
            onChangeText={(value) => updateField("new_password", value)}
            secureTextEntry
            autoComplete="new-password"
            leftIcon={
              <LockKeyhole size={20} color={colors.textSecondary} />
            }
          />

          <AppInput
            label="Confirm new password"
            placeholder="Re-enter new password"
            value={form.confirm_password}
            onChangeText={(value) =>
              updateField("confirm_password", value)
            }
            secureTextEntry
            autoComplete="new-password"
            leftIcon={
              <LockKeyhole size={20} color={colors.textSecondary} />
            }
          />

          <AppButton
            title="Reset Password"
            onPress={handleResetPassword}
            loading={loading}
          />

          <View style={commonStyles.centeredRow}>
            <Link href="/(auth)/login" asChild>
              <Pressable hitSlop={10}>
                <Text style={commonStyles.linkText}>
                  Return to login
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </AuthCard>
    </ScreenContainer>
  );
}