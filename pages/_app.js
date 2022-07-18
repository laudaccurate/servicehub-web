import "../styles/globals.css";
import React from "react";
import PropTypes from "prop-types";
import AppProvider from "../components/Application/AppProvider";
import ScrollToTop from "../components/utils/ScrollToTop";

const App = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <ScrollToTop />
      <Component {...pageProps} />
    </AppProvider>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default App;

