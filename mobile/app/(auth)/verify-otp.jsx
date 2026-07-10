import { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { KeyRound, Mail } from "lucide-react-native";

import ScreenContainer from "../../src/components/common/ScreenContainer";
import AuthCard from "../../src/components/auth/AuthCard";
import AppInput from "../../src/components/common/AppInput";
import AppButton from "../../src/components/common/AppButton";

import { authService } from "../../src/services/authService";
import { colors } from "../../src/constants/colors";
import { commonStyles } from "../../src/styles/commonStyles";
import { isValidEmail } from "../../src/utils/validation";
import { getErrorMessage } from "../../src/utils/errorMessage";

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams();

  const initialEmail =
    typeof params.email === "string" ? params.email : "";

  const [form, setForm] = useState({
    email: initialEmail,
    otp_code: "",
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleVerifyOtp = async () => {
    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedOtp = form.otp_code.trim();

    if (!isValidEmail(normalizedEmail)) {
      Alert.alert("Invalid email", "Enter a valid email address.");
      return;
    }

    if (!/^\d{6}$/.test(normalizedOtp)) {
      Alert.alert("Invalid OTP", "Enter the six-digit OTP code.");
      return;
    }

    try {
      setLoading(true);

      await authService.verifyOtp({
        email: normalizedEmail,
        otp_code: normalizedOtp,
      });

      Alert.alert(
        "Email verified",
        "Your account is verified successfully.",
        [
          {
            text: "Continue to Login",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Verification failed",
        getErrorMessage(error, "Unable to verify this OTP.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer contentStyle={commonStyles.authScreen}>
      <AuthCard
        title="Enter Verification Code"
        subtitle="Use the six-digit OTP generated for your registered email."
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
            label="OTP code"
            placeholder="Enter six-digit OTP"
            value={form.otp_code}
            onChangeText={(value) =>
              updateField("otp_code", value.replace(/\D/g, ""))
            }
            keyboardType="number-pad"
            maxLength={6}
            leftIcon={<KeyRound size={20} color={colors.textSecondary} />}
          />

          <AppButton
            title="Verify Email"
            onPress={handleVerifyOtp}
            loading={loading}
          />

          <View style={commonStyles.centeredRow}>
            <Text style={commonStyles.helperText}>
              Didn't receive the code?{" "}
            </Text>

            <Link
              href={{
                pathname: "/(auth)/send-otp",
                params: {
                  email: form.email.trim(),
                },
              }}
              asChild
            >
              <Pressable hitSlop={10}>
                <Text style={commonStyles.linkText}>Send again</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </AuthCard>
    </ScreenContainer>
  );
}