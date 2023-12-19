// Get coordinates of USA from geoJSON.io: [40.072739193459284,-114.02797966452886]
// Use different coordinates for Part 2 [41.387784805380335,-83.40408973483318]

// Store the API endpoint as url, GET request to query the earthquake data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(function (response) {
    console.log(response);
    var data = {
        "type": response.FeatureCollection,
        "features": response.features
    };
    createMarker(data);
});



// Create getColor function for marker color by depth value
function getColor(d) {
    return d >= 90 ? "#FF3300" :
        d >= 70 ? "#FF9900" :
            d >= 50 ? "#FFCC33" :
                d >= 30 ? "#FFCC66" :
                    d >= 10 ? "#CCFF66" :
                        "#33FF00";
}

// Circle marker color by depth, size by magnitude
function createMarker(data) {
    // Create grey/satellite/outdoor tile layers 
    var greyMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
    });

    var satelliteMap = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    var outdoorsMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    });
    // Create base layer
    var baseMaps = {
        "Satellite": satelliteMap,
        "Grayscale": greyMap,
        "Outdoors": outdoorsMap
    };

    // Create layer groups
    var earthquake = L.layerGroup();
    var plates = L.layerGroup();

    // Create overlays that can be toggled on or off
    var overlayMaps = {
        "Earthquakes": earthquake,
        "Tectonic Plates": plates
    };

    // Create circle markers
    var geojsonLayer = L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
            return new L.CircleMarker(latlng, {
                color: "black",
                weight: 0.5,
                fillColor: getColor(feature.geometry.coordinates[2]), // Call getColor function
                radius: feature.properties.mag * 3,
                fillOpacity: 0.5,
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>Magnitude Level: ${feature.properties.mag}</h3><hr>
                             <p>Location: ${feature.properties.place}</p>
                             <p>Depth: ${feature.geometry.coordinates[2]}</p>
                             <p>Time: ${new Date(feature.properties.time)}</p>`);
        }
    });
    geojsonLayer.addTo(earthquake);

    // Store the API endpoint as url, GET request to query the tectonic plates data
    var tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"
    let platesGeojson = d3.json(tectonicURL).then(function (responsePlates) {
        console.log(responsePlates);
        var platesLayer = L.geoJson(responsePlates.features, {
        });
        platesLayer.addTo(plates);
    
        console.log(responsePlates);
    });

    // Creating our initial map object:
    let myMap = L.map("map", {
        center: [41.387784805380335, -83.40408973483318],
        zoom: 3,
        layers: [greyMap, earthquake, plates]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 10, 30, 50, 70, 90];
        var labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')  
        }
        return div;
    };
    legend.addTo(myMap);
}

