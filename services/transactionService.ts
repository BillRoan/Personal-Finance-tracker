import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Transaction {
  id?: string;
  userId: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

// Add a new transaction
export const addTransaction = async (
  userId: string,
  transactionData: Omit<Transaction, "id" | "userId" | "createdAt">
): Promise<string> => {
  try {
    const transactionsRef = collection(db, "users", userId, "transactions");
    const docRef = await addDoc(transactionsRef, {
      ...transactionData,
      userId,
      date: Timestamp.fromDate(transactionData.date),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

// Update a transaction
export const updateTransaction = async (
  userId: string,
  transactionId: string,
  transactionData: Partial<Omit<Transaction, "id" | "userId" | "createdAt">>
): Promise<void> => {
  try {
    const transactionRef = doc(
      db,
      "users",
      userId,
      "transactions",
      transactionId
    );
    const updateData: any = { ...transactionData };

    if (transactionData.date) {
      updateData.date = Timestamp.fromDate(transactionData.date);
    }

    await updateDoc(transactionRef, updateData);
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (
  userId: string,
  transactionId: string
): Promise<void> => {
  try {
    const transactionRef = doc(
      db,
      "users",
      userId,
      "transactions",
      transactionId
    );
    await deleteDoc(transactionRef);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Get all transactions for a user
export const getTransactions = async (
  userId: string
): Promise<Transaction[]> => {
  try {
    const transactionsRef = collection(db, "users", userId, "transactions");
    const q = query(transactionsRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
      } as Transaction;
    });
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw error;
  }
};

// Subscribe to real-time transaction updates
export const subscribeToTransactions = (
  userId: string,
  callback: (transactions: Transaction[]) => void
) => {
  const transactionsRef = collection(db, "users", userId, "transactions");
  const q = query(transactionsRef, orderBy("date", "desc"));

  return onSnapshot(q, (querySnapshot) => {
    const transactions = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
      } as Transaction;
    });
    callback(transactions);
  });
};

// Get transactions by date range
export const getTransactionsByDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  try {
    const transactionsRef = collection(db, "users", userId, "transactions");
    const q = query(
      transactionsRef,
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate)),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
      } as Transaction;
    });
  } catch (error) {
    console.error("Error getting transactions by date range:", error);
    throw error;
  }
};

// Calculate total balance
export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return transaction.type === "income"
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);
};

// Get spending by category
export const getSpendingByCategory = (
  transactions: Transaction[]
): Record<string, number> => {
  const expenses = transactions.filter((t) => t.type === "expense");

  return expenses.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);
};
