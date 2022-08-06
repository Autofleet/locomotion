/* eslint-disable class-methods-use-this */
import Config from 'react-native-config';
import Mixpanel from 'react-native-mixpanel';
import { getDeviceId } from './device';

export const getElementName = props => props.testID || props.id;

class MixpanelService {
  constructor() {
    this.isInit = false;
    this.init();
  }

  init = async () => {
    if (!this.isInit) {
      await Mixpanel.sharedInstanceWithToken(Config.MIXPANEL_TOKEN, true);
      this.isInit = true;
    }
  };

  setUser = async (user) => {
    const uniqueId = (user && user.id) || getDeviceId();
    this.user = user;
    if (user && user.id) {
      await Mixpanel.optInTracking();
      await Mixpanel.identify(uniqueId);
      Mixpanel.set({
        AFId: user.id,
        demandSourceId: Config.OPERATION_ID,
        appName: Config.OPERATION_NAME,
      });
    }
  };

  trackWithProperties = (event, props) => {
    if (this.isInit) {
      Mixpanel.trackWithProperties(event, { ...props, demandSourceId: Config.OPERATION_ID, appName: Config.OPERATION_NAME });
    }
  };

  pageView = (pageName, properties = {}) => {
    this.trackWithProperties(`Page View - ${pageName}`, { page_name: pageName, event_type: 'page_view', ...properties });
  };

  setEvent = (eventName, properties = {}) => {
    this.trackWithProperties(eventName, { event_name: eventName, event_type: 'event', ...properties });
  };

  clickEvent = (eventName, properties = {}) => {
    this.trackWithProperties(`Click - ${eventName}`, { event_name: eventName, event_type: 'click', ...properties });
  };

  trackElementClick = (props, properties = {}) => {
    const elmName = getElementName(props);
    const eventName = `${elmName}`;
    if (elmName) {
      this.clickEvent(eventName, properties);
    }
  };

  resetIdentifier = async () => {
    await Mixpanel.clearSuperProperties();
    await Mixpanel.reset();
  };

  registerSuperProperties = (properties) => {
    Mixpanel.registerSuperProperties(properties);
  };

  demoMode = (isDemoUser) => {
    if (isDemoUser) {
      Mixpanel.optOutTracking();
    } else {
      Mixpanel.setOnce({ demo_user: isDemoUser });
      Mixpanel.registerSuperProperties({ demo_user: isDemoUser });
    }
  };
}

export default new MixpanelService();
