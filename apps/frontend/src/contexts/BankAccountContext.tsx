import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { BankAccount } from "../types/BankAccount";
import { bankAccountService } from "../services/bankAccountService";
import { useFamily } from "../hooks/useFamily";

export interface CreateBankAccountData {
  name: string;
  bank: string;
  bankLogo?: string;
  initialBalance: number;
  hasCreditCard: boolean;
  creditCardLimit?: number;
  invoiceClosingDay?: number;
  invoiceDueDay?: number;
  creditCards?: { nickname: string }[];
}

export interface UpdateBankAccountData {
  id: string;
  name?: string;
  bank?: string;
  bankLogo?: string;
  initialBalance?: number;
  hasCreditCard?: boolean;
  creditCardLimit?: number;
  invoiceClosingDay?: number;
  invoiceDueDay?: number;
  creditCards?: { id?: string; nickname: string }[];
}

interface BankAccountContextType {
  bankAccounts: BankAccount[];
  isLoadingAccounts: boolean;
  createBankAccount: (data: CreateBankAccountData) => Promise<void>;
  updateBankAccount: (data: UpdateBankAccountData) => Promise<void>;
  deleteBankAccount: (id: string) => Promise<void>;
  reloadAccounts: () => Promise<void>;
}

export const BankAccountContext = createContext({} as BankAccountContextType);

export function BankAccountProvider({ children }: { children: ReactNode }) {
  const { activeFamily } = useFamily();

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  const loadAccounts = useCallback(async () => {
    if (!activeFamily) {
      setBankAccounts([]);
      return;
    }

    setIsLoadingAccounts(true);
    try {
      const data = await bankAccountService.getAll(activeFamily.id);
      setBankAccounts(data);
    } catch (error) {
      console.error("Failed to load bank accounts", error);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, [activeFamily]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const createBankAccount = async (data: CreateBankAccountData) => {
    if (!activeFamily) return;
    await bankAccountService.create(data, activeFamily.id);
    await loadAccounts();
  };

  const updateBankAccount = async (data: UpdateBankAccountData) => {
    const { id, ...updateData } = data;
    await bankAccountService.update(id, updateData);
    await loadAccounts();
  };

  const deleteBankAccount = async (id: string) => {
    await bankAccountService.delete(id);
    await loadAccounts();
  };

  return (
    <BankAccountContext.Provider
      value={{
        bankAccounts,
        isLoadingAccounts,
        createBankAccount,
        updateBankAccount,
        deleteBankAccount,
        reloadAccounts: loadAccounts,
      }}
    >
      {children}
    </BankAccountContext.Provider>
  );
}
