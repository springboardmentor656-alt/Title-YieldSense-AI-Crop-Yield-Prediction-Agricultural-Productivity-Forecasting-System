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
  FileSpreadsheet,
  FileText,
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

const PAGE_SIZE = 5;

export default function RecommendationHistoryScreen() {
  const [recommendations, setRecommendations] = useState([]);

  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  
  const [exportingFormat, setExportingFormat] =
    useState("");

  const loadHistory = useCallback(
    async ({ showLoader = true } = {}) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        const response =
          await recommendationService.getRecommendationHistory({
            skip: 0,
            limit: PAGE_SIZE,
          });

        const items = extractRecommendations(response);
        const total = response?.total ?? items.length;

        setRecommendations(items);
        setSkip(items.length);
        setHasMore(items.length < total);
      } catch (error) {
        const message =
          error.response?.data?.detail ||
          error.message ||
          "Unable to load recommendation history.";

        Alert.alert("History Loading Failed", message);
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

  const loadMoreHistory = useCallback(async () => {
    if (
      loading ||
      refreshing ||
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    try {
      setLoadingMore(true);

      const response =
        await recommendationService.getRecommendationHistory({
          skip,
          limit: PAGE_SIZE,
        });

      const newItems = extractRecommendations(response);
      const total =
        response?.total ??
        recommendations.length + newItems.length;

      setRecommendations((currentItems) => {
        const existingIds = new Set(
          currentItems.map((item) => item.id)
        );

        const uniqueNewItems = newItems.filter(
          (item) => !existingIds.has(item.id)
        );

        return [...currentItems, ...uniqueNewItems];
      });

      const nextSkip = skip + newItems.length;

      setSkip(nextSkip);
      setHasMore(
        newItems.length === PAGE_SIZE &&
          nextSkip < total
      );
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.message ||
        "Unable to load more recommendations.";

      Alert.alert("Loading Failed", message);
    } finally {
      setLoadingMore(false);
    }
  }, [
    hasMore,
    loading,
    loadingMore,
    recommendations.length,
    refreshing,
    skip,
  ]);

  const handleExport = async (format) => {
    try {
      setExportingFormat(format);

      if (format === "csv") {
        await recommendationService
          .exportRecommendationsCsv();
      } else {
        await recommendationService
          .exportRecommendationsPdf();
      }

      Alert.alert(
        "Export Successful",
        `${format.toUpperCase()} recommendation report exported successfully.`
      );
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.message ||
        `Unable to export the ${format.toUpperCase()} report.`;

      Alert.alert(
        "Export Failed",
        message
      );
    } finally {
      setExportingFormat("");
    }
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
        onEndReached={loadMoreHistory}
        onEndReachedThreshold={0.3}
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

            <View style={styles.exportRow}>
            <Pressable
              disabled={
                exportingFormat !== "" ||
                recommendations.length === 0
              }
              onPress={() => handleExport("csv")}
              style={({ pressed }) => [
                styles.exportButton,
                pressed && styles.pressed,
                (exportingFormat !== "" ||
                  recommendations.length === 0) &&
                  styles.disabledButton,
              ]}
            >
              <FileSpreadsheet
                size={18}
                color={colors.primaryDark}
              />

              <Text style={styles.exportCsvText}>
                {exportingFormat === "csv"
                  ? "Exporting..."
                  : "Export CSV"}
              </Text>
            </Pressable>

            <Pressable
              disabled={
                exportingFormat !== "" ||
                recommendations.length === 0
              }
              onPress={() => handleExport("pdf")}
              style={({ pressed }) => [
                styles.exportButton,
                pressed && styles.pressed,
                (exportingFormat !== "" ||
                  recommendations.length === 0) &&
                  styles.disabledButton,
              ]}
            >
              <FileText
                size={18}
                color="#DC2626"
              />

              <Text style={styles.exportPdfText}>
                {exportingFormat === "pdf"
                  ? "Exporting..."
                  : "Export PDF"}
              </Text>
            </Pressable>
          </View>
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

        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator
                size="small"
                color={colors.primaryDark}
              />

              <Text style={styles.footerLoaderText}>
                Loading more recommendations...
              </Text>
            </View>
          ) : null
        }
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

  exportRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  exportButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
  },

  exportCsvText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryDark,
  },

  exportPdfText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "800",
    color: "#DC2626",
  },

  disabledButton: {
    opacity: 0.4,
  },

  pressed: {
    opacity: 0.7,
  },

  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  footerLoaderText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});