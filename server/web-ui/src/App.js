import React, { Fragment } from 'react';
import Router from './Pages';
import GlobalStyle from './assets/global-style';

function App() {
  return (
    <Fragment>
      <Router />
      <GlobalStyle />
    </Fragment>
  );
}

export default App;
