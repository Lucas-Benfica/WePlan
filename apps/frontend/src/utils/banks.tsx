import { BankOutlined, GlobalOutlined } from "@ant-design/icons";

export interface BankDef {
  value: string;
  label: string;
  color: string;
  icon?: React.ReactNode;
}

export const BANKS_LIST: BankDef[] = [
  { value: "nubank", label: "Nubank", color: "#820ad1" },
  { value: "itau", label: "Itaú", color: "#ec7000" },
  { value: "bradesco", label: "Bradesco", color: "#cc092f" },
  { value: "inter", label: "Banco Inter", color: "#ff7a00" },
  { value: "santander", label: "Santander", color: "#ea0029" },
  { value: "bb", label: "Banco do Brasil", color: "#fbf600" }, // Atenção com texto branco aqui
  { value: "caixa", label: "Caixa", color: "#005ca9" },
  { value: "c6", label: "C6 Bank", color: "#242424" },
  { value: "btg", label: "BTG Pactual", color: "#003664" },
  { value: "neon", label: "Neon", color: "#00a3cc" },
  {
    value: "wallet",
    label: "Carteira / Dinheiro",
    color: "#38a169",
    icon: <WalletIcon />,
  },
  {
    value: "other",
    label: "Outro Banco",
    color: "#6b7280",
    icon: <BankOutlined />,
  },
];

export const getBankColor = (bankValue?: string) => {
  const bank = BANKS_LIST.find((b) => b.value === bankValue);
  return bank?.color || "#6b7280";
};

function WalletIcon() {
  return <GlobalOutlined />;
}
