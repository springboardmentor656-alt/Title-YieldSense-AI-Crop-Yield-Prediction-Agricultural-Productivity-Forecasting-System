import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ArrowLeft,
  History,
  Sprout,
} from "lucide-react-native";
import {
  router,
  useFocusEffect,
} from "expo-router";

import RecommendationHistoryCard from "../../src/components/recommendation/RecommendationHistoryCard";
import { recommendationService } from "../../src/services/recommendationService";
import { colors } from "../../src/constants/colors";

function extractRecommendations(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.recommendations)) {
    return response.recommendations;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

export default function RecommendationHistoryScreen() {
  const [recommendations, setRecommendations] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const loadHistory = useCallback(
    async ({ showLoader = true } = {}) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        const response =
          await recommendationService.getRecommendationHistory();

        setRecommendations(
          extractRecommendations(response)
        );
      } catch (error) {
        const message =
          error.response?.data?.detail ||
          error.message ||
          "Unable to load recommendation history.";

        Alert.alert(
          "History Loading Failed",
          message
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleRefresh = () => {
    setRefreshing(true);

    loadHistory({
      showLoader: false,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primaryDark}
        />

        <Text style={styles.loadingText}>
          Loading recommendation history...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={recommendations}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          recommendations.length === 0 &&
            styles.emptyContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primaryDark}
            colors={[colors.primaryDark]}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <View style={styles.badge}>
              <History
                size={18}
                color={colors.primaryDark}
              />

              <Text style={styles.badgeText}>
                Recommendation Records
              </Text>
            </View>

            <Text style={styles.title}>
              Recommendation History
            </Text>

            <Text style={styles.description}>
              Review crops previously recommended for
              your farms and cultivation seasons.
            </Text>

            <Pressable
              style={styles.backButton}
              onPress={() =>
                router.replace(
                  "/(protected)/recommendation"
                )
              }
            >
              <ArrowLeft
                size={18}
                color={colors.primaryDark}
              />

              <Text style={styles.backButtonText}>
                New Recommendation
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <RecommendationHistoryCard
            recommendation={item}
            onPress={() =>
              router.push({
                pathname:
                  "/(protected)/recommendation-details",
                params: {
                  recommendationId: item.id,
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Sprout
                size={32}
                color={colors.primaryDark}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No recommendations yet
            </Text>

            <Text style={styles.emptyDescription}>
              Generate your first crop recommendation
              to begin building your history.
            </Text>

            <Pressable
              style={styles.generateButton}
              onPress={() =>
                router.replace(
                  "/(protected)/recommendation"
                )
              }
            >
              <Sprout size={19} color="#ffffff" />

              <Text style={styles.generateButtonText}>
                Generate Recommendation
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  emptyContent: {
    flexGrow: 1,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  headerCard: {
    marginBottom: 18,
    padding: 21,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
  },

  badgeText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryDark,
  },

  title: {
    marginTop: 18,
    fontSize: 27,
    fontWeight: "900",
    color: colors.textPrimary,
  },

  description: {
    marginTop: 9,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },

  backButton: {
    alignSelf: "flex-start",
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: 13,
    backgroundColor: colors.surface,
  },

  backButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "800",
    color: colors.primaryDark,
  },

  emptyCard: {
    marginTop: 20,
    padding: 28,
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
  },

  emptyTitle: {
    marginTop: 17,
    fontSize: 20,
    fontWeight: "900",
    color: colors.textPrimary,
  },

  emptyDescription: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },

  generateButton: {
    minHeight: 52,
    marginTop: 20,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
  },

  generateButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
});