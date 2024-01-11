/* eslint-disable class-methods-use-this */
import Config from 'react-native-config';
import { Mixpanel } from 'mixpanel-react-native';
import { getUniqueId } from 'react-native-device-info';
import { Alert } from 'react-native';
import { getDeviceId } from './device';

export const getElementName = props => props.testID || props.id;

const getRandomNumberByUuid = (uuid) => {
  try {
    const decimalValue = parseInt(uuid.substr(0, 8), 16);
    const mappedNumber = (decimalValue % 100) + 1;
    return mappedNumber;
  } catch (err) {
    console.log('getRandomNumberByUuid error', err);
    return 0;
  }
};

const { MIXPANEL_EVENTS_NUMBER } = Config;

const shouldTrackEvents = () => {
  if (!MIXPANEL_EVENTS_NUMBER) {
    return true;
  }
  const deviceUuid = getUniqueId();
  const number = getRandomNumberByUuid(deviceUuid);
  Alert.alert(deviceUuid, number.toString());
  return number <= parseInt(MIXPANEL_EVENTS_NUMBER, 10);
};

class MixpanelService {
  constructor() {
    this.isInit = false;
    this.mixpanel = {};
    this.shouldTrackEvents = shouldTrackEvents();
    if (this.shouldTrackEvents) {
      this.init();
    }
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
    if (!this.isInit) return;

    const uniqueId = (user && user.id) || getDeviceId();
    this.user = user;
    if (user && user.id && this.isInit) {
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
    if (!this.isInit) return;
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

  appStateEvent = (eventName, properties = {}) => {
    this.trackWithProperties(`AppState - ${eventName}`, { event_name: eventName, event_type: 'event', ...properties });
  };

  trackElementClick = (props, properties = {}) => {
    if (!this.isInit) return;
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
    if (!this.isInit) return;
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
