import React, { Fragment } from 'react';
import Router from './Pages';
import GlobalStyle from './assets/global-style';
import usersContainer from './contexts/usersContainer';
import settingsContainer from './contexts/settingsContainer';

function App() {
  return (
    <Fragment>
        <settingsContainer.Provider>
            <usersContainer.Provider>
                <Router/>
                <GlobalStyle/>
            </usersContainer.Provider>
        </settingsContainer.Provider>
    </Fragment>
  );
}

export default App;
