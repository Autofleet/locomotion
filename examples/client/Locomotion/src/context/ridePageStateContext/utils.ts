export type BsPages = 'ADDRESS_SELECTOR' | 'SET_LOCATION_ON_MAP' | 'SERVICE_ESTIMATIONS' |
 'CONFIRM_PICKUP' | 'NO_PAYMENT' | 'NOT_IN_TERRITORY' | 'CONFIRMING_RIDE' | 'ACTIVE_RIDE' |
 'NO_AVAILABLE_VEHICLES' | 'CUSTOM_TIP' | 'LOCATION_REQUEST';

interface BsPageObject {
    [key: string]: BsPages
}

export const BS_PAGES: BsPageObject = {
  ADDRESS_SELECTOR: 'ADDRESS_SELECTOR',
  SET_LOCATION_ON_MAP: 'SET_LOCATION_ON_MAP',
  CONFIRM_PICKUP: 'CONFIRM_PICKUP',
  NO_PAYMENT: 'NO_PAYMENT',
  SERVICE_ESTIMATIONS: 'SERVICE_ESTIMATIONS',
  NOT_IN_TERRITORY: 'NOT_IN_TERRITORY',
  CONFIRMING_RIDE: 'CONFIRMING_RIDE',
  ACTIVE_RIDE: 'ACTIVE_RIDE',
  NO_AVAILABLE_VEHICLES: 'NO_AVAILABLE_VEHICLES',
  CUSTOM_TIP: 'CUSTOM_TIP',
  LOCATION_REQUEST: 'LOCATION_REQUEST',
};
