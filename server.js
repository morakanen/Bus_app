const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//imports for MYSQL
const { createPool } = require('mysql')
const pool = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "gova" // Replace with your database name
})

const cors = require('cors');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(cors());

//render engine
app.set('views', './Pages/public');
app.set('view engine', 'ejs');

const path = require('path');
app.use(express.static('Pages/public'));

app.use(express.static(path.join(__dirname, 'Pages/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages/public', 'home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages/public', 'about.html'));
});

app.get('/route', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages/public', 'route.html'));
});


app.get('/bustimes', (req, res) => {
  // Get the stops and each of their next stops
  pool.query(
    "SELECT s.busstopname, rn.nextStopName, rn.nextStopTime, rn.routeName FROM gova.busstops AS s INNER JOIN gova.routenode AS rn ON rn.currentStop = s.id",
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving bus stops and next stops");
      } else {
        const stopsData = result;

        // Group the stops by bus stop name
        const groupedStops = {};
        stopsData.forEach(stop => {
          const { busstopname, nextStopName, nextStopTime, routeName } = stop;
          if (!groupedStops.hasOwnProperty(busstopname)) {
            groupedStops[busstopname] = [];
          }
          groupedStops[busstopname].push({ nextStopName, nextStopTime, routeName });
        });

        res.render('busTime', { groupedStops });
      }
    }
  );
});



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
  console.log('listening on port 3000')
})
