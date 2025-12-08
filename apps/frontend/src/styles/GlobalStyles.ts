import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #F0F2F5; 

    color: #1F2937;

    /* Definição da fonte: Inter como principal, com fallbacks para fontes de sistema */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    
    /* Melhora a renderização da fonte em alguns monitores */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Garante que elementos de formulário herdem a fonte do corpo */
  input, button, textarea, select {
    font-family: inherit;
  }
`;

export default GlobalStyle;