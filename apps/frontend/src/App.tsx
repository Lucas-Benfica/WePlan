import { ConfigProvider, theme } from "antd";
import ptBR from "antd/locale/pt_BR";
import GlobalStyle from "./styles/GlobalStyles";
import ResetStyle from "./styles/ResetStyles";
import { useState } from "react";

function App() {

  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: "Inter, sans-serif",
          colorPrimary: "#1890ff",
        },
      }}
    >
      <ResetStyle />
      <GlobalStyle />

      <div>WePlan FrontEnd</div>
    </ConfigProvider>
  );
}

export default App;
