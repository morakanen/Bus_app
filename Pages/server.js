const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const { createPool } = require('mysql')

const pool = createPool({
  host: "localhost",
  user: "sqluser",
  password: "password",
  database: "gova-bus" 
})

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/icon-information', (req, res) => {
  const { lat, lng } = req.body;
  console.log(lat,lng)
  pool.query(
    "SELECT * FROM busstops WHERE latitude = ? AND longitude = ?",
    [lat, lng],
    (err, result) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); 
      } else {
        res.send(result); 
        console.log(result)
      }
    }
  );
});

app.get('/getbusstops', (req, res) => {
  pool.query(
    "SELECT latitude, longitude FROM busstops",
    (err, result) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.send(result); 
      }
    }
  );
});

app.get('/getbusstopsforusers', (req, res) => {
  pool.query(
    "SELECT busstopname, bearing, busstopindicator FROM busstops",
    (err, result) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); 
      } else {
        res.send(result); 
      }
    }
  );
});


app.listen(3000, () => {
  console.log('Listening on port 3000');
});
