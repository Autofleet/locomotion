const request = require('supertest');
const nock = require('nock');
const { User, Verification } = require('../../../../models');
const app = require('../../../../app');
const createUserAndLogin = require('../../../assets/create-user-and-login');
const googlePlacesSamples = require('../../../assets/mock-google-places');
const googlePlaceDetailsSamples = require('../../../assets/mock-google-place-details');
const availablePlacesSamples = require('../../../assets/available-places.sample.json');

jest.mock('../../../../lib/get-available-places');
const getAvailablePlaces = require('../../../../lib/get-available-places');

const getGooglePlacesMock = () => nock('https://maps.googleapis.com')
  .get('/maps/api/place/autocomplete/json')
  .query(() => true)
  .once()
  .reply(200, googlePlacesSamples);

const mockGooglePlaceDetails = () => nock('https://maps.googleapis.com')
  .get('/maps/api/place/details/json')
  .query(() => true)
  .once()
  .reply(200, googlePlaceDetailsSamples);

describe('Places api', () => {
  const baseUrl = '/api/v1';

  beforeEach(async () => {
    await User.destroy({ truncate: true, force: true });
    await Verification.destroy({ truncate: true, force: true });
  });

  xit('Can it get places with available stations', async () => {
    getAvailablePlaces.mockImplementation(async () => availablePlacesSamples.features);
    const { accessToken } = await createUserAndLogin();
    const googlePlacesMock = getGooglePlacesMock();
    const googlePlaceDetails = mockGooglePlaceDetails();
    const { body: results } = await request(app).get(`${baseUrl}/me/places`).query({
      location: {
        lat: 40.763596,
        lng: -73.974998,
      },
      input: 'central park',
    }).set('Authorization', `Bearer ${accessToken}`);


    expect(results[0].description).toBe('Second station');
    expect(results[0].id).toBe(2);
    expect(googlePlacesMock.isDone()).toBe(true);
    expect(googlePlaceDetails.isDone()).toBe(true);
  });

  xit('Can get places without available stations', async () => {
    const { accessToken } = await createUserAndLogin();
    getAvailablePlaces.mockImplementation(async () => []);
    const googlePlacesMock = getGooglePlacesMock();
    const googlePlaceDetails = mockGooglePlaceDetails();
    const { body: results } = await request(app).get(`${baseUrl}/me/places`).query({
      location: {
        lat: 40.763596,
        lng: -73.974998,
      },
      input: 'central park',
    }).set('Authorization', `Bearer ${accessToken}`);


    expect(results[0].description).toBe(googlePlacesSamples.predictions[0].description);
    expect(results[0].id).toBe(googlePlacesSamples.predictions[0].id);
    expect(googlePlacesMock.isDone()).toBe(true);
    // When no available stations, call the place details for the first entry is not needed
    expect(googlePlaceDetails.isDone()).toBe(false);
  });
});

