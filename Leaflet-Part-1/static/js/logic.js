// Get coordinates of USA from geoJSON.io: [ -97.84175240828246, 40.458548345076366]

// Creating our initial map object:
let myMap = L.map("map").setView([40.458548345076366,-97.84175240828246],5);

// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);

//
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(myMap);

// Store the API endpoint as url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to query the data
d3.json(url).then(function(response){
    console.log(response);
    var data = {
        "type": response.FeatureCollection,
        "features": response.features
    };
    createMarker(data);
});

// Create getColor function for marker color by depth value
function getColor(d){
    return d>= 90 ? markerColor="#ff3300":
    d>= 70 ? markerColor="#ff9900":
    d>= 50 ? markerColor="#ffcc66":
    d>= 30 ? markerColor="#ffcc33":
    d>= 10 ? markerColor="#ccff66":
    markerColor="#33ff00"
}

// Circle marker color by depth, size by magnitude
function createMarker(data){
    geojsonLayer = L.geoJson(data, {
        
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                color: "black",
                weight: 0.5,
                fillColor: getColor(feature.geometry.coordinates[2]), // Call getColor function
                radius: feature.properties.mag*3, 
                fillOpacity: 0.5,
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>Magnitude Level: ${feature.properties.mag}</h3><hr>
                             <p>Location: ${feature.properties.place}</p>
                             <p>Depth: ${feature.geometry.coordinates[2]}</p>
                             <p>Time: ${new Date(feature.properties.time)}</p>`);
        }
    }).addTo(myMap);
}

// Create legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = geojson.options.limits;
  var colors = geojson.options.colors;
  var labels = [];

  // Add the minimum and maximum.
  var legendInfo = "<h1>Population with Children<br />(ages 6-17)</h1>" +
    "<div class=\"labels\">" +
      "<div class=\"min\">" + limits[0] + "</div>" +
      "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding the legend to the map
legend.addTo(myMap);
