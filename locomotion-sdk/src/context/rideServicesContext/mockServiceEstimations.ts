import { ImageURISource } from 'react-native';
import moment, { Moment } from 'moment';

export const TAG_OPTIONS = {
  FASTEST: 'Fastest',
  CHEAPEST: 'Cheapest',
};

export interface ServiceDetailsInterface {
    name: string;
    eta?: Moment;
    price?: string;
    availableSeats?: number;
    tag?: string;
    iconUrl: ImageURISource;
    description?: string;
}

export const serviceOptions: ServiceDetailsInterface[] = [
  {
    name: 'Premium',
    eta: moment(Date.now()).add(30, 'm'),
    price: '$32.30',
    availableSeats: 4,
    tag: TAG_OPTIONS.FASTEST,
    iconUrl: 'https://res.cloudinary.com/autofleet/image/upload/w_700,h_500,c_thumb,q_auto/vehicle-images/Minivan/minivan_green.png',
    description: 'this is a description for a service',

  },
  {
    name: 'Premium',
    eta: moment(Date.now()).add(15, 'm'),
    // price: '$32.30',
    availableSeats: 4,
    iconUrl: 'https://res.cloudinary.com/autofleet/image/upload/w_700,h_500,c_thumb,q_auto/vehicle-images/Minivan/minivan_green.png',
    description: 'this is a description for a service',
  },
  {
    name: 'Premium',
    tag: TAG_OPTIONS.CHEAPEST,
    eta: moment(Date.now()).add(10, 'm'),
    price: '$32.30',
    availableSeats: 4,
    iconUrl: 'https://res.cloudinary.com/autofleet/image/upload/w_700,h_500,c_thumb,q_auto/vehicle-images/Minivan/minivan_green.png',
  },
  {
    name: 'Premium',
    tag: TAG_OPTIONS.CHEAPEST,
    eta: moment(Date.now()).add(10, 'm'),
    price: '$32.30',
    availableSeats: 4,
    iconUrl: 'https://res.cloudinary.com/autofleet/image/upload/w_700,h_500,c_thumb,q_auto/vehicle-images/Minivan/minivan_green.png',
  },
  {
    name: 'Premium',
    tag: TAG_OPTIONS.CHEAPEST,
    eta: moment(Date.now()).add(10, 'm'),
    price: '$32.30',
    availableSeats: 4,
    iconUrl: 'https://res.cloudinary.com/autofleet/image/upload/w_700,h_500,c_thumb,q_auto/vehicle-images/Minivan/minivan_green.png',
  },
];
