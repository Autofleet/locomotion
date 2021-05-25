const request = require('supertest');
import nock from 'nock';
import { User, Verification } from '../../../../models';
import app from '../../../../app';
import createUserAndLogin from '../../../assets/create-user-and-login';
import googlePlacesSamples from '../../../assets/mock-google-places';
import googlePlaceDetailsSamples from '../../../assets/mock-google-place-details';
const availablePlacesSamples = require('../../../assets/available-places.sample.json');

jest.mock('../../../../lib/get-available-places');
import getAvailablePlaces from '../../../../lib/get-available-places';

const mockedGetAvailablePlaces = getAvailablePlaces as jest.Mock;

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
    mockedGetAvailablePlaces.mockImplementation(async () => availablePlacesSamples.features);
    const { accessToken } = await createUserAndLogin();
    const googlePlacesMock = getGooglePlacesMock();
    const googlePlaceDetails = mockGooglePlaceDetails();
    const { body: results } = await request(app).get(`${baseUrl}/me/places`).query({
      location: JSON.stringify({
        lat: 40.763596,
        lng: -73.974998,
      }),
      input: 'central park',
    }).set('Authorization', `Bearer ${accessToken}`);


    expect(results[0].description).toBe('Second station');
    expect(results[0].id).toBe(2);
    expect(googlePlacesMock.isDone()).toBe(true);
    expect(googlePlaceDetails.isDone()).toBe(true);
  });

  it('Can get places without available stations', async () => {
    const { accessToken } = await createUserAndLogin();
    mockedGetAvailablePlaces.mockImplementation(async () => []);
    const googlePlacesMock = getGooglePlacesMock();
    const googlePlaceDetails = mockGooglePlaceDetails();
    const { body: results } = await request(app).get(`${baseUrl}/me/places`).query({
      location: JSON.stringify({
        lat: 40.763596,
        lng: -73.974998,
      }),
      input: 'central park',
    }).set('Authorization', `Bearer ${accessToken}`);

    console.log(results);

    const googleSample = JSON.parse(googlePlacesSamples);
    expect(results[0].description).toBe(googleSample.predictions[0].description);
    expect(results[0].id).toBe(googleSample.predictions[0].id);
    expect(googlePlacesMock.isDone()).toBe(true);
    // When no available stations, call the place details for the first entry is not needed
    expect(googlePlaceDetails.isDone()).toBe(false);
  });
});

