import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';

const App = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const routing = useRoutes(routes(isLoggedIn));

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default App;
