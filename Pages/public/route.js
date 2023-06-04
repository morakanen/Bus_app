var map = L.map("map").setView([55.8597930, -4.3226758], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
  maxZoom: 18,
}).addTo(map);

var icon = L.icon({
  iconUrl: 'Bus.png',
  iconSize: [30, 30],
  iconAnchor: [10, 10]
});
var selectBoxState = 'input1';
async function fetchBusStops() {
  try {
    const response = await fetch('/getbusstops');
    if (!response.ok) {
      throw new Error('Failed to fetch bus stops');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//adds the bus icon
async function addBusStopsToMap() {
  const busStops = await fetchBusStops();

  if(busStops !== null){
    busStops.forEach(stop => {
      var marker = L.marker([stop.latitude, stop.longitude], { icon: icon }).addTo(map);
      marker.on('click', async function () {
        var lat = marker.getLatLng().lat;
        var lng = marker.getLatLng().lng;

        var data = {
          lat: lat,
          lng: lng
        };

        try {
          const response = await fetch('/icon-information', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch bus stop information');
          }
  
          const result = await response.json();
          const optionText = `${result[0].busstopname}, ${result[0].bearing}, ${result[0].busstopindicator}`;
          
          // Change the selection in the appropriate select box
          var selectBox = document.getElementById(selectBoxState);
          for (let i = 0; i < selectBox.options.length; i++) {
            if (selectBox.options[i].text === optionText) {
              selectBox.selectedIndex = i;
              break;
            }
          }
  
          // Toggle the select box state
          selectBoxState = selectBoxState === 'input1' ? 'input2' : 'input1';

        } catch (error) {
          console.error(error);
        }
      });
    });
  }
}

//for the selectoptions
async function fetchBusStopsForUsers() {
  try {
    const response = await fetch('/getbusstopsforusers');
    if (!response.ok) {
      throw new Error('Failed to fetch bus stops for users');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function populateDropdowns() {
  const busStopsForUsers = await fetchBusStopsForUsers();
  
  if(busStopsForUsers !== null){
    let dropdown1 = document.getElementById('input1');
    let dropdown2 = document.getElementById('input2');
    
    busStopsForUsers.forEach(stop => {
      let option1 = document.createElement('option');
      let option2 = document.createElement('option');
      
      option1.text = `${stop.busstopname}, ${stop.bearing}, ${stop.busstopindicator}`;
      option2.text = `${stop.busstopname}, ${stop.bearing}, ${stop.busstopindicator}`;
      
      dropdown1.add(option1);
      dropdown2.add(option2);
    });
  }
}




// Call the function when the script runs
addBusStopsToMap();
populateDropdowns();
