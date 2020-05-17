# Udacity-FrontEnd-Capstone-TravelJournal
This project is the final assignment for Udacity Nanodegree program
Project is intended to be used as a Travel Journal.
This app allows users to store some information such as travel notes, dates, destinations about their upcoming trips

### Features
- Weather forecasting display for each trip
- Pulling featured images for each destination to be visited
- Removing Trips.
- Countdown for each upcoming trip

## Installation
- Clone the repo
- Create your .env file with following variables
- PIXABAY_KEY (refer to pixabay.com), WEATHERBIT_KEY (refer to weatherbit.io), GEOLOCATION_KEY (refer to geonames.org)
- ```npm install```
- ```npm start```
- ```npm run build-dev``` (for development)
- ```localhost:8081``` (for prod)

## Tests
- ```npm run test```

### Notes
- Webpack is configured for dev and prod environments
- LocalStorage and workbox-webpack-plugin is used for offline support

### Sample Images
- <img src="sampleImages/travel-journal.PNG" width="200" src="main"/>
- <img src="sampleImages/travel-journal2.PNG" width="200" src="add item"/>
- <img src="sampleImages/travel-journal3.PNG" width="200" src="add item2"/>
