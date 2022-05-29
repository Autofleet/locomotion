
jest.mock('../../lib/services/Twilio', () => ({
  getInstance: jest.fn(() => ({
    send: jest.fn(() => true),
    verify: jest.fn(() => true),
  })),  
}));

jest.mock('../../lib/mail', () => jest.fn());
