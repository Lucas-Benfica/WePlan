import { ConfigProvider, theme } from "antd";
import ptBR from "antd/locale/pt_BR";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

import GlobalStyle from "./styles/GlobalStyles";
import ResetStyle from "./styles/ResetStyles";
import { AuthProvider } from "./contexts/AuthContext";
import { FamilyProvider } from "./contexts/FamilyContext";
import { BankAccountProvider } from "./contexts/BankAccountContext";
import { TransactionProvider } from "./contexts/TransactionContext";

function App() {
  const isDarkMode = false;

  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: "Inter, sans-serif",
          colorPrimary: "#1890ff", //#1890ff 009688
        },
      }}
    >
      <ResetStyle />
      <GlobalStyle />

      <AuthProvider>
        <FamilyProvider>
          <BankAccountProvider>
            <TransactionProvider>
              <RouterProvider router={router} />
            </TransactionProvider>
          </BankAccountProvider>
        </FamilyProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;

