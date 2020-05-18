import {expect} from "@jest/globals";
const request = require('supertest');
import app from '../../../server/server';
import {getLocationDetails, submitTravel} from '../formHandler';

const trip = {
    duration: 5,
    departure: '01-16-1989',
    notes: 'live, love , give',
    destination: {
        placename: 'istanbul',
        locationName: 'istanbul',
        coordinates: [34.515 , 104.1441],
        countryCode: 'tr'
    }
}

describe("GET / test", () => {
    test("GET: Trips It should respond with an array", async () => {
        const response = await request(app).get("/getTrips");
        expect(response.body).toBeDefined();
        expect(response.statusCode).toBe(200);
    });

    test("It should return an array of 5 location items", async () => {
        const response = await request(app).get("/getLocationDetails/Paris/false");
        expect(response.body).toHaveLength(5);
        expect(response.statusCode).toBe(200);
    });
});

describe("POST / test", () => {
    test("POST: Trip, it should return an Array response with posted trip included", async () => {

        const response = await request(app).post("/addTrip").send(trip);
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(1);
        expect(response.statusCode).toBe(200);
    });

});

describe('TEST UI Side...', () => {
    test('getLocationDetails is defined', async () => {
        expect(getLocationDetails).toBeDefined();
    })
    test('submit a trip', async () => {
        expect(submitTravel).toBeDefined();
    })
})
