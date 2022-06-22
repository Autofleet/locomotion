// import { NavigationActions, StackActions } from 'react-navigation';
import { CommonActions, NavigationContainerRef, StackActions } from '@react-navigation/native';
import Mixpanel from './Mixpanel';

let myNavigator: any;

export const setTopLevelNavigator = (navigatorRef: any) => {
  myNavigator = navigatorRef;
};

export const replace = (routeName: string) => {
  const activeRoute = myNavigator?.getCurrentRoute();
  if (activeRoute?.name === routeName) {
    return false;
  }

  Mixpanel.pageView(routeName);
  const resetAction = CommonActions.reset({
    index: 0,
    routeNames: [routeName],
    routes: [
      { name: routeName },
    ],
  });
  return myNavigator.dispatch(resetAction);
};

export const navigate = (name: string, params: any = {}, stackName: string | null = null) => {
  const activeRoute = myNavigator?.getCurrentRoute();
  if (activeRoute?.name === name && activeRoute?.params === params) {
    return false;
  }

  Mixpanel.pageView(name);
  if (stackName) {
    myNavigator.dispatch(CommonActions.reset({
      index: 0,
      routes: [
        {
          name: stackName,
          state: {
            routes: [
              {
                name,
                params,
              },
            ],
          },
        },

      ],
    }));
  } else {
    myNavigator.dispatch(CommonActions.navigate(name, params));
  }

  return true;
};
export const goBack = () => {
  Mixpanel.pageView('Back');
  myNavigator.dispatch(CommonActions.goBack());

  return true;
};
