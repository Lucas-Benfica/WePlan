import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Family } from "../types/Family";
import { familyService } from "../services/familyService";
import { useAuth } from "../hooks/useAuth";

interface FamilyContextType {
  families: Family[];
  activeFamily: Family | null;
  isLoadingFamilies: boolean;
  selectFamily: (familyId: string) => void;
  loadFamilies: () => Promise<void>;
  createFamily: (name: string) => Promise<void>;
  joinFamily: (familyId: string) => Promise<void>;
}

export const FamilyContext = createContext({} as FamilyContextType);

export function FamilyProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [activeFamily, setActiveFamily] = useState<Family | null>(null);
  const [isLoadingFamilies, setIsLoadingFamilies] = useState(false);

  const loadFamilies = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoadingFamilies(true);
    try {
      const data = await familyService.getMyFamilies();
      setFamilies(data);

      // Lógica da Família Ativa:
      // 1. Tenta pegar do localStorage
      const storedFamilyId = localStorage.getItem("weplan.activeFamilyId");

      // 2. Verifica se a família salva ainda existe na lista nova
      const foundStored = data.find((f) => f.id === storedFamilyId);

      if (foundStored) {
        setActiveFamily(foundStored);
      } else if (data.length > 0) {
        // 3. Se não tiver salva (ou foi excluída), seleciona a primeira da lista
        setActiveFamily(data[0]);
        localStorage.setItem("weplan.activeFamilyId", data[0].id);
      } else {
        // 4. Se não tem nenhuma família, limpa tudo
        setActiveFamily(null);
        localStorage.removeItem("weplan.activeFamilyId");
      }
    } catch (error) {
      console.error("Failed to load families", error);
    } finally {
      setIsLoadingFamilies(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFamilies();
  }, [loadFamilies]);

  const selectFamily = (familyId: string) => {
    const family = families.find((f) => f.id === familyId);
    if (family) {
      setActiveFamily(family);
      localStorage.setItem("weplan.activeFamilyId", family.id);
    }
  };

  const createFamily = async (name: string) => {
    const newFamily = await familyService.createFamily({ name });
    await loadFamilies();
    selectFamily(newFamily.id);
  };

  const joinFamily = async (familyId: string) => {
    await familyService.joinFamily({ familyId });
    await loadFamilies();
    selectFamily(familyId);
  };

  return (
    <FamilyContext.Provider
      value={{
        families,
        activeFamily,
        isLoadingFamilies,
        selectFamily,
        loadFamilies,
        createFamily,
        joinFamily,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}
