import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import {
  subscribeToTransactions,
  Transaction,
} from "../../services/transactionService";

interface Card {
  id: string;
  name: string;
  type: "credit" | "debit" | "savings";
  lastFour: string;
  balance: number;
  color: string;
  icon: string;
}

export default function WalletScreen() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string>("main");

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

  // Calculate balances
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  // Mock cards data - In production, this would come from Firestore
  const cards: Card[] = [
    {
      id: "main",
      name: "Main Account",
      type: "debit",
      lastFour: "4532",
      balance: currentBalance,
      color: "#000",
      icon: "💳",
    },
    {
      id: "savings",
      name: "Savings Account",
      type: "savings",
      lastFour: "7821",
      balance: 5420.5,
      color: "#4CAF50",
      icon: "💰",
    },
    {
      id: "credit",
      name: "Credit Card",
      type: "credit",
      lastFour: "9876",
      balance: -1250.75,
      color: "#2196F3",
      icon: "💎",
    },
  ];

  const selectedCardData = cards.find((c) => c.id === selectedCard) || cards[0];

  // Calculate monthly spending
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlySpending = transactions
    .filter((t) => t.type === "expense" && t.date >= firstDayOfMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  // Get recent transactions for selected card
  const recentTransactions = transactions.slice(0, 5);

  const handleAddCard = () => {
    Alert.alert(
      "Add Card",
      "This feature is coming soon! You will be able to add multiple cards and accounts.",
      [{ text: "OK" }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wallet</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
            <Ionicons name="add-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Card Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          contentContainerStyle={styles.cardsContainer}
        >
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, { backgroundColor: card.color }]}
              onPress={() => setSelectedCard(card.id)}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}>{card.icon}</Text>
                <Text style={styles.cardType}>
                  {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
                </Text>
              </View>

              <View style={styles.cardMiddle}>
                <Text style={styles.cardBalance}>
                  ${Math.abs(card.balance).toFixed(2)}
                </Text>
                {card.type === "credit" && card.balance < 0 && (
                  <Text style={styles.cardSubtext}>Outstanding Balance</Text>
                )}
              </View>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>Card Number</Text>
                  <Text style={styles.cardNumber}>•••• {card.lastFour}</Text>
                </View>
                <View style={styles.cardChip}>
                  <Ionicons name="card-outline" size={24} color="#fff" />
                </View>
              </View>

              <Text style={styles.cardName}>{card.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>This Month</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="arrow-up" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.statValue}>${totalIncome.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Income</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="arrow-down" size={24} color="#F44336" />
              </View>
              <Text style={styles.statValue}>
                ${monthlySpending.toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>Expenses</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="wallet" size={24} color="#2196F3" />
              </View>
              <Text style={styles.statValue}>${currentBalance.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Net Balance</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="trending-up" size={24} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{transactions.length}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="swap-horizontal" size={24} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>Transfer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: "#F3E5F5" }]}>
                <Ionicons name="card" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.actionText}>Pay Bills</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: "#FFF3E0" }]}>
                <Ionicons name="receipt" size={24} color="#FF9800" />
              </View>
              <Text style={styles.actionText}>Invoices</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: "#E8F5E9" }]}>
                <Ionicons name="analytics" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>No recent activity</Text>
            </View>
          ) : (
            recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.activityCard}>
                <View style={styles.activityLeft}>
                  <View
                    style={[
                      styles.activityIcon,
                      {
                        backgroundColor:
                          transaction.type === "income" ? "#E8F5E9" : "#FFEBEE",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        transaction.type === "income"
                          ? "arrow-down"
                          : "arrow-up"
                      }
                      size={20}
                      color={
                        transaction.type === "income" ? "#4CAF50" : "#F44336"
                      }
                    />
                  </View>
                  <View>
                    <Text style={styles.activityName}>
                      {transaction.category}
                    </Text>
                    <Text style={styles.activityDesc}>
                      {transaction.description || "No description"}
                    </Text>
                    <Text style={styles.activityDate}>
                      {transaction.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.activityAmount,
                    {
                      color:
                        transaction.type === "income" ? "#4CAF50" : "#F44336",
                    },
                  ]}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Security Info */}
        <View style={styles.securitySection}>
          <View style={styles.securityCard}>
            <View style={styles.securityIcon}>
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            </View>
            <View style={styles.securityContent}>
              <Text style={styles.securityTitle}>Your wallet is secure</Text>
              <Text style={styles.securityText}>
                All transactions are encrypted and protected
              </Text>
            </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    padding: 8,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    width: 320,
    height: 200,
    borderRadius: 20,
    padding: 24,
    marginRight: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardEmoji: {
    fontSize: 32,
  },
  cardType: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    fontWeight: "600",
  },
  cardMiddle: {
    flex: 1,
    justifyContent: "center",
  },
  cardBalance: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardLabel: {
    fontSize: 10,
    color: "#fff",
    opacity: 0.7,
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 2,
  },
  cardChip: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardName: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginTop: 8,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
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
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  actionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    width: "23%",
    alignItems: "center",
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  activitySection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  activityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  activityDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: "#999",
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  securitySection: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  securityCard: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  securityText: {
    fontSize: 14,
    color: "#666",
  },
});
