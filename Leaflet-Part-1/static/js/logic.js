// Get coordinates of USA from geoJSON.io: [40.072739193459284,-114.02797966452886]

// Creating our initial map object:
let myMap = L.map("map").setView([40.072739193459284,-114.02797966452886],5);

// Adding a tile layer (the grey background) to our map:
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
    return d>= 90 ? "#FF3300":
    d>= 70 ? "#FF9900":
    d>= 50 ? "#FFCC33":
    d>= 30 ? "#FFCC66":
    d>= 10 ? "#CCFF66":
             "#33FF00";
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
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [-10,10,30,50,70,90];
  var labels = [];
  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:'+ getColor(grades[i] + 1) +'"></i> ' + 
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+') 
        // Alternative way:
        // labels.push('<i style="background:'+ getColor(grades[i] + 1) +'"></i> ' + 
        // grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'));   
    }
    // div.innerHTML = labels.join('');
return div;
};

legend.addTo(myMap);
