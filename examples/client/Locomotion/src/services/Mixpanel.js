/* eslint-disable class-methods-use-this */
import Config from 'react-native-config';
import { Mixpanel } from 'mixpanel-react-native';
import { getDeviceId } from './device';

export const getElementName = props => props.testID || props.id;

class MixpanelService {
  constructor() {
    this.isInit = false;
    this.mixpanel = {};
    this.init();
  }

  init = async () => {
    if (!this.isInit && Config.MIXPANEL_TOKEN) {
      const trackAutomaticEvents = true;
      this.mixpanel = new Mixpanel(Config.MIXPANEL_TOKEN, trackAutomaticEvents);
      this.mixpanel.init();
      this.mixpanel.setLoggingEnabled(true);
      this.isInit = true;
    }
  };

  setUser = async (user) => {
    const uniqueId = (user && user.id) || getDeviceId();
    this.user = user;
    if (user && user.id) {
      this.mixpanel.optInTracking();
      this.mixpanel.identify(uniqueId);
      this.mixpanel.getPeople().set({
        AFId: user.id,
        demandSourceId: Config.OPERATION_ID,
        appName: Config.OPERATION_NAME,
      });
    }
  };

  trackWithProperties = (event, props) => {
    if (this.isInit && this.mixpanel) {
      this.mixpanel.track(event,
        {
          ...props,
          demandSourceId: Config.OPERATION_ID,
          appName: Config.OPERATION_NAME,
        });
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
    await this.mixpanel.clearSuperProperties();
    await this.mixpanel.reset();
  };

  registerSuperProperties = (properties) => {
    this.mixpanel.registerSuperProperties(properties);
  };

  demoMode = (isDemoUser) => {
    if (isDemoUser) {
      this.mixpanel.optOutTracking();
    } else {
      this.mixpanel.registerSuperPropertiesOnce({ demo_user: isDemoUser });
      this.mixpanel.registerSuperProperties({ demo_user: isDemoUser });
    }
  };
}

export default new MixpanelService();
