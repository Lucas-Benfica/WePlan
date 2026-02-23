import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Transaction, CreateTransactionData, UpdateTransactionData } from "../types/Transaction";
import { transactionService } from "../services/transactionService";
import { useFamily } from "../hooks/useFamily";

interface TransactionContextType {
  transactions: Transaction[];
  isLoadingTransactions: boolean;
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  createTransaction: (data: CreateTransactionData) => Promise<void>;
  updateTransaction: (id: string, data: UpdateTransactionData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  reloadTransactions: () => Promise<void>;
}

export const TransactionContext = createContext({} as TransactionContextType);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const { activeFamily } = useFamily();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const loadTransactions = useCallback(async () => {
    if (!activeFamily) {
      setTransactions([]);
      return;
    }

    setIsLoadingTransactions(true);
    try {
      const data = await transactionService.getAll(
        activeFamily.id,
        selectedMonth,
        selectedYear
      );
      setTransactions(data);
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [activeFamily, selectedMonth, selectedYear]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const createTransaction = async (data: CreateTransactionData) => {
    if (!activeFamily) return;
    await transactionService.create(data, activeFamily.id);
    await loadTransactions();
  };

  const updateTransaction = async (id: string, data: UpdateTransactionData) => {
    await transactionService.update(id, data);
    await loadTransactions();
  };

  const deleteTransaction = async (id: string) => {
    await transactionService.delete(id);
    await loadTransactions();
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoadingTransactions,
        selectedMonth,
        selectedYear,
        setSelectedMonth,
        setSelectedYear,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        reloadTransactions: loadTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
