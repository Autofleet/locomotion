jest.mock('../../lib/services/Twilio', () => ({
    send: jest.fn(() => true),
    verify: jest.fn(() => true),
    TwilioService: jest.fn().mockImplementation(() => { return {} })
  }));

jest.mock('../../lib/mail', () => jest.fn());
