import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import {
  getSpendingByCategory,
  subscribeToTransactions,
  Transaction,
} from "../../services/transactionService";

type PeriodType = "Week" | "Month" | "Year";

export default function InsightsScreen() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("Month");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToTransactions(
      user.uid,
      (fetchedTransactions) => {
        setTransactions(fetchedTransactions);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Filter transactions by period
  const getFilteredTransactions = () => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case "Week":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        );
        break;
      case "Month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "Year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    return transactions.filter(
      (t) => t.date >= startDate && t.type === "expense"
    );
  };

  const filteredTransactions = getFilteredTransactions();
  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const spendingByCategory = getSpendingByCategory(filteredTransactions);

  // Convert to array and sort by amount
  const categoryData = Object.entries(spendingByCategory)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Category colors
  const categoryColors: Record<string, string> = {
    "Food & Dining": "#FF6B6B",
    Shopping: "#4ECDC4",
    Transportation: "#45B7D1",
    Entertainment: "#FFA07A",
    "Bills & Utilities": "#98D8C8",
    Healthcare: "#F7DC6F",
    Education: "#BB8FCE",
    Other: "#95A5A6",
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || "#95A5A6";
  };

  // Get top 3 categories for the donut chart display
  const topCategories = categoryData.slice(0, 5);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading insights...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Insights</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(["Week", "Month", "Year"] as PeriodType[]).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {totalSpent === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No expenses yet</Text>
            <Text style={styles.emptyText}>
              Start tracking your expenses to see insights and spending patterns
            </Text>
          </View>
        ) : (
          <>
            {/* Total Spent Card */}
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total Spent</Text>
              <Text style={styles.totalAmount}>${totalSpent.toFixed(2)}</Text>
              <Text style={styles.totalSubtext}>
                {filteredTransactions.length} transaction
                {filteredTransactions.length !== 1 ? "s" : ""} this{" "}
                {selectedPeriod.toLowerCase()}
              </Text>
            </View>

            {/* Donut Chart Visualization */}
            <View style={styles.chartContainer}>
              <Text style={styles.sectionTitle}>Spending Breakdown</Text>

              <View style={styles.donutWrapper}>
                <View style={styles.donutChart}>
                  {topCategories.map((category, index) => {
                    const rotation = topCategories
                      .slice(0, index)
                      .reduce((sum, cat) => sum + cat.percentage * 3.6, 0);

                    return (
                      <View
                        key={category.name}
                        style={[
                          styles.donutSegment,
                          {
                            backgroundColor: getCategoryColor(category.name),
                            transform: [{ rotate: `${rotation}deg` }],
                            opacity: 0.9,
                          },
                        ]}
                      />
                    );
                  })}
                  <View style={styles.donutCenter}>
                    <Text style={styles.donutCenterText}>Expenses</Text>
                  </View>
                </View>

                {/* Legend */}
                <View style={styles.legend}>
                  {topCategories.map((category) => (
                    <View key={category.name} style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: getCategoryColor(category.name) },
                        ]}
                      />
                      <Text style={styles.legendText}>{category.name}</Text>
                      <Text style={styles.legendPercentage}>
                        {category.percentage}%
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Spending Categories Detail */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Category Details</Text>

              <View style={styles.categoriesGrid}>
                {categoryData.map((category) => (
                  <View key={category.name} style={styles.categoryCard}>
                    <View style={styles.categoryHeader}>
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: getCategoryColor(category.name) },
                        ]}
                      >
                        <Text style={styles.categoryEmoji}>
                          {category.name === "Food & Dining"
                            ? "🍔"
                            : category.name === "Shopping"
                            ? "🛍️"
                            : category.name === "Transportation"
                            ? "🚗"
                            : category.name === "Entertainment"
                            ? "🎮"
                            : category.name === "Bills & Utilities"
                            ? "💡"
                            : category.name === "Healthcare"
                            ? "⚕️"
                            : category.name === "Education"
                            ? "📚"
                            : "📦"}
                        </Text>
                      </View>
                      <Text style={styles.categoryPercentage}>
                        {category.percentage}%
                      </Text>
                    </View>
                    <Text style={styles.categoryAmount}>
                      ${category.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.categoryName}>{category.name}</Text>

                    {/* Progress bar */}
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${category.percentage}%`,
                            backgroundColor: getCategoryColor(category.name),
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Statistics Summary */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Statistics</Text>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    ${(totalSpent / filteredTransactions.length).toFixed(2)}
                  </Text>
                  <Text style={styles.statLabel}>Avg per Transaction</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{categoryData.length}</Text>
                  <Text style={styles.statLabel}>Categories Used</Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {categoryData[0]?.name.split(" ")[0] || "N/A"}
                  </Text>
                  <Text style={styles.statLabel}>Top Category</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    ${categoryData[0]?.amount.toFixed(2) || "0.00"}
                  </Text>
                  <Text style={styles.statLabel}>Highest Spending</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    padding: 20,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  periodButtonActive: {
    backgroundColor: "#000",
  },
  periodText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  periodTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 24,
  },
  totalCard: {
    backgroundColor: "#f9f9f9",
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  totalSubtext: {
    fontSize: 14,
    color: "#666",
  },
  chartContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  donutWrapper: {
    alignItems: "center",
  },
  donutChart: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginBottom: 24,
    overflow: "hidden",
  },
  donutSegment: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  donutCenter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  donutCenterText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  legend: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  legendPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  categoriesSection: {
    padding: 20,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  categoryAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  statsSection: {
    padding: 20,
    paddingTop: 0,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
