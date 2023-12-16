// Get coordinates of USA from geoJSON.io: [ -97.84175240828246, 40.458548345076366]

// Creating our initial map object:
let myMap = L.map("map").setView([40.458548345076366,-97.84175240828246],5);

// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store the API endpoint as url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to query the data
d3.json(url).then(function(response){
    console.log(response);
    // L.geoJson(data).addTo(myMap);
    // createFeatures(data.features);
    var data = {
        "type": response.FeatureCollection,
        "features": response.features
    };
    createMarker(data);
    // markerColor(data);
});

// function markerColor(data){
    
//         for (var i = 0; i<features.length;i++){
//             if (features.geometry.coordinates[2]>= 90) {"red"}
//             else if (features.geometry.coordinates[2]>=70) {"orange"}
//             else if (features.geometry.coordinates[2]>=50) {"lightorange"}
//             else if (features.geometry.coordinates[2]>=30) {"yellow"}
//             else if (features.geometry.coordinates[2]>=10) {"lightgreen"}
//             else {"green"}
//         }
    
// }
function getColor(d){
    return d>= 90 ? markerColor="#ff3300":
    d>= 70 ? markerColor="#ff9900":
    d>= 50 ? markerColor="#ffcc66":
    d>= 30 ? markerColor="#ffcc33":
    d>= 10 ? markerColor="#ccff66":
    markerColor="#33ff00"
}

function createMarker(data){

    geojsonLayer = L.geoJson(data, {
        
       
        // style: function(feature) {
        //     return {
        //         // fillColor: feature.geometry.coordinates[2],
        //         scale: ["#ffffb2", "#b10026"],
        //         steps: 6,
        //         mode: "e",
        //         radius: feature.properties.mag, 
        //         fillOpacity: 0.5,
        //         // color: "grey"
        //     };
        // },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                color: "black",
                weight: 0.5,
                // steps: 6,
                // q for quartile, e for equidistant, k for k-means
                // mode: "e",
                // style: {
                //     // Border color
                //     color: getColor(feature.geometry.coordinates[2]),
                //     weight: 0.1,
                //     fillOpacity: getColor(feature.geometry.coordinates[2]),
                //     },
                fillColor: getColor(feature.geometry.coordinates[2]),
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
// function createFeatures(earthquakeData) {
//     // Create pop-up that describes the place and time of the earthquake
//     function onEachFeature(feature, layer) {
//         layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
//       }
//     // Create a GeoJSON layer that contains the features array on the earthquakeData object.
//     // Run the onEachFeature function once for each piece of data in the array.
//      var earthquakes = L.geoJSON(earthquakeData, {
//         onEachFeature: onEachFeature
//     });

//     // Send our earthquakes layer to the createMap function/
//     createMap(earthquakes);






    // using the pointToLayer option to create a CircleMarker
    // var geojsonMarkerOptions = {
    //     radius: 8,
    //     fillColor: "#ff7800",
    //     color: "#000",
    //     weight: 1,
    //     opacity: 1,
    //     fillOpacity: 0.8
    // };

    // L.geoJSON(data.feature.p, {
    //     pointToLayer: function (feature, latlng) {
    //         return L.circleMarker(latlng, geojsonMarkerOptions);
    //     }
    // }).addTo(myMap);


