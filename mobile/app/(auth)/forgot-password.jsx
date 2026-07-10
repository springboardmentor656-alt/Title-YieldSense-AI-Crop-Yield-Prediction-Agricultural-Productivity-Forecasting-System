import { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { Mail } from "lucide-react-native";

import ScreenContainer from "../../src/components/common/ScreenContainer";
import AuthCard from "../../src/components/auth/AuthCard";
import AppInput from "../../src/components/common/AppInput";
import AppButton from "../../src/components/common/AppButton";

import { authService } from "../../src/services/authService";
import { colors } from "../../src/constants/colors";
import { commonStyles } from "../../src/styles/commonStyles";
import { isValidEmail } from "../../src/utils/validation";
import { getErrorMessage } from "../../src/utils/errorMessage";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      Alert.alert(
        "Invalid email",
        "Enter a valid registered email address."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await authService.forgotPassword(normalizedEmail);

      Alert.alert(
        "Reset token generated",
        result.reset_token
          ? `Development reset token: ${result.reset_token}`
          : "A reset token has been generated for your account.",
        [
          {
            text: "Continue",
            onPress: () =>
              router.push({
                pathname: "/(auth)/reset-password",
                params: {
                  email: normalizedEmail,
                  reset_token: result.reset_token ?? "",
                },
              }),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Request failed",
        getErrorMessage(error, "Unable to generate a reset token.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer contentStyle={commonStyles.authScreen}>
      <AuthCard
        title="Forgot Password"
        subtitle="Enter your registered email to generate a password reset token."
      >
        <View style={commonStyles.form}>
          <AppInput
            label="Registered email"
            placeholder="farmer@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
          />

          <AppButton
            title="Generate Reset Token"
            onPress={handleForgotPassword}
            loading={loading}
          />

          <View style={commonStyles.centeredRow}>
            <Text style={commonStyles.helperText}>
              Remember your password?{" "}
            </Text>

            <Link href="/(auth)/login" asChild>
              <Pressable hitSlop={10}>
                <Text style={commonStyles.linkText}>Back to login</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </AuthCard>
    </ScreenContainer>
  );
}