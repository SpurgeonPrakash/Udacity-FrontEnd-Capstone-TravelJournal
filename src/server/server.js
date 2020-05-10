const express = require('express');
const http = require('http');
const https = require('https');
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



const getImage = async (imgName, method, caller) => {
    const options = {
        url: `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${imgName}&image_type=photo&pretty=true`,
        method: method
    }

    return request(options, caller);
}


app.listen(process.env.PORT || PORT, () => {
    console.log(`Express is started and running at port: ${PORT}`)

})



app.get('/getLocationDetails/:location', (req, res) => {

    try {
        http.get('http://api.geonames.org/postalCodeLookupJSON?username=bereket&placename='+req.params.location, resp => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                const result = JSON.parse(data).postalcodes;
                const blob = result.slice(0,4);

                res.status(200).send(blob);
            });

            resp.on('error', error => {
                res.status(500).send({
                    message: 'Location not found'
                })
            })
        })
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

        getImage(trip.destination.locationName, 'GET', (err, resp, body) => {
            let images = JSON.parse(body).hits;

            trip.tripImg = images[0];

            db.push(trip);

            res.status(200).send({
                message: 'successful',
                data: db
            })
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
