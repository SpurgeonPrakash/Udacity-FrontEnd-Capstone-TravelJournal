const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(express.static('dist'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.listen(process.env.PORT || PORT, () => {
    console.log(`Express is started and running at port: ${PORT}`)
})
