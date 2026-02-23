import { useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";

export function useTransaction() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }

  return context;
}
