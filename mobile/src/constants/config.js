const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  console.warn(
    "EXPO_PUBLIC_API_BASE_URL is missing. Add it to the mobile .env file."
  );
}

export const config = {
  apiBaseUrl,
};