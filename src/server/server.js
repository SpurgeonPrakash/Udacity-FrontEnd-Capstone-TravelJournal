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

let db = [];
const idCount = () => {
    let start = 0;return () => {start++; return start;}
}

const incrementor = idCount();

const getCountryName = async (countryCode) => {
    return axios.get(`https://restcountries.eu/rest/v2/alpha/${countryCode}`).then(resp => {
        return getImage(resp.data.name);
    }).catch(err => {
        return {message: err}
    })
}

const getImage = (imgName) => {
    const options = {
        url: `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${imgName}&image_type=photo&pretty=true`
    }
    return axios.get(options.url).then(resp => {
        // if data has a images then send a randomly selected img
        // otherwise search for countryname and return a country pic
        return resp.data.hits[0] ? resp.data.hits[Math.floor(Math.random() * Math.floor(resp.data.hits.length))] : false;
    }).catch(err => {
        return {message: err}
    })
}

const getLocations = async (locationName, extra) => {
    return axios.get(`http://api.geonames.org/postalCodeLookupJSON?username=${process.env.GEOLOCATION_KEY}&placename=${locationName}`)
        .then(resp => {
            const result = resp.data.postalcodes;
            if(extra == 'true'){
                return result;
            } else {
                return result.slice(0,5);
            }

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



app.get('/getLocationDetails/:location/:extra', async (req, res) => {
    try {
        const options = await getLocations(req.params.location, req.params.extra);
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

        trip.tripImg = getImage(trip.destination.locationName);
        trip.weather = getForecast(trip.destination.coordinates);

        [trip.tripImg , trip.weather] = await axios.all([trip.tripImg, trip.weather])
            .then(axios.spread( (img, weather) => {
            return [img , weather];
        }))

        trip.tripImg = trip.tripImg ? trip.tripImg : await getCountryName(trip.destination.countryCode);

        console.log('t.img ', trip.tripImg);
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

app.post('/deleteTrip', (req, res) => {
    try {
        console.log(req.body);
        if(req.body.id) {
            db = db.filter(obj => {
                return obj.id != req.body.id;
            })

            res.status(200).send({data: db});
        } else {
            console.log('girdi')
            throw new Error({err: 'id is required'});
        }
    } catch (e) {
        res.status(500).send({err: e});
    }
})



