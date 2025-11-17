import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mockCategories = [
  {
    name: "Utilities",
    amount: 447.84,
    percentage: 36,
    color: "#FFA500",
    icon: "💡",
  },
  {
    name: "Expenses",
    amount: 149.28,
    percentage: 12,
    color: "#4CAF50",
    icon: "📋",
  },
  {
    name: "Payments",
    amount: 248.8,
    percentage: 20,
    color: "#2196F3",
    icon: "💳",
  },
  {
    name: "Subscriptions",
    amount: 99.52,
    percentage: 8,
    color: "#F44336",
    icon: "🔄",
  },
  {
    name: "Entertainment",
    amount: 298.21,
    percentage: 24,
    color: "#9C27B0",
    icon: "🎮",
  },
];

export default function InsightsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState("Month");
  const totalSpent = 1244.65;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Donut Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.donutChart}>
            <View style={styles.donutCenter}>
              <Text style={styles.chartLabel}>Spent this April ▼</Text>
              <Text style={styles.chartAmount}>${totalSpent.toFixed(2)}</Text>
            </View>
            {/* Simplified donut segments */}
            {mockCategories.map((cat, index) => (
              <View
                key={index}
                style={[
                  styles.donutSegment,
                  {
                    backgroundColor: cat.color,
                    transform: [
                      { rotate: `${(index * 360) / mockCategories.length}deg` },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {["Week", "Month", "Year"].map((period) => (
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
        </View>

        {/* Spending Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Spending Categories</Text>

          <View style={styles.categoriesGrid}>
            {mockCategories.map((category, index) => (
              <View key={index} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: category.color },
                    ]}
                  >
                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  </View>
                  <Text style={styles.categoryPercentage}>
                    {category.percentage}%
                  </Text>
                </View>
                <Text style={styles.categoryAmount}>
                  ${category.amount.toFixed(2)}
                </Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chartContainer: {
    padding: 24,
    alignItems: "center",
  },
  donutChart: {
    width: 250,
    height: 250,
    borderRadius: 125,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginBottom: 24,
  },
  donutCenter: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
  },
  chartLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  chartAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  donutSegment: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.3,
  },
  periodSelector: {
    flexDirection: "row",
    gap: 16,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  periodButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  periodText: {
    fontSize: 16,
    color: "#999",
  },
  periodTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  categoriesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
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
  },
});
