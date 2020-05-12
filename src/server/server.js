const express = require('express');
const http = require('http');
const axios = require('axios');
const request = require('request');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 8081;
require('dotenv').config();

app.use(express.static('dist'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = [];
const idCount = () => {
    let start = 0;return () => {start++; return start;}
}

const incrementor = idCount();

const getImage = async (imgName) => {
    const options = {
        url: `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${imgName}&image_type=photo&pretty=true`
    }
    return axios.get(options.url).then(resp => {
        return resp.data.hits[0];
    }).catch(err => {
        return {message: err}
    })
}

const getLocations = async (locationName) => {
    return axios.get(`http://api.geonames.org/postalCodeLookupJSON?username=${process.env.GEOLOCATION_KEY}&placename=${locationName}`)
        .then(resp => {
            console.log(resp);
            const result = resp.data.postalcodes;
            return result.slice(0,4);
        })
        .catch(err => {
            return {message: 'Location not found'}
        })
}

const getForecast = async ([lat, long]) => {
    return axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${long}&key=${process.env.WEATHERBIT_KEY}`)
        .then(resp => {
            return resp.data;
        })
        .catch(err => {
            return {err}
        })
}


app.listen(process.env.PORT || PORT, () => {
    console.log(`Express is started and running at port: ${PORT}`)

})



app.get('/getLocationDetails/:location', async (req, res) => {
    try {
        const options = await getLocations(req.params.location);
        res.status(200).send(options);
    } catch (e) {
        res.status(500).send({
            message: 'Location not found'
        })
    }
})

app.post('/addTrip', async (req, res) => {
    try {
        const trip = req.body;
        console.log(trip);
        trip.id = incrementor();
        trip.tripImg = await getImage(trip.destination.locationName);
        trip.weather = await getForecast(trip.destination.coordinates);
        db.push(trip);

        res.status(200).send({
            message: 'successful',
            data: db
        })
    }catch (e) {
        res.status(500).send({
            message: 'Error',
            data: e
        })
    }
})

app.get('/getTrips', (req, res) => {

    res.status(200).send(db);

})



