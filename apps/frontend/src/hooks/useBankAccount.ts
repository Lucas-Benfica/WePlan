import { useContext } from "react";
import { BankAccountContext } from "../contexts/BankAccountContext";

export function useBankAccount() {
  const context = useContext(BankAccountContext);

  if (!context) {
    throw new Error("useBankAccount must be used within a BankAccountProvider");
  }

  return context;
}
