jest.mock('../../lib/services/Twilio', () => ({
    send: jest.fn(() => true),
    verify: jest.fn(() => true),
  }));

jest.mock('../../lib/mail', () => jest.fn());
