// Creating map object
var myMap = L.map("mapid", {
    center: [34.0522, -118.2437],
    zoom: 5
  });
  
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
}).addTo(myMap);

// CHANGE TO CHANGE DATA SET
// var start_date = '2021-03-01';
// var end_date = '2021-03-10';
// var url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start_date}&endtime=${end_date}`;

function plotPoints(resp) {
  console.log(resp.features);

  var radius_scale_factor = 10000;
  resp.features.forEach(feat => {
    var quake_location = [feat.geometry.coordinates[1], feat.geometry.coordinates[0]];
    var pt_color = d3.interpolateRgb('white', 'purple')(feat.geometry.coordinates[2] / 10);

    // console.log(quake_location);
    L.circle(quake_location, {
      color: pt_color,
      fillColor: pt_color,
      fillOpacity: 0.5,
      radius: radius_scale_factor * feat.properties.mag
    }).addTo(myMap);
  });
};
// console.log(url);
var link = 'data/march2021_earthquakes.geojson'; 

d3.json(link, plotPoints);