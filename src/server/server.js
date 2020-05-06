const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 8081;

app.use(express.static('dist'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = [];


app.listen(process.env.PORT || PORT, () => {
    console.log(`Express is started and running at port: ${PORT}`)
})

app.post('/addTrip', (req, res) => {
    try {
        const trip = req.body;
        console.log(trip);
        db.push(trip);
        res.status(200).send({
            message: 'successful',
            data: db
        })
    }catch (e) {
        res.status(500).send({
            message: 'Error',
            data: db
        })
    }
})
