import React, { Fragment } from 'react';
import Router from './Pages';
import GlobalStyle from './assets/global-style';
import usersContainer from './contexts/usersContainer';

function App() {
  return (
    <Fragment>
      <usersContainer.Provider>
        <Router />
        <GlobalStyle />
      </usersContainer.Provider>
    </Fragment>
  );
}

export default App;
