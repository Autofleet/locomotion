import React, { Fragment } from 'react';
import Router from './Pages';
import GlobalStyle from './assets/global-style';
import usersContainer from './contexts/usersContainer';
import settingsContainer from './contexts/settingsContainer';
import serviceHoursContainer from './contexts/serviceHoursContainer';

function App() {
  return (
    <Fragment>
      <settingsContainer.Provider>
        <usersContainer.Provider>
          <serviceHoursContainer.Provider>
            <Router />
            <GlobalStyle />
          </serviceHoursContainer.Provider>
        </usersContainer.Provider>
      </settingsContainer.Provider>
    </Fragment>
  );
}

export default App;
