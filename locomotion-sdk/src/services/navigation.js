import { NavigationActions } from 'react-navigation';

let Navigator;

function setTopLevelNavigator(navigatorRef) {
  Navigator = navigatorRef;
}

export default {
  Navigator,
  setTopLevelNavigator,
};