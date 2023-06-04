var map = L.map("map").setView([55.8597930, -4.3226758], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
    maxZoom: 18,
  }).addTo(map);
