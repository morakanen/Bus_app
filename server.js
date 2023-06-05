const express = require('express');
const mongoose = require('mongoose');
const app = express();


//imports for MYSQL 
const { createPool } = require('mysql')


const pool = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "gova" // Replace with your database name
})

const cors = require('cors');

app.use(express.json());
app.use(cors());

//render engine
app.set('views', './Pages/public'); 
app.set('view engine', 'ejs');

const path = require('path');


// const uri='mongodb+srv://alanbiju1234:Soidontforget@synoptic.q5e7ldv.mongodb.net/?retryWrites=true&w=majority'

// async function connect(){
//     try{
//         await mongoose.connect(uri)
//         console.log("Connected to mongoDB") 
//     }catch (error){
//         console.error(error);
//     }
// }


app.use(express.static('Pages/public'));
// connect();


app.use(express.static(path.join(__dirname, 'Pages/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages/public', 'home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages/public', 'about.html'));
});

app.get('/bustimes', (req, res) => {
  // Get the stops and their respective next stops from the database
  pool.query(
    "SELECT s.busstopname, rn.nextStopName, rn.nextStopTime, rn.routeName FROM gova.busstops AS s INNER JOIN gova.routenode AS rn ON rn.currentStop = s.id",
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving bus stops and next stops");
      } else {
        const stopsData = result;
        console.log(stopsData);
        // Render the EJS template and pass the stopsData array as a variable
        res.render('busTime', { stopsData: JSON.stringify(stopsData) });
      }
    }
  );
});

app.listen(3000,()=>{
    console.log('listening on port 3000')
})


