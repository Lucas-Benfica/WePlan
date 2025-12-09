import { useState } from "react";
import { ConfigProvider, theme } from "antd";
import ptBR from "antd/locale/pt_BR";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

import GlobalStyle from "./styles/GlobalStyles";
import ResetStyle from "./styles/ResetStyles";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: "Inter, sans-serif",
          colorPrimary: "#1890ff", //#1890ff
        },
      }}
    >
      <ResetStyle />
      <GlobalStyle />

      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
