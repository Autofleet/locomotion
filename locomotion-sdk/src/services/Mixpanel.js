import Mixpanel from 'react-native-mixpanel';
import { getDeviceId } from 'react-native-device-info';
export const getElementName = props => props['data-test-id'] || props.id;

class MixpanelService {
  constructor() {
    this.isInit = false;
    this.init();
  }

  init = async () => {
    if (!this.isInit) { 
      /*if Config.OPERATION_ID is valid then mixpanelToken = Config.MIXPANEL_TOKEN */
      await Mixpanel.sharedInstanceWithToken('token', true);
      this.isInit = true;
    }
  }

  setUser = async (user) => {
    const uniqueId = (user && user.id) || getDeviceId();
    this.user = user;
    if (user && user.id) {
      await Mixpanel.optInTracking();
      await Mixpanel.identify(uniqueId);
      Mixpanel.set({
        id: user.id,
      });
    }
  }

  trackWithProperties = (event, props) => {
    if (this.isInit) {
      Mixpanel.trackWithProperties(event, props);
    }
  }

  pageView = (pageName, properties = {}) => {
    this.trackWithProperties(`Page View - ${pageName}`, { page_name: pageName, event_type: 'page_view', ...properties });
  }

  setEvent = (eventName, properties = {}) => {
    this.trackWithProperties(eventName, { event_name: eventName, event_type: 'event', ...properties });
  }

  clickEvent = (eventName, properties = {}) => {
    this.trackWithProperties(`Click - ${eventName}`, { event_name: eventName, event_type: 'click', ...properties });
  }

  trackElementClick = (props, properties = {}) => {
    const elmName = getElementName(props);
    const eventName = `${elmName}`;
    if (elmName) {
      this.clickEvent(eventName, properties);
    }
  }

  resetIdentifier = async () => {
    await Mixpanel.clearSuperProperties();
    await Mixpanel.reset();
  }

  registerSuperProperties = (properties) => {
    Mixpanel.registerSuperProperties(properties);
  }

  demoMode = (isDemoUser) => {
    if (isDemoUser) {
      Mixpanel.optOutTracking();
    } else {
      Mixpanel.setOnce({ demo_user: isDemoUser });
      Mixpanel.registerSuperProperties({ demo_user: isDemoUser });
    }
  }
}

export default new MixpanelService();
